import React, { useContext, useEffect, useState } from 'react';
import Footer from '../footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';
import { useForm } from '../../Helper/useForm';
import { loginAdmin, URL } from '../../Helper/handle-api';
import axios from 'axios';

const LoginContent = () => {
  const { passwordVisible, togglePasswordVisibility } = useContext(DigiContext);
  const [values, handleChange] = useForm({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
// Login function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!values.email || !values.password) {
      setError('Email and password are required');
      return;
    }
    try {
      const response = await loginAdmin({
        email: values.email,
        password: values.password,
      });

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('adminDetails', JSON.stringify(response.adminDetails));
        navigate('/dashboard');
      }else if (response.message === "Your account is blocked") {
      } else {
        setError('Invalid credentials');
      }
    }  catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message); // Handle other error messages
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    }
  };
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
            {logo.map((d) => (
                <img
                  key={d._id}
                  src={`${URL}/images/${d.image}`}
                  alt="Logo"
                  style={{ width: "140px" }}
                />
               ))}

          </div>
        </div>
        <div className="bottom">
          <h3 className="panel-title">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-30">
              <span className="input-group-text">
                <i className="fa-regular fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Email address"
                name="email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group mb-20">
              <span className="input-group-text">
                <i className="fa-regular fa-lock"></i>
              </span>
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="form-control rounded-end"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                required
              />
              <Link
                role="button"
                className="password-show"
                onClick={togglePasswordVisibility}
              >
                <i className="fa-duotone fa-eye"></i>
              </Link>
            </div>
            <div className="d-flex justify-content-between mb-30">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="loginCheckbox"
                />
                <label className="form-check-label text-white" htmlFor="loginCheckbox">
                  Remember Me
                </label>
              </div>
              <Link to="/resetPassword" className="text-white fs-14">
                Forgot Password?
              </Link>
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <button type="submit" className="btn btn-primary w-100 login-btn">
              Sign in
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginContent;
