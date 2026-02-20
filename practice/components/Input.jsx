import React,{useState,useEffect} from 'react'

const Input = () => {
  const [inputValue, setInputValue] = useState('')
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(inputValue)
    }, 500)
    return () => clearTimeout(timer)
  }, [inputValue])
  return (
    <div>
    logs the input value after 500 ms change
    <input type='text' value={inputValue} onChange={(e) => setInputValue (e.target.value)}/>
   
    <p>Display value: {displayValue}</p>

    </div>
  )
}

export default Input