import { NavLink, Link } from 'react-router-dom';
import { useContext } from 'react';
import { DigiContext } from '../../context/DigiContext';

const PagesPart = () => {
  const {
    pagesState,
    toggleMainPagesDropdown,
    toggleSubPagesDropdown,
    toggleAuthentication,
    toggleError,
    toggleUser,
    layoutPosition,
    dropdownOpen,
    mainPagesRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen,
    toggleAdditional
  } = useContext(DigiContext);
  const { 
    isMainDropdownOpen, 
    isSubDropdownOpen, 
    authentication, 
    user, 
    error,
    additional 
  } = pagesState;
  const handleSubNavLinkClick = () => {
    if (!isSubDropdownOpen) {
      toggleSubPagesDropdown(); // Open the sub-dropdown
    }
  };
  return (
    <li className="sidebar-item" ref={isExpanded || isNavExpanded.isSmall || layoutPosition.horizontal || (layoutPosition.twoColumn && isExpanded) || (layoutPosition.twoColumn && isSmallScreen) ? mainPagesRef : null}>
      <Link
        role="button"
        className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
        onClick={toggleMainPagesDropdown}
      >
        Create
      </Link>
      <ul className={`sidebar-link-group ${layoutPosition.horizontal ? (dropdownOpen.pages ? 'd-block' : '') : (isMainDropdownOpen ? 'd-none' : '')}`}>     
   
        {/* <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${authentication ? 'show' : ''}`}
            onClick={toggleAuthentication}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-cog"></i>
            </span>{' '}
            <span className="sidebar-txt">Authentication</span>
          </Link>
          <ul className={`sidebar-dropdown-menu ${authentication ? 'd-block' : ''}`}>
            <li className="sidebar-dropdown-item">
              <NavLink to="/" className="sidebar-link">
                Login 01
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/login2" className="sidebar-link">
                Login 02
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/login3" className="sidebar-link">
                Login 03
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/registration" className="sidebar-link">
                Registration 01
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/registration2" className="sidebar-link">
                Registration 02
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/resetPassword" className="sidebar-link">
                Reset Password
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/updatePassword" className="sidebar-link">
                Update Password
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/loginStatus" className="sidebar-link">
                Login Status
              </NavLink>
            </li>
          </ul>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${error ? 'show' : ''}`}
            onClick={toggleError}
          >
            <span className="nav-icon">
              <i className="fa-light fa-triangle-exclamation"></i>
            </span>{' '}
            <span className="sidebar-txt">Error</span>
          </Link>
          <ul className={`sidebar-dropdown-menu ${error ? 'd-block' : ''}`}>
           
            <li className="sidebar-dropdown-item">
              <NavLink to="/error403" className="sidebar-link">
                Error 403
              </NavLink>
            </li>
            
          </ul>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${additional ? 'show' : ''}`}
            onClick={toggleAdditional}
          >
            <span className="nav-icon">
              <i className="fa-light fa-square-plus"></i>
            </span>{' '}
            <span className="sidebar-txt">Additional</span>
          </Link>
          <ul className={`sidebar-dropdown-menu ${additional ? 'd-block' : ''}`}>
        
            <li className="sidebar-dropdown-item">
              <NavLink to="/pricingTable2" className="sidebar-link">
              Pricing Table
              </NavLink>
            </li>
          </ul>

        </li> */}
        <li className="sidebar-dropdown-item">
          <NavLink to="/customercreate" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-user-plus"></i>
            </span>{' '}
            <span className="sidebar-txt">Customer</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/createform" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-truck-ramp-box"></i>
            </span>{' '}
            <span className="sidebar-txt">Supplier</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/createform" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-shop"></i>
            </span>{' '}
            <span className="sidebar-txt">Warehouse</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/addNewProduct" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-box"></i>
            </span>{' '}
            <span className="sidebar-txt">Product</span>
          </NavLink>
        </li>
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/utility" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-layer-group"></i>
            </span>{' '}
            <span className="sidebar-txt">Utility</span>
          </NavLink>
        </li> */}
      </ul>
    </li>
  );
};

export default PagesPart;
