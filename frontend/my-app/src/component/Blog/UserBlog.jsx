import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import { Link } from "react-router-dom";
import "./Blog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function UserBlog() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Blog');
  })
  const [blogs, setBlogs] = useState([]);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:3059/users/api/getBlog");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching Blogs:", error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsBlackAndWhite((prev) => !prev);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
    reset: true,
  });

  const imageStyle = useSpring({
    filter: isBlackAndWhite ? "grayscale(100%)" : "grayscale(0%)",
    config: { duration: 1000 },
    reset: true,
  });

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center pb-5">
        {blogs.reduce((rows, blog, index) => {
          if (index % 3 === 0) {
            rows.push([]);
          }
          rows[rows.length - 1].push(blog);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} className="row row-cols-1 row-cols-md-3 g-4">
            {row.map((blog) => (
              <div key={blog._id} className="col">
                <animated.div style={fadeIn}>
                  <div className="cardU rounded bg-white border shadow m-3">
                    <div className="position-relative">
                      <animated.img
                        src={`http://localhost:3059/${blog.image}`}
                        alt={`${blog.name}'s Profile`}
                        className="card-img-top BeerListItem-imgU"
                        style={imageStyle}
                      />
                    </div>
                    <div className="card-body ">
                      <h5 className="card-title m-2 text-center">{blog.name}</h5>
                    </div>
                    <div>
                      <Link to={`/blog/${blog._id}`}>
                        <p className="text-center m-3 text-black text-style-none text-decoration-none">
                          View More <FontAwesomeIcon icon={faArrowRight} />
                        </p>
                      </Link>
                    </div>
                  </div>
                </animated.div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
