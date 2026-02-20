import { useState } from 'react'

import './App.css'
import Toggle from '../components/Toggle'
import Input from '../components/Input'
function App() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  const increment = () => {
    setCount(count + step)
  }
  const decrement = () => {
    setCount(count - step)
  }
  const reset = () => {    
    setCount(0)
  }
  return (
    <div className="App gap-8">
      <h1 className="text-xl font-bold">Count: {count}</h1>
      <input
       type="number"
       value={step}
       onChange={(e) => setStep(Number(e.target.value))}
      />
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
      <Toggle />
      <Input/>

    </div>
  )
}

export default App
