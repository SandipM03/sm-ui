import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Autocomplete from './autocomplete';

describe('Autocomplete - Cache Functionality', () => {
  let fetchSuggestionsMock;

  beforeEach(() => {
    fetchSuggestionsMock = vi.fn();
  });

  it('should cache results and return cached data on subsequent searches (cache hit)', async () => {
    const mockData = ['React', 'Redux', 'React Router'];
    
    fetchSuggestionsMock.mockResolvedValue(mockData);

    render(
      <Autocomplete
        fetchSuggestions={fetchSuggestionsMock}
        placeholder="Search..."
        dataKey=""
      />
    );

    const input = screen.getByPlaceholderText('Search...');

    // First search - should call API
    await userEvent.type(input, 're');
    
    await waitFor(() => {
      expect(fetchSuggestionsMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('listitem');
      expect(suggestionItems.length).toBeGreaterThan(0);
      expect(suggestionItems[0].textContent).toContain('React');
    });

    // Clear input
    await userEvent.clear(input);
    
    await waitFor(() => {
      expect(screen.queryAllByRole('listitem').length).toBe(0);
    });

    // Second search with same query - should use cache (no additional API call)
    await userEvent.type(input, 're');

    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('listitem');
      expect(suggestionItems.length).toBeGreaterThan(0);
      expect(suggestionItems[0].textContent).toContain('React');
    });

    // Verify API was still only called once (cache hit)
    expect(fetchSuggestionsMock).toHaveBeenCalledTimes(1);
  });

  it('should make new API call for different query (cache miss)', async () => {
    const mockDataReact = ['React', 'Redux', 'React Router'];
    const mockDataVue = ['Vue', 'Vuex', 'Vue Router'];
    
    fetchSuggestionsMock
      .mockResolvedValueOnce(mockDataReact)
      .mockResolvedValueOnce(mockDataVue);

    render(
      <Autocomplete
        fetchSuggestions={fetchSuggestionsMock}
        placeholder="Search..."
        dataKey=""
      />
    );

    const input = screen.getByPlaceholderText('Search...');

    // First search
    await userEvent.type(input, 're');
    
    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('listitem');
      expect(suggestionItems[0].textContent).toContain('React');
    });

    expect(fetchSuggestionsMock).toHaveBeenCalledTimes(1);

    // Clear and search different query
    await userEvent.clear(input);
    await userEvent.type(input, 'vu');

    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('listitem');
      expect(suggestionItems[0].textContent).toContain('Vue');
    });

    // Should have called API twice (different queries)
    expect(fetchSuggestionsMock).toHaveBeenCalledTimes(2);
  });

  it('should cache static data results', async () => {
    const staticData = ['Apple', 'Banana', 'Apricot', 'Avocado'];

    render(
      <Autocomplete
        stacticData={staticData}
        placeholder="Search fruits..."
        dataKey=""
      />
    );

    const input = screen.getByPlaceholderText('Search fruits...');

    // First search
    await userEvent.type(input, 'ap');
    
    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('listitem');
      expect(suggestionItems.length).toBe(2);
      expect(suggestionItems[0].textContent).toContain('Apple');
      expect(suggestionItems[1].textContent).toContain('Apricot');
    });

    // Clear and re-search
    await userEvent.clear(input);
    await userEvent.type(input, 'ap');

    // Results should appear instantly from cache
    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('listitem');
      expect(suggestionItems.length).toBe(2);
      expect(suggestionItems[0].textContent).toContain('Apple');
      expect(suggestionItems[1].textContent).toContain('Apricot');
    });
  });

  it('should display loading state only on first fetch, not on cache hit', async () => {
    const mockData = ['React', 'Redux'];
    
    fetchSuggestionsMock.mockResolvedValue(mockData);

    render(
      <Autocomplete
        fetchSuggestions={fetchSuggestionsMock}
        placeholder="Search..."
        cutomloading="Loading..."
      />
    );

    const input = screen.getByPlaceholderText('Search...');

    // First search - should show loading
    await userEvent.type(input, 're');
    
    // Loading may appear briefly
    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('listitem');
      expect(suggestionItems[0].textContent).toContain('React');
    });

    // Clear input
    await userEvent.clear(input);

    // Second search - cached, should not show loading
    await userEvent.type(input, 're');

    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('listitem');
      expect(suggestionItems[0].textContent).toContain('React');
    });

    // Verify no loading text is displayed on cache hit
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
