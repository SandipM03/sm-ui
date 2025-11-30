import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import useCache from '../hooks/use-cache';
import { validateTopicRelevance, searchDocumentation, validateAIQuery, buildAIPrompt } from '../utils/search-utils';
import SuggestionsList from './suggestions-list';
import './ai-search.css';
import { GoogleGenAI } from "@google/genai"
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
  const ai = new GoogleGenAI({});
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

const prompt= `You are a helpful and concise documentation assistant for a product focused on ${TOPIC}. Your primary goal is to answer questions related to this topic.
  1. If the user's question is directly related to ${TOPIC}, provide a clear and brief answer.
  2. If the user's question is COMPLETELY unrelated to ${TOPIC} (e.g., questions about cooking, history, or other product categories), you MUST politely decline and state, "I can only answer questions related to ${TOPIC} documentation. Please refine your query." Do not attempt to use search results for off-topic questions.
  3. Be brief, do not use Markdown headings or lists in your answer.`;
// Mock AI API call - Replace with your actual AI implementation
const callAIAPI = async (prompt, config) => {
  // Mock response for demonstration
  return new Promise(() => {
    setTimeout(async () => {
        const response = await ai.generateText({
            model: "gemini-2.5-flash",
            prompt: prompt.userPrompt,
            maxOutputTokens: 500,
           
        })
//       resolve(`This is a mock AI response about "${prompt.userPrompt.split('"')[1]}". 

// To enable real AI responses:
// 1. Get an API key from ${config.aiProvider}
// 2. Implement the callAIAPI function with your provider's API
// 3. For OpenAI, Anthropic, or custom AI endpoints

// Example for OpenAI:
// const response = await fetch('https://api.openai.com/v1/chat/completions', {
//   method: 'POST',
//   headers: {
//     'Authorization': 'Bearer YOUR_API_KEY',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     model: '${config.aiModel}',
//     messages: [
//       { role: 'system', content: prompt.systemPrompt },
//       { role: 'user', content: prompt.userPrompt }
//     ]
//   })
// });`);
    }, 1500);
  });
};

export default AISearchBar;
