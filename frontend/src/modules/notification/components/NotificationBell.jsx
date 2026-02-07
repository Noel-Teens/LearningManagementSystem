import { useEffect, useState } from "react";
import "../css/notification.css";
import { getNotifications } from "../services/notificationApi";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  return (
    <div className="notification-wrapper">
      <span className="bell" onClick={() => setOpen(!open)}>
        🔔
        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </span>

      {open && (
        <div className="panel">
          {notifications.map((n) => (
            <div key={n.id} className="item">
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
