import { AiOutlineClose,AiOutlineCheck, AiOutlineCloseCircle, AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import './notification.css'
const iconStyle={color:"white", size:24}
const icons={
    success: <AiOutlineCheck {...iconStyle} />,
    info: <AiOutlineInfoCircle {...iconStyle} />,
    warning: <AiOutlineWarning {...iconStyle} />,
    error: <AiOutlineCloseCircle {...iconStyle} />
}

const notification = ({type="info",message,onClose=()=>{}}) => {
  return (
    <div className={`notification ${type}`}>
        {/* icon */}
        {icons[type]}
        {/* message */}
        {message || "This is a notification"}
        {/* close button */}
        <AiOutlineClose color="white" className="closeBtn" onClick={()=>onClose}/>
    </div>
  )
}

export default notification