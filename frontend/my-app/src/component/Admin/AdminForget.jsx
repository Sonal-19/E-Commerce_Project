import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AdminForget() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Forget Password');
  })
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3059/users/api/forget-password-admin", { email });
      console.log(response.data);
      setResetStatus('OTP sent successfully');
      setOtpSent(true); 
    } catch (error) {
      console.error('Error sending OTP', error);
      setResetStatus('Error sending OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3059/users/api/resetpasswordadmin', {
        email,
        resetOTP: otp,
        newPassword,
      });
      console.log(response.data);
      setResetStatus(response.data.message);
      window.alert("Password Changed Successfully!");
      navigate("/adminlogin");
    } catch (error) {
      console.error('Error resetting password', error);
      setResetStatus('Error resetting password');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
      <div
        className="container-lg"
        style={{
          backgroundImage: `url('https://appsrv1-147a1.kxcdn.com/volt-dashboard/img/illustrations/signin.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <div className="cardA rounded bg-white border shadow p-5" style={{ maxWidth: '500px', width: '90vw' }}>
          <h2>Forget your password?</h2>
          {resetStatus && <p>{resetStatus}</p>}
          {!otpSent ? (
            <>
              <p>Please enter the email to reset your password</p>
              <form className="row g-3" onSubmit={handleSendOTP}>
                <div className="col-12">
                  <label className="form-label">Enter your email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btnA">
                  Request Password Reset OTP
                </button>
                <div className="col-12 text-center">
                  <Link to="/adminlogin">Back to LOGIN</Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <p>Enter OTP and set a new password</p>
              <form className="row g-3" onSubmit={handleResetPassword}>
                <div className="col-12">
                  <label className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btnA w-100">
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
