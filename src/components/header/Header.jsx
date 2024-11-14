import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DigiContext } from "../../context/DigiContext";
import HeaderChat from "./HeaderChat";
import HeaderNotification from "./HeaderNotification";
import HeaderProfile from "./HeaderProfile";
import Calculator from "./Calculator";
import axios from "axios";
import { URL } from "../../Helper/handle-api";

const Header = () => {
  const {
    isExpanded,
    toggleNav,
    isFullscreen,
    handleFullscreen,
    isLightTheme,
    handleSettingsToggle,
    isNavExpanded,
    toggleSidebar,
    isSmallScreen,
    ref,
    mobileHeaderBtn,
    handleMobileHeaderBtn,
  } = useContext(DigiContext);
  // Fetch logo
  const [logo, setLogo] = useState([]);
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${URL}/logo`);
        setLogo(response.data);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);
  return (
    <div
      className={`header ${
        isNavExpanded.isSmall && !isExpanded
          ? "expanded"
          : isExpanded && isNavExpanded.reset
          ? "expanded"
          : ""
      } ${isNavExpanded.reset && isExpanded ? "reset" : ""} ${
        mobileHeaderBtn ? "expanded-in-mobile" : ""
      } ${isNavExpanded.hoverOpen && isNavExpanded.hover ? "expanded" : ""}
        `}
    >
      <div className="row g-0 align-items-center">
        <div className="col-xxl-6 col-xl-5 col-4 d-flex align-items-center gap-20">
          <div className="main-logo d-lg-block d-none">
            <div className="logo-big">
              {logo.map((d) => (
              <Link to="#" key={d._id}>
                <img
                  src={`${URL}/images/${d.image}`}
                  alt="Logo"
                  style={{ width: "140px"}}
                />
              </Link>
               ))}
            </div>
            <div className="logo-small">
              <Link to="#">
                <img src="assets/images/logo-small.png" alt="Logo" />
              </Link>
            </div>
          </div>
          <div className="nav-close-btn" ref={ref}>
            {isSmallScreen ? (
              <button className="small" onClick={toggleSidebar}>
                <i className="fa-light fa-bars-sort"></i>
              </button>
            ) : (
              <button onClick={toggleNav}>
                <i className="fa-light fa-bars-sort"></i>
              </button>
            )}
          </div>
          <Link
            to="https://wildman.tecnavis.com/"
            target="_blank"
            className="btn btn-sm btn-primary site-view-btn"
          >
            <i className="fa-light fa-globe me-1"></i> <span>Website</span>
          </Link>
        </div>
        <div className="col-4 d-lg-none">
          {isLightTheme ? (
            <div className="mobile-logo">
              <Link to="#">
                <img src="assets/images/logo-black.png" alt="Logo" />
              </Link>
            </div>
          ) : (
            <div className="mobile-logo">
              {logo.map((d) => (
              <Link to="#" key={d._id}>
                <img
                  src={`${URL}/images/${d.image}`}
                  alt="Logo"
                  style={{ width: "140px"}}
                />
              </Link>
               ))}
            </div>
          )}
        </div>
        <div className="col-xxl-6 col-xl-7 col-lg-8 col-4">
          <div className="header-right-btns d-flex justify-content-end align-items-center">
            <div
              className={`header-collapse-group ${
                mobileHeaderBtn ? "d-block" : ""
              }`}
            >
              <div className="header-right-btns d-flex justify-content-end align-items-center p-0">
                <form className="header-form">
                  <input
                    type="search"
                    name="search"
                    placeholder="Search..."
                    required
                  />
                  <button type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </form>
                <div className="header-right-btns d-flex justify-content-end align-items-center p-0">
                  <HeaderChat />
                  <HeaderNotification />
                  <Calculator />
                  <button
                    className="header-btn fullscreen-btn"
                    id="btnFullscreen"
                    onClick={handleFullscreen}
                  >
                    <i
                      className={`fa-light ${
                        isFullscreen ? "fa-compress" : "fa-expand"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            <button
              className="header-btn header-collapse-group-btn d-lg-none"
              onClick={handleMobileHeaderBtn}
            >
              <i className="fa-light fa-ellipsis-vertical"></i>
            </button>
            <button
              className="header-btn theme-settings-btn d-lg-none"
              onClick={handleSettingsToggle}
            >
              <i className="fa-light fa-gear"></i>
            </button>
            <HeaderProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;