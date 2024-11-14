import { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';
import { URL } from '../../Helper/handle-api';

const HeaderProfile = () => {
    const {
      isProfileSidebarOpen, 
      handleProfileDropdownCheckboxChange, 
      handleProfileSidebarCheckboxChange
    } = useContext(DigiContext)
    const profileDropdownRef = useRef(null);

    // Effect to add event listener when the component mounts
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
          handleProfileDropdownCheckboxChange();
        }
      };
  
      if (isProfileSidebarOpen.dropdown) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isProfileSidebarOpen.dropdown, handleProfileDropdownCheckboxChange]);
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
    <div className="header-btn-box" ref={profileDropdownRef}>
      <div className="profile-btn-wrapper">
        <button
          className={`profile-btn ${isProfileSidebarOpen.dropdown ? 'show' : ''}`}
          id="profileDropdown"
          onClick={
            isProfileSidebarOpen.sidebar
              ? handleProfileSidebarCheckboxChange
              : handleProfileDropdownCheckboxChange
          }
        >
          <img src={`${URL}/images/${admin.image}`} alt="image" />
        </button>
        {isProfileSidebarOpen.dropdown && (
          <ul className={`dropdown-menu ${isProfileSidebarOpen.dropdown? 'show':''}`} aria-labelledby="profileDropdown">
            <li>
              <div className="dropdown-txt text-center">
                <p className="mb-0">{admin.name}</p>
                <span className="d-block">{admin.role}</span>
                <div className="d-flex justify-content-center">
                  <div className="form-check pt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="seeProfileAsSidebar"
                        checked={isProfileSidebarOpen.sidebar}
                        onChange={handleProfileSidebarCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor="seeProfileAsSidebar">See as sidebar</label>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <Link className="dropdown-item" to="/profile">
                <span className="dropdown-icon"><i className="fa-regular fa-circle-user"></i></span> Profile
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/chat">
                <span className="dropdown-icon"><i className="fa-regular fa-message-lines"></i></span> Message
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/shoppingbag">
                <span className="dropdown-icon"><i className="fa-regular fa-cart-plus"></i></span> Shopping Bag
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/task">
                <span className="dropdown-icon"><i className="fa-regular fa-calendar-check"></i></span> Taskboard
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" to="/editProfile">
                <span className="dropdown-icon"><i className="fa-regular fa-gear"></i></span> Settings
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/" onClick={handleLogout}>
                <span className="dropdown-icon"><i className="fa-regular fa-arrow-right-from-bracket"></i></span> Logout
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeaderProfile;
