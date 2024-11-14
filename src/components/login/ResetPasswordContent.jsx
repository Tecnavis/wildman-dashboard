import React, { useEffect, useState } from 'react';
import Footer from '../footer/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { URL } from '../../Helper/handle-api';

const ResetPasswordContent = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    // Function to handle OTP request
    const handleGetOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/admin/forgot-password`, { email });
            if (response.status === 200) {
                setIsOtpSent(true);
                Swal.fire({
                    title: 'OTP Sent',
                    text: 'An OTP has been sent to your email. Please enter the OTP to reset your password.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to send OTP. Please check if the email is correct.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    // Function to handle password reset with OTP
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return Swal.fire({
                title: 'Password Mismatch',
                text: 'New Password and Confirm Password do not match.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        try {
            const response = await axios.post(`${URL}/admin/reset-password`, { email, otp, newPassword, confirmPassword });
            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Your password has been reset successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Redirect to login page or reset form
                    window.location.href = '/';
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Invalid OTP',
                text: 'The OTP you entered is incorrect or has expired. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
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
                />
              ))}{" "}
            </div>
            <Link to="/">
              <i className="fa-duotone fa-house-chimney"></i>
            </Link>
          </div>
          <div className="bottom">
            <h3 className="panel-title">Reset Password</h3>
            <form onSubmit={isOtpSent ? handleResetPassword : handleGetOtp}>
              <div className="input-group mb-30">
                <span className="input-group-text">
                  <i className="fa-regular fa-envelope"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {isOtpSent && (
                <>
                  <div className="input-group mb-30">
                    <span className="input-group-text">
                      <i className="fa-regular fa-lock"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group mb-30">
                    <span className="input-group-text">
                      <i className="fa-regular fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group mb-30">
                    <span className="input-group-text">
                      <i className="fa-regular fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <button className="btn btn-primary w-100 login-btn">
                {isOtpSent ? "Reset Password" : "Get OTP"}
              </button>
            </form>
            <div className="other-option">
              <p className="mb-0">
                Remember the password? <Link to="/">Login</Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
};

export default ResetPasswordContent;
