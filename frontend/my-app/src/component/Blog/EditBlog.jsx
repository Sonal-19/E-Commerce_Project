import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBlog() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Edit Blog');
  })
  const { blogId } = useParams();
  const [blog, setBlog] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [blogImagePrev, setBlogImagePrev] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3059/users/api/getBlogById/${blogId}`
        );
        const blogData = response.data;

        setBlog((prevBlog) => ({
          ...prevBlog,
          name: blogData.name,
          image: blogData.image,
          description: blogData.description,
        }));

        setBlogImagePrev(URL.createObjectURL(blogData.image));
      } catch (error) {
        console.error("Error fetching Blog:", error.message);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleEditBlog = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", blog.name);
      formData.append("description", blog.description);
      if (blog.image) {
        formData.append("image", blog.image);
      }
      const response = await axios.put(
        `http://localhost:3059/users/api/editBlog/${blogId}`, formData,{
          headers: { Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      if (response.data.success) {
        window.alert("Blog updated successfully");
        navigate("/allblog");
      } else {
        console.log("Edit failed. Please check your information.");
      }
    } catch (error) {
      console.error("Error editing blog:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBlog((prevBlog) => ({
      ...prevBlog,
      image: file,
    }));
    setBlogImagePrev(URL.createObjectURL(file));
  };

  const handleCancelEdit = () => {
    navigate("/allblog");
  };


  return (
 <>
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h2 className="text-bold font-monospace text-center m-2">
        Edit Blog
      </h2>
      <div className="cardA rounded bg-white border shadow p-4 mb-3">
        <form className="row g-3">
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              type="text"
              value={blog.name}
              onChange={(e) => setBlog({ ...blog, name: e.target.value })}
              name="name"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              type="text"
              value={blog.description}
              onChange={(e) => setBlog({ ...blog, description: e.target.value })}
              name="description"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Image</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="col-12 text-center">
            {blogImagePrev ? (
              <img
                src={blogImagePrev}
                alt={`${blogImagePrev}'s Profile`}
                className="img-thumbnail"
                style={{ width: "100px", height: "100px" }}
              />
            ) : (
              <img
                src={`http://localhost:3059/${blog.image}`}
                alt={`${blog.image}'s Profile`}
                className="img-thumbnail"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
          <div className="col-12 mt-4 text-center">
            <button
              className="btn btnA me-4"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className="btn btnA"
              type="button"
              onClick={handleEditBlog}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
  );
}
