import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import useCache from '../hooks/use-cache';
import { validateTopicRelevance, searchDocumentation, validateAIQuery, buildAIPrompt } from '../utils/search-utils';
import SuggestionsList from './suggestions-list';
import './ai-search.css';

const AISearchBar = ({ config }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showAIOption, setShowAIOption] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  
  const { getCachedValue, addToCache } = useCache();
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1);
    setShowAIOption(false);
    setAiResponse(null);
    config.onSearch && config.onSearch(e.target.value);
  };

  const getSuggestions = useCallback(async (query) => {
    const cachedResult = getCachedValue(query);
    if (cachedResult !== null) {
      setSuggestions(cachedResult);
      setShowAIOption(cachedResult.length === 0 && config.aiEnabled);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let results = [];
      
      if (config.documentationData && config.documentationData.length > 0) {
        results = searchDocumentation(
          query,
          config.documentationData,
          config.dataKey,
          config.maxSuggestions
        );
      } else if (config.searchAPI) {
        const response = await fetch(config.searchAPI.replace('{query}', encodeURIComponent(query)));

        if (!response.ok) throw new Error('Search API failed');
        const data = await response.json();
        results = Array.isArray(data) ? data : (data.results || data.items || []);
        results = results.slice(0, config.maxSuggestions);
      }
      
      const validation = validateTopicRelevance(query, config);
      
      if (!validation.isValid && config.strictMode) {
        setError(validation.message);
        setSuggestions([]);
        setShowAIOption(false);
      } else {
        setSuggestions(results);
        addToCache(query, results);
        setShowAIOption(results.length === 0 && config.aiEnabled);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch suggestions');
      setSuggestions([]);
      setShowAIOption(config.aiEnabled);
    } finally {
      setLoading(false);
    }
  }, [config, getCachedValue, addToCache]);

  useEffect(() => {
    if (inputValue.length >= config.minQueryLength) {
      const debouncedFetch = debounce((query) => {
        getSuggestions(query);
      }, 300);
      debouncedFetch(inputValue);
      
      return () => {
        debouncedFetch.cancel();
      };
    } else {
      setSuggestions([]);
      setShowAIOption(false);
    }
  }, [inputValue, getSuggestions, config.minQueryLength]);

  const handleSuggestionClick = (suggestion) => {
    const displayValue = typeof suggestion === 'string' ? suggestion : suggestion[config.dataKey];
    setInputValue(displayValue);
    setSuggestions([]);
    setShowAIOption(false);
    config.onSelect && config.onSelect(suggestion);
  };

  const handleAISearch = async () => {
    const validation = validateAIQuery(inputValue, config);
    
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    setAiLoading(true);
    setError(null);
    
    try {
      const prompt = buildAIPrompt(inputValue, config, suggestions);
      config.onAISearch && config.onAISearch(inputValue, prompt);
      
      const aiResult = await callAIAPI(prompt, config);
      
      setAiResponse(aiResult);
      setSuggestions([]);
      setShowAIOption(false);
    } catch (err) {
      console.error('AI search error:', err);
      setError('Failed to get AI response. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0 && !showAIOption) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (showAIOption && selectedIndex === -1) {
          handleAISearch();
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setShowAIOption(false);
        setAiResponse(null);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`ai-search-container theme-${config.theme}`} style={config.customStyles}>
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          className="search-input"
          value={inputValue}
          placeholder={config.placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {inputValue && (
          <button 
            className="clear-button"
            onClick={() => {
              setInputValue('');
              setSuggestions([]);
              setShowAIOption(false);
              setAiResponse(null);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {(suggestions.length > 0 || loading || error || showAIOption) && (
        <div className="search-dropdown">
          {loading && <div className="search-loading">Searching...</div>}
          {error && <div className="search-error">{error}</div>}
          
          {!loading && !error && suggestions.length > 0 && (
            <ul className="suggestions-list">
              <SuggestionsList
                dataKey={config.dataKey}
                highlight={inputValue}
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                selectedIndex={selectedIndex}
              />
            </ul>
          )}
          
          {!loading && showAIOption && !aiResponse && (
            <div className="ai-search-option">
              <div className="ai-divider">
                <span>{config.noResultsMessage}</span>
              </div>
              <button
                className="ai-search-button"
                onClick={handleAISearch}
                disabled={aiLoading}
              >
                <svg className="ai-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{aiLoading ? 'Thinking...' : config.aiButtonText}</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      {aiResponse && (
        <div className="ai-response-panel">
          <div className="ai-response-header">
            <svg className="ai-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>AI Answer</span>
            <button onClick={() => setAiResponse(null)} className="close-ai">✕</button>
          </div>
          <div className="ai-response-content">
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );
};

// Gemini AI API call implementation
// eslint-disable-next-line no-unused-vars
const callAIAPI = async (prompt, config) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMNI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found. Please add VITE_GEMNI_API_KEY to your .env file');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${prompt.systemPrompt}\n\nUser Question: ${prompt.userPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Gemini API request failed');
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiText) {
      throw new Error('No response from Gemini AI');
    }

    return aiText;
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw error;
  }
};

export default AISearchBar;
