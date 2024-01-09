import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminOtpVerify() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Otp Verify');
  })
  const location = useLocation();
  const email = location.state ? location.state.email : null;

  const navigate = useNavigate();
  const [adminOtp, setAdminOtp] = useState("");

  const handleOtpSubmit = async () => {
    console.log("Email:", email);
    if (!adminOtp) {
      return toast.warning(`Please enter the OTP`);
    }
    try {
      const res = await axios.post(
        "http://localhost:3059/users/api/emailVerificationAdmin",
        {
          email: email,
          otp: adminOtp,
        }
      );

      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success(res.data.message);
        navigate("/adminlogin");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while verifying OTP");
    }
  };

  return (
   <>
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
        <div className="text-center card rounded bg-white border shadow p-4" style={{ maxWidth: '500px', width: '90vw' }}>
        <h2 className="text-bold font-monospace text-center mb-3">Enter OTP</h2>
          <p className="font-monospace">{`Enter the OTP sent to ${email}`}</p>
          <div className="col-12">
            <input
              type="text"
              className="w-100 px-3 py-2 rounded"
              placeholder="OTP"
              value={adminOtp}
              onChange={(e) => setAdminOtp(e.target.value)}
            />
          </div>
          <div className="col-12 mt-3">
            <button
              type="submit"
              className="btn btnA w-100"
              onClick={handleOtpSubmit}
            >
              Submit
            </button>
          </div>

          <div className="col-12 mt-3">
            <Link to="/adminsignup">Create Account ?</Link>
          </div>
        </div>
      </div>
      </div>
   </>
  )
}
