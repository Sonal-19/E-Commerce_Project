import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faArrowLeft, faEdit, faMessage, faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap"; 
import "./Blog.css";

const BlogContent = () => {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Blog');
  })
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
  const { blogId } = useParams();
  const userId = localStorage.getItem("userDetail")
    ? JSON.parse(localStorage.getItem("userDetail"))._id
    : "";

  const fetchBlogDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3059/users/api/getBlogById/${blogId}`
      );
      setSelectedBlog(response.data);
    } catch (error) {
      console.error("Error fetching Blog details:", error.message);
    }
  }, [blogId]);

  useEffect(() => {
    const fetchDetailsAndSetBlog = async () => {
      await fetchBlogDetails();
    };
    fetchDetailsAndSetBlog();
  }, [blogId, fetchBlogDetails]);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }
    try {
      await axios.post(
        `http://localhost:3059/users/api/like/${blogId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlogDetails();
    } catch (error) {
      console.error("Error liking blog:", error.message);
    }
  };

  const handleComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }
    try {
      await axios.post(
        `http://localhost:3059/users/api/comment/${blogId}`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchBlogDetails();
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const handleEditComment = (commentId, currentText) => {
    setEditedCommentId(commentId);
    setEditedCommentText(currentText);
  };

  const handleSaveEdit = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:3059/users/api/editcomment/${commentId}`,
        { text: editedCommentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchBlogDetails();
      setEditedCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Error editing comment:", error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:3059/users/api/deletecomment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchBlogDetails();
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  return (
    <>
      {selectedBlog && (
        <div className="container d-flex flex-column align-items-center mt-4">
          <div className="cardAP rounded bg-white border shadow p-4 pb-5 mb-5">
            <div className="d-flex justify-content-end">
              <Link to="/userblog" className="btn btn-light">
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
                <div className="col-12">
                  <div className="ms-4">
                    <div className="text-center">
                    <button
                      className="btn btn-outline-white"
                      onClick={handleLike}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} className="heart-white" />
                    </button>
                    <span className="me-2">
                      {selectedBlog.likeCount}
                    </span>
                    <button className="btn btn-outline-white">
                        <FontAwesomeIcon icon={faMessage} className="heart-white" />
                    </button>
                    <span className="me-2">
                     {selectedBlog.comments.length}
                    </span>
                    </div>
                    <div className="col-md-10 ms-5 ps-5">
                      <div className="row">
                        <div className="col-11">
                          <textarea
                            className="form-control card"
                            placeholder="Add a comment..."
                            onChange={(e) => setCommentText(e.target.value)}
                            value={commentText}
                          ></textarea>
                        </div>
                        <div className="col-1">
                          <button
                            className="btn btnA mt-2"
                            onClick={handleComment}
                          >
                            <FontAwesomeIcon icon={faAdd} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 ms-5">
                    {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
                      selectedBlog.comments.map((comment) => (
                        <div key={comment._id}>
                          {console.log("Comment data:", comment)}
                          <p className="ms-5 pb-1">
                            <strong>{comment.user && comment.user.name}</strong>{" "}
                            {comment._id === editedCommentId ? (
                              <textarea
                                className="form-control"
                                onChange={(e) => setEditedCommentText(e.target.value)}
                                value={editedCommentText}
                              ></textarea>
                            ) : (
                              <p style={{ fontStyle: "italic" }}>
                                  {comment.text } 
                              </p>
                            )}    
                            {console.log("User ID:", userId)}
                            {console.log("Comment User ID:", comment.user && comment.user._id)}
                            {comment.user && comment.user._id === userId && (
                              <span>
                                {comment._id === editedCommentId ? (
                                  <>
                                    <button
                                      className="btn btn-secondary me-2"
                                      onClick={() => handleSaveEdit(comment._id)}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="btn btn-danger m-2"
                                      onClick={() => {
                                        setEditedCommentId(null);
                                        setEditedCommentText("");
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      className="btn me-2"
                                      onClick={() => handleEditComment(comment._id, comment.text)}
                                      disabled={editedCommentId !== null}
                                    >
                                      <FontAwesomeIcon icon={faEdit} style={{ color: "gray" }}/>
                                    </button>
                                    <button
                                      className="btn"
                                      onClick={() => handleDeleteComment(comment._id)}
                                      disabled={editedCommentId !== null}
                                    >
                                    <FontAwesomeIcon icon={faTrash} style={{ color: "gray" }}/>
                                    </button>
                                  </>
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      <Modal show={showLoginPopup} onHide={() => setShowLoginPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please log in to like the blog or add comments.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowLoginPopup(false);
              // Navigate to your login page using react-router-dom's useHistory
              navigate("/login");
            }}
          >
            Log In
          </Button>
          <Button variant="secondary" onClick={() => setShowLoginPopup(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default BlogContent;
