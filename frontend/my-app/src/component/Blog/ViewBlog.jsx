import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import './Blog.css';

export default function ViewBlog() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Blog');
  })
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { blogId } = useParams(); 

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3059/users/api/getBlogById/${blogId}`
        );
        setSelectedBlog(response.data);
      } catch (error) {
        console.error("Error fetching Blog details:", error.message);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  return (
    <>
      {selectedBlog && (
        <div className="container d-flex flex-column align-items-center mt-4">
          {/* <h2 className="mb-4 text-bold font-monospace text-center">
            Blog Details
          </h2> */}
          <div className="cardAP rounded bg-white border shadow p-4 pb-5 mb-5">
            <div className="d-flex justify-content-end">
              <Link to="/allblog" className="btn btn-light">
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
            </div>
            <div className="container d-flex">
              <div className="row g-3">
                <div className="col-12 text-center">
                  <img
                    src={`http://localhost:3059/${selectedBlog.image}`}
                    alt={`${selectedBlog.name}'s Profile`}
                    className="ms-2 card-img-top BeerListItem-imgB"
                  />
                </div>
                <div className="col-12 text-center">
                  <div>
                    <h2 className="m-4 mb-2 mt-0">{selectedBlog.name}</h2>
                  </div>
                </div>
                <div className="col-12 text-center">
                  <div className="ms-4" style={{ fontStyle: "italic" }}>
                    {selectedBlog.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
