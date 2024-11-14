import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DigiContext } from "../../../context/DigiContext";

const ProfileRightSidebar = () => {
    const {
        isProfileSidebarOpen,
        handleProfileSidebarClose,
        handleProfileDropdownCheckboxChange,
        handleProfileSidebarCheckboxChange
    } = useContext(DigiContext)
    const profileSidebarRef = useRef(null);

    // Effect to add event listener when the component mounts
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (profileSidebarRef.current && !profileSidebarRef.current.contains(event.target)) {
            handleProfileSidebarCheckboxChange();
          }
        };
      
        if (isProfileSidebarOpen.sidebar) {
          document.addEventListener('mousedown', handleClickOutside);
        }
      
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isProfileSidebarOpen.sidebar, handleProfileSidebarCheckboxChange]);
//clear local storage      
      const handleLogout = () => {
        localStorage.removeItem('adminDetails');
        localStorage.removeItem('componentState');
        localStorage.removeItem('token');
        localStorage.clear();
      
        navigate("/");
      }; 
      //profile
    const admin = JSON.parse(localStorage.getItem('adminDetails'));    
  return (
    <div className={`profile-right-sidebar ${isProfileSidebarOpen.sidebar ? 'active' : ''}`} ref={profileSidebarRef}>
      <button className="right-bar-close" onClick={handleProfileSidebarClose}>
        <i className="fa-light fa-angle-right"></i>
      </button>
      <div className="top-panel">
        <div className="profile-content scrollable">
          <ul>
            <li>
              <div className="dropdown-txt text-center">
                <p className="mb-0">{admin.name}</p>
                <span className="d-block">{admin.role}</span>
                <div className="d-flex justify-content-center">
                  <div className="form-check pt-3">
                    <input
                    className="form-check-input"
                    type="checkbox"
                    id="seeProfileAsDropdown"
                    checked={isProfileSidebarOpen.dropdown}
                    onChange={handleProfileDropdownCheckboxChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="seeProfileAsDropdown"
                    >
                      See as dropdown
                    </label>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <Link className="dropdown-item" to="/profile">
                <span className="dropdown-icon">
                  <i className="fa-regular fa-circle-user"></i>
                </span>{" "}
                Profile
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/chat">
                <span className="dropdown-icon">
                  <i className="fa-regular fa-message-lines"></i>
                </span>{" "}
                Message
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/shoppingbag">
                <span className="dropdown-icon">
                  <i className="fa-regular fa-cart-plus"></i>
                </span>{" "}
                Shopping Bag
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/task">
                <span className="dropdown-icon">
                  <i className="fa-regular fa-calendar-check"></i>
                </span>{" "}
                Taskboard
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="#">
                <span className="dropdown-icon">
                  <i className="fa-regular fa-circle-question"></i>
                </span>{" "}
                Help
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="bottom-panel">
        <div className="button-group">
          <Link to="/editProfile">
            <i className="fa-light fa-gear"></i>
            <span>Settings</span>
          </Link>
          <Link to="/" onClick={handleLogout}>
            <i className="fa-light fa-power-off"></i>
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileRightSidebar;
