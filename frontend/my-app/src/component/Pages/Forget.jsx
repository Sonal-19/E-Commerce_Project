import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Forget() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Forget');
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
      const response = await axios.post("http://localhost:3059/users/api/forget-password", { email });
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
      const response = await axios.post('http://localhost:3059/users/api/resetpassword', {
        email,
        resetOTP:otp,
        newPassword,
      });
      console.log(response.data);
      setResetStatus(response.data.message);
      window.alert("Password Changed Successfully!");
      navigate("/login");
    } catch (error) {
      console.error('Error resetting password', error);
      setResetStatus('Error resetting password');
    }
  };

  return (
    <>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div className='container d-flex justify-content-center p-5 m-5'>
        <div className='cardA rounded bg-white border shadow p-5 mb-5'>
          <h2>Forget your password ?</h2>
          {resetStatus && <p>{resetStatus}</p>}
          {!otpSent ? (
            <>
              <p>Please enter the email to reset your password</p>
              <form className='row g-3' onSubmit={handleSendOTP}>
                <div className='col-12'>
                  <label className='form-label'>Enter your email</label>
                  <input
                    type='email'
                    className='form-control'
                    placeholder='example@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type='submit' className='btn btnA'>
                  Request Password Reset OTP
                </button>
                <div className="col-12 text-center">
                  <Link to="/login">Back to LOGIN</Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <p>Enter OTP and set a new password</p>
              <form className='row g-3' onSubmit={handleResetPassword}>
                <div className='col-12'>
                  <label className='form-label'>Enter OTP</label>
                  <input
                    type='text'
                    className='form-control'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label'>New Password</label>
                  <input
                    type='password'
                    className='form-control'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button type='submit' className='btn btnA w-100'>
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}