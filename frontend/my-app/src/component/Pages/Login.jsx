import './Login.css';
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Login() {

  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Login');
  })
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null); 


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required!"),
      password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is Required!"),
    }),
    
    onSubmit: async (values) => {
      console.log("Sending request...")
      try {
        const response = await axios.post("http://localhost:3059/users/api/login", values);
        console.log("Response received:", response.data);
        if (response.data.success) {
          console.log("Login Successful!");
          localStorage.setItem("userDetail", JSON.stringify(response.data.userDetail))
          localStorage.setItem("token", response.data.token)
          window.location.assign("http://localhost:3000/")
        }
        else {
          setLoginError("Login failed. Please check your email and password."); 
        }
      } catch (error) {
        console.error("Error", error);
        setLoginError("An error occurred while logging in. Please try again later."); 
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    <div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="bg bg3"></div>
      <div className="container d-flex flex-column justify-content-center align-items-center p-5 m-5">
      {/* <h2 className="text-bold font-monospace text-center mb-2">   </h2> */}
        <div className="cardA rounded bg-white border shadow p-4 mb-5 pb-5">
        <h2 className="text-bold font-monospace text-center mb-3">Login</h2>
          <form className="row g-3" onSubmit={formik.handleSubmit}>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${
                  formik.touched.email && formik.errors.email
                    ? "is-invalid"
                    : ""
                }`}
                placeholder='example@gmail.com'
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="your password"
                  {...formik.getFieldProps("password")}
                />
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>
            <div className="col-12">
              <button type="submit" className="btn btnA fw-bold fs-5px  w-100">
                LOGIN
              </button>
            </div>
          
            {loginError && ( 
              <div className="col-12 text-danger">
                {loginError}
              </div>
            )}
            <div className="col-6 text-center">
              <Link to='/forget'>Forget Password ?</Link>
            </div>
            <div className="col-6 text-center">
              <Link to='/signup'>Create Account ?</Link>
            </div>
          </form>
          <h2 className="text-bold font-monospace text-center mb-5">   </h2>
        </div>
      </div>
    </>
  );
}


