import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddBlog() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Add Blog');
  })
    const [blog, setBlog] = useState({
        name: "",
        description: "",
        image: null,
    });
    const navigate = useNavigate();

    const handleAddBlog = async (e) => {
        try {
            e.preventDefault()
          const token = localStorage.getItem('token');
          console.log('Token:', token);
          const formData = new FormData();
          formData.append("name", blog.name);
          formData.append("description", blog.description);
          formData.append("image", blog.image);
          
          const response = await axios.post("http://localhost:3059/users/api/addblog",formData,{
              headers: {Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",},
            });
          console.log("Blog added", response.data);
          if (response.data.success) {
            window.alert("Add Blog");
            navigate("/allblog");
          } else {
            console.log("Add blog failed. Please check your information.");
          }
        } catch (error) {
          console.error("Error adding Blog:", error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setBlog((prevBlog) =>({
          ...prevBlog,
          image: file,
        }));
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        setBlog((prevBlog) => ({
          ...prevBlog,
          [name]: updatedValue,
        }));
    };

  return (
    <>
          <div className="d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-bold font-monospace text-center m-3">Add Blog</h2>
        <div className="cardA rounded bg-white border shadow p-4 mb-5 pb-5">
            <form  className="row g-3">
                <div className="col-12">
                    <label className="form-label">Name </label>
                    <input 
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="blog name "
                    value={blog.name}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="col-12">
                    <label className="form-label">Description </label>
                    <textarea
                    className="form-control"
                    type="text"
                    name="description"
                    placeholder="enter description"
                    value={blog.description}
                    onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="col-12">
                    <label className="form-label">Image </label>
                    <input 
                    className="form-control"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    />
                </div>
                <div className="col-12">
                <button className="btn btnA w-100" 
                type="button"
                onClick={handleAddBlog}>Add Blog</button>
                </div>
            </form>
        </div>
      </div>
    </>
  )
}
