import React, { useCallback, useEffect, useState } from 'react'
import "./styles.css"
import SuggestionsList from './suggestions-list';
import debounce from 'lodash/debounce';
const Autocomplete = ({
        stacticData,
        fetchSuggestions,
        placeholder="",
        cutomloading="Loading...",
        onSelect=()=>{},
        onBlur=()=>{},
        onFocus=()=>{},
        onChange=()=>{},
        customStyles={},
        dataKey="",

}) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    console.log(suggestions);
    
    const handleInputChange = async (e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
        setSelectedIndex(-1);
    };
    const getSuggestions = async (query) => {
        setLoading(true);
        setError(null);
        try {
            let result;
            if(stacticData){
                result = stacticData.filter((item)=>{
                    return item.toLowerCase().includes(query.toLowerCase());
                });
            }else{
                result = await fetchSuggestions(query);
            }
            setSuggestions(result);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch suggestions");
            setSuggestions([])
        }finally{
            setLoading(false);
        }
    };
    const getSuggestionsDebounced = useCallback(
        debounce((query) => getSuggestions(query), 300),
        [stacticData, fetchSuggestions]
    );

  useEffect(() => {
    if (inputValue.length>1) {
       getSuggestionsDebounced(inputValue);
    }else{
        setSuggestions([]);
    }
  },[inputValue, getSuggestionsDebounced]);
  const handelSuggestionsClick = (suggestion) => {
 setInputValue(dataKey ? suggestion[dataKey] : suggestion);
    onSelect(suggestion);
    setSuggestions([]);
    setSelectedIndex(-1);
  }

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

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
          handelSuggestionsClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  }

  return (
    <div className='Container'>
        <input 
        type='text'
        value={inputValue} 
        placeholder={placeholder}
        style={customStyles}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        />
       
    {(suggestions.length >0|| loading|| error) && (
        <ul className="suggestions-list">
            {error && <div className='Error'>{error}</div>}
            {loading && <div className='Loading'>{cutomloading}</div>}
            <SuggestionsList 
            dataKey={dataKey}
            highlight={inputValue}
            suggestions={suggestions}
            onSuggestionClick={handelSuggestionsClick}
            selectedIndex={selectedIndex}
            />

        </ul>
    )}
       
    </div>
  )
}

export default Autocomplete