import {useState,useCallback,useRef,useEffect} from 'react';
import Notification from '../components/notification';


const useNotification = (position="top-right") => {
 const [notifications, setNotifications] = useState(null);
 const timer = useRef(null);
 
 const triggerNotification =useCallback((notificationProps) => {
    if (timer.current) {
        clearTimeout(timer.current);
    }
    setNotifications(notificationProps)
    timer.current = setTimeout(() => {
        setNotifications(null)
    }, notificationProps.duration);       
 },[]);
 
 useEffect(() => {
    return () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    };
 }, []);
 
 const NotificationComponent= notifications?(
    <div className={`${position}`}>
        <Notification {...notifications} />
    </div>
 ): null;
    return {NotificationComponent, triggerNotification};
};
export default useNotification