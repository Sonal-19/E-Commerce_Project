import React, { useEffect, useState } from "react";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignUp() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Sign Up');
  })

  const navigate = useNavigate();
  const[showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3059/users/api/signup",
        values
      );

      console.log("Signup Successful:", response.data);

      if (response.data.success) {
        window.alert("Signup Successful!");
        navigate("/otpverify", { state: { email: values.email } });
      } else {
        console.log("Signup failed. Please check your information.");
      }
    } catch (error) {
      console.error("Error", error);
      console.log(
        "An error occurred while signing up. Please try again later."
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      contact: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      contact: Yup.number().required("Contact number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required"),
    }),
    onSubmit,
  });

  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword);
  };

  return (
    <>
    <div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="bg bg3"></div>
      <div className="p-3 m-3 d-flex flex-column justify-content-center align-items-center">
        {/* <h2 className="text-bold font-monospace text-center mb-3">
          SignUp
        </h2> */}
        <div className="cardA rounded bg-white border shadow p-4 mb-5 pb-5">
        <h2 className="text-bold font-monospace text-center mb-3">
          SignUp
        </h2>
          <form className="row g-3" onSubmit={formik.handleSubmit}>
            <div className="col-12">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.name && formik.errors.name ? "is-invalid" : ""
                }`}
                id="name"
                placeholder="Name"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="contact" className="form-label">
                Contact No.
              </label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.contact && formik.errors.contact
                    ? "is-invalid"
                    : ""
                }`}
                id="contact"
                placeholder="Contact number"
                {...formik.getFieldProps("contact")}
              />
              {formik.touched.contact && formik.errors.contact && (
                <div className="invalid-feedback">{formik.errors.contact}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${
                  formik.touched.email && formik.errors.email
                    ? "is-invalid"
                    : ""
                }`}
                id="email"
                placeholder='example@gmail.com'
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  id="password"
                  placeholder="Password"
                  {...formik.getFieldProps("password")}
                />
                <button type='button' className='btn btn-light'
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEyeSlash}/>
                    ):(
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>
            <div className="col-12">
              <button type="submit" className="btn btnA w-100">
                Sign up
              </button>
              
            </div>
            <div className="col-12 text-center">
              <Link to="/login">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}



