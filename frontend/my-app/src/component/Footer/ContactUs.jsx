import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './contact.css';

export default function ContactUs() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Contact Us');
  })

  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3059/users/api/contactus", values, {
          headers: {Authorization: `Bearer ${token}`,},
        });
      console.log("Submit Successful:", response.data);
      if (response.data.success) {
        window.alert("Submit Successful!");
        navigate("/");
      } else {
        console.log("Submit failed. Please check your information.");
      }
    } catch (error) {
      console.error("Error", error);
      console.log(
        "An error occurred while Submitting the form. Please try again later."
      );
    }
  };  

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit,
  });

  return (
    <>
    <div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="bg bg3"></div>
      <div className="p-3 m-3 mb-5  mt-5 d-flex flex-column justify-content-center align-items-center">
        {/* <h2 className="text-bold font-monospace text-center mb-3">
          Contact Us
        </h2> */}
        <div className="cardA rounded bg-white border shadow p-4 mb-5 pb-5">
        <h2 className="text-bold font-monospace text-center mb-3">
          Contact Us
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
                placeholder="example@gmail.com"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                className={`form-control ${
                  formik.touched.message && formik.errors.message
                    ? "is-invalid"
                    : ""
                }`}
                id="message"
                placeholder="Enter your message here"
                {...formik.getFieldProps("message")}
              ></textarea>
              {formik.touched.message && formik.errors.message && (
                <div className="invalid-feedback">{formik.errors.message}</div>
              )}
            </div>
            <div className="col-12">
              <button type="submit" className="btn btnA w-100">
                Submit
              </button>
            </div>
          </form>
        </div>
        <h2 className="text-bold font-monospace text-center mb-5">
          
        </h2>
      </div>
    </>
  );
}
