import React, { useContext, useEffect, useState } from 'react';
import Footer from '../footer/Footer';
import { Link } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';
import { useForm } from '../../Helper/useForm';
import { signupAdmin, URL } from '../../Helper/handle-api';
import Swal from 'sweetalert2'; 
import axios from 'axios';

const RegistrationContent = () => {
    const { passwordVisible, togglePasswordVisibility } = useContext(DigiContext);
    const [values, handleChange] = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
    });
    const [image, setImage] = useState('');
    const [passwordError, setPasswordError] = useState(null); 

    const handleImage = (e) => {
        setImage(e.target.files[0]);
    };

    // Password validation function
    const validatePassword = (password) => {
        const hasNumbers = /\d/;
        const hasAlphabets = /[a-zA-Z]/; 
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        if (!hasNumbers.test(password)) {
            return "Password must contain at least one number";
        }
        if (!hasAlphabets.test(password)) {
            return "Password must contain at least one alphabet";
        }
        return null;
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
        });
    };

    // Handle form submission for signup
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('role', values.role);
        formData.append('phone', values.phone);
        if (image) formData.append('image', image);

        try {
            await signupAdmin(formData); 
            Swal.fire({
              icon:"success",
              text:"Successfull"
            })
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'All fields are required';
            showErrorAlert(errorMessage); 
            const passwordValidationError = validatePassword(values.password);
            if (passwordValidationError) {
                setPasswordError(passwordValidationError); 
                showErrorAlert(passwordValidationError);
                return;
            } else {
                setPasswordError(null); 
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
              {logo.map((data) => (
                <img
                  key={data._id}
                  className="logo"
                  src={`${URL}/images/${data.image}`}
                  alt="Business Logo"
                  style={{ width: '150px'}}
                />
              ))}
            </div>
            <Link to="/">
              <i className="fa-duotone fa-sign-in"></i>
            </Link>
          </div>
          <div className="bottom">
            <h3 className="panel-title">Registration</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-30">
                <span className="input-group-text">
                  <i className="fa-regular fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                />
              </div>
              <div className="input-group mb-30">
                <span className="input-group-text">
                  <i className="fa-regular fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
              </div>
              <div className="input-group mb-30">
                <span className="input-group-text">
                  <i className="fa-regular fa-phone"></i>
                </span>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  value={values.phone}
                />
              </div>
              <div className="input-group mb-20">
                <span className="input-group-text">
                  <i className="fa-solid fa-id-card"></i>
                </span>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImage}
                />
              </div>
              <div className="input-group mb-30">
                <span className="input-group-text">
                  <i className="fa-solid fa-user"></i>
                </span>
                <select
                  className="form-select"
                  name="role"
                  onChange={handleChange}
                  value={values.role}
                >
                  <option value="">Select Role</option>
                  <option value="Main Admin">Main Admin</option>
                  <option value="Secondary Admin">Secondary Admin</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              <div className="input-group mb-20">
                <span className="input-group-text">
                  <i className="fa-regular fa-lock"></i>
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control rounded-end"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                />
                <Link
                  role="button"
                  className="password-show"
                  onClick={togglePasswordVisibility}
                >
                  <i className="fa-duotone fa-eye"></i>
                </Link>
              </div>
              <button className="btn btn-primary w-100 login-btn" type="submit">
                Sign up
              </button>
              <br />
            </form>
            <br />
          </div>
        </div>
        <Footer />
      </div>
    );
};

export default RegistrationContent;
