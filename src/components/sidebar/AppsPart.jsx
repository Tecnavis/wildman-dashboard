import React, { useContext} from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';

const AppsPart = () => {
  const { 
    state, 
    toggleCrmDropdown, 
    toggleHrmDropdown, 
    toggleAccountsDropdown,
    toggleEcommerceDropdown, 
    toggleMainDropdown, 
    toggleSubDropdown,
    layoutPosition, 
    dropdownOpen,
    mainAppsDropdownRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen
  } = useContext(DigiContext);
  const { 
    isMainDropdownOpen, 
    isCrmDropdownOpen, 
    isHrmDropdownOpen, 
    isAccountsDropdownOpen,
    isEcommerceDropdownOpen, 
    isSubDropdownOpen 
  } = state;
  
  const handleSubNavLinkClick = () => {
    if (!isSubDropdownOpen) {
      toggleSubDropdown(); // Open the sub-dropdown
    }
  };
 
  return (
    <li className="sidebar-item" ref={isExpanded || isNavExpanded.isSmall || layoutPosition.horizontal || (layoutPosition.twoColumn && isExpanded) || (layoutPosition.twoColumn && isSmallScreen) ? mainAppsDropdownRef : null}>
      <Link
        role="button"
        className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
        onClick={toggleMainDropdown}
      >
        Apps
      </Link>
      <ul className={`sidebar-link-group 
      ${layoutPosition.horizontal ? (dropdownOpen.apps ? 'd-block' : 'd-none') : (isMainDropdownOpen ? 'd-none' : '')}
      `}>       

        <li className="sidebar-dropdown-item" >
          <Link
            role="button"
            className={`sidebar-link has-sub ${isCrmDropdownOpen ? 'show' : ''}`}
            onClick={toggleCrmDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-headset"></i>
            </span>{' '}
            <span className="sidebar-txt">Inventory</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isCrmDropdownOpen && isSubDropdownOpen ? 'd-block' : ''
            }`}
            id="crmDropdown"
           
          >
            <li className="sidebar-dropdown-item">
              <NavLink to="/allProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Product List
              </NavLink>
            </li>
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/stocklist" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Stock List Report
              </NavLink>
            </li> */}
            <li className="sidebar-dropdown-item">
              <NavLink to="/purchaseditem" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Purchase Report 
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/returnproduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Return Products Report
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/customerorders" className="sidebar-link" onClick={handleSubNavLinkClick}>
               Customer Order Management
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/salesorders" className="sidebar-link" onClick={handleSubNavLinkClick}>
               Sales Order Management
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${isHrmDropdownOpen ? 'show' : ''}`}
            onClick={toggleHrmDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-tie"></i>
            </span>{' '}
            <span className="sidebar-txt">HRM</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isHrmDropdownOpen && isSubDropdownOpen ? 'd-block' : ''
            }`}
            id="hrmDropdown"
          >
          <li className="sidebar-dropdown-item">
            <NavLink to="/allCustomer" className="sidebar-link" onClick={handleSubNavLinkClick}>
              All Customer
            </NavLink>
          </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/supplier" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Suppliers
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/warehouse" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Warehouse
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/allEmployee" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Employee
              </NavLink>
            </li>
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/addEmployee" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Employee
              </NavLink>
            </li> */}
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/attendance" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Attendance
              </NavLink>
            </li> */}
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${isEcommerceDropdownOpen ? 'show' : ''}`}
            onClick={toggleEcommerceDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-cart-shopping-fast"></i>
            </span>{' '}
            <span className="sidebar-txt">eCommerce</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isEcommerceDropdownOpen && isSubDropdownOpen ? 'd-block' :''
            }`}
            id="ecommerceDropdown"

          >
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/addNewProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Product
              </NavLink>
            </li> */}
            <li className="sidebar-dropdown-item">
              <NavLink to="/allorder" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Order Product
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/allProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Product
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/category" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Category
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/banner" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Banner
              </NavLink>
            </li>
            

          </ul>
        </li>

        {/* <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${isAccountsDropdownOpen ? 'show' : ''}`}
            onClick={toggleAccountsDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-tie"></i>
            </span>{' '}
            <span className="sidebar-txt">Accounts</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isAccountsDropdownOpen && isSubDropdownOpen ? 'd-block' : ''
            }`}
            id="accountsDropdown"
          >
          <li className="sidebar-dropdown-item">
            <NavLink to="/leads" className="sidebar-link" onClick={handleSubNavLinkClick}>
              Leads
            </NavLink>
          </li>
          </ul>
        </li> */}

        {/* <li className="sidebar-dropdown-item">
            <NavLink to="/task" className="sidebar-link" onClick={handleSubNavLinkClick}>
              Task
            </NavLink>
          </li> */}

        <li className="sidebar-dropdown-item">
          <NavLink to="/task" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{' '}
            <span className="sidebar-txt">Task</span>
          </NavLink>
        </li>
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/calendar" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{' '}
            <span className="sidebar-txt">Calendar</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/chat" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-messages"></i>
            </span>{' '}
            <span className="sidebar-txt">Chat</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/email" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-envelope"></i>
            </span>{' '}
            <span className="sidebar-txt">Email</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/invoices" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-file-invoice"></i>
            </span>{' '}
            <span className="sidebar-txt">Invoices</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/contacts" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-user-plus"></i>
            </span>{' '}
            <span className="sidebar-txt">Contacts</span>
          </NavLink>
        </li> */}
      </ul>
    </li>
  );

};

export default AppsPart;
