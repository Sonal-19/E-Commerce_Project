import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const OtpVerify = () => {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Otp Verify');
  })
  const location = useLocation();
  const email = location.state ? location.state.email : null;

  const navigate = useNavigate();
  const [userOtp, setUserOtp] = useState("");

  const handleOtpSubmit = async () => {
    console.log("Email:", email);
    if (!userOtp) {
      return toast.warning(`Please enter the OTP`);
    }
    try {
      const res = await axios.post(
        "http://localhost:3059/users/api/emailVerification",
        {
          email: email,
          otp: userOtp,
        }
      );

      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while verifying OTP");
    }
  };

  return (
    <>
    <div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="bg bg3"></div>
      <div className="p-5 m-5 d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-bold font-monospace text-center mb-3">Enter OTP</h2>
        <div className="text-center card rounded bg-white border shadow p-4 mb-5 pb-5">
          <p className="font-monospace">{`Enter the OTP sent to ${email}`}</p>
          <div className="col-12">
            <input
              type="text"
              className="w-100 px-3 py-2 rounded"
              placeholder="OTP"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
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
            <Link to="/signup">Create Account ?</Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default OtpVerify;

