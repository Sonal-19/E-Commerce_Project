import React, { useEffect, useState } from "react";
import axios from "axios";
import { faEdit, faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function AllBlog() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Blog List');
  })
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:3059/users/api/getBlog");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching Blogs:", error.message);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:3059/users/api/deleteBlog/${blogId}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <div className="d-flex flex-column p-1 m-1 justify-content-center align-items-center">
        <h2 className="mb-4 text-bold font-monospace text-center">
          All Blogs
        </h2>
        <div className="cardAP rounded bg-white border shadow p-4 pb-5 mb-5">
          <div className="d-flex justify-content-end">
            <Link to="/addblog" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={blog._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      src={`http://localhost:3059/${blog.image}`}
                      alt={`${blog.name}'s Profile`}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td>{blog.name}</td>
                  <td>
                  <Link to={`/viewblog/${blog._id}`} 
                  className="btn btn-info me-2">
                   <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link
                      to={`/editblog/${blog._id}`}
                      className="btn btn-primary me-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteBlog(blog._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
