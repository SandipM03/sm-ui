import { AiOutlineClose,AiOutlineCheck, AiOutlineCloseCircle, AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import './notification.css'

const icons={
    success: <AiOutlineCheck />,
    info: <AiOutlineInfoCircle />,
    warning: <AiOutlineWarning />,
    error: <AiOutlineCloseCircle />
}

const notification = ({type="info",message,onClose}) => {
  return (
    <div className={`notification ${type}`}>
        {/* icon */}
        {icons[type]}
        {/* message */}
        {message || "This is a notification"}
        {/* close button */}
        <AiOutlineClose color="white"/>
    </div>
  )
}

export default notification