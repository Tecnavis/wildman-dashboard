import React, { useEffect, useState } from 'react'
import Footer from '../footer/Footer'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { URL } from '../../Helper/handle-api';

const UpdatePasswordContent = () => {
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
    <div className="main-content login-panel">
      <div className="login-body">
        <div className="top d-flex justify-content-between align-items-center">
          <div className="logo">
            {logo.map((data) => (
              <img
                key={data._id}
                className="logo"
                src={`${URL}/images/${data.image}`}
                alt="Business Logo"
              />
            ))}
          </div>
          <Link to="/">
            <i className="fa-duotone fa-house-chimney"></i>
          </Link>
        </div>
        <div className="bottom">
          <h3 className="panel-title">Update Password</h3>
          <form>
            <div className="input-group mb-30">
              <span className="input-group-text">
                <i className="fa-regular fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
              />
            </div>
            <div className="input-group mb-30">
              <span className="input-group-text">
                <i className="fa-regular fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm New Password"
              />
            </div>
            <button className="btn btn-primary w-100 login-btn">
              Update Password
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UpdatePasswordContent