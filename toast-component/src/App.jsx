
import './App.css'
import useNotification  from "./hooks/use-notification"

function App() {
  //custom hooks
const { NotificationComponent, triggerNotification } = useNotification("top-right");
  return (
   <>
   <button onClick={() => triggerNotification({type: 'success', message: "Operation successful!", duration: 3000})}>
    Success</button>
    <button onClick={() => triggerNotification({type: 'info', message: "Operation successful!", duration: 3000})}>
     info</button>
    <button onClick={() => triggerNotification({type: 'warning', message: "Operation successful!", duration: 3000})}>
    warning</button>
    <button onClick={() => triggerNotification({type: 'error', message: "Operation successful!", duration: 3000})}>
    error</button>
   {NotificationComponent}
   <p>tool component </p>
   </>
  )
}

export default App
