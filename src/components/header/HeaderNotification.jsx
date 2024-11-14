import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';
import { fetchNotifications, deleteNotification } from '../../Helper/handle-api';
import "./style.css"

const HeaderNotification = () => {
  const { isNotificationDropdownOpen, toggleNotificationDropdown } = useContext(DigiContext);
  const notificationDropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Default to show 5 notifications

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetchNotifications();
        setNotifications(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };
    getNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        toggleNotificationDropdown();
      }
    };

    if (isNotificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationDropdownOpen, toggleNotificationDropdown]);

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prevNotifications) => prevNotifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleShowAll = () => {
    setVisibleCount(notifications.length); // Set to show all notifications
  };

  return (
    <div className="header-btn-box" ref={notificationDropdownRef}>
      <button
        className={`header-btn ${isNotificationDropdownOpen ? 'show' : ''}`}
        id="notificationDropdown"
        data-bs-toggle="dropdown"
        aria-expanded={isNotificationDropdownOpen}
        onClick={toggleNotificationDropdown}
      >
        <i className="fa-light fa-bell"></i>
        <span className="badge bg-danger">{notifications.length}</span>
      </button>
      <ul
        className={`notification-dropdown dropdown-menu ${isNotificationDropdownOpen ? 'show' : ''}`}
        aria-labelledby="notificationDropdown"
      >
        {notifications.length > 0 ? (
          notifications.slice(0, visibleCount).map((notification) => (
            <li key={notification._id} className="d-flex justify-content-between align-items-center">
              <Link to="#" className="d-flex align-items-center">
                <div className="notification-txt">
                  <span className="notification-icon text-primary">
                    <i className="fa-solid fa-box"></i>
                  </span>{' '}
                  <span className="fw-bold">{notification.message}</span>
                </div>
              </Link>
              <button
                className="close-btn"
                aria-label="Close"
                onClick={() => handleDeleteNotification(notification._id)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </li>
          ))
        ) : (
          <li>
            <div className="notification-txt">
              <span>No new notifications</span>
            </div>
          </li>
        )}

        <li>
          <Link to="#" className="show-all-btn" onClick={handleShowAll}>
            Show all messages
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderNotification;
