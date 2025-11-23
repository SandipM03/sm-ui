import React, { useEffect, useState } from 'react'
import "./styles.css"
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
    console.log(suggestions);
    
    const handleInputChange = async (e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
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
            setError("Failed to fetch suggestions");
            setSuggestions([])
        }finally{
            setLoading(false);
        }
  };
  useEffect(() => {
    if (inputValue.length>1) {
        getSuggestions(inputValue);
    }else{
        setSuggestions([]);
    }
  },[inputValue])

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
        />
        {error && <div className='Error'>{error}</div>}
        {loading && <div className='Loading'>{cutomloading}</div>}
    </div>
  )
}

export default Autocomplete