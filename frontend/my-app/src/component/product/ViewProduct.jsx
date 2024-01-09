import React, { useState, useEffect, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img1 from "../Images/img1.jpg";
import img2 from "../Images/img2.jpg";
import img3 from "../Images/img3.jpg";
// import img1 from "../Images/simg1.jpg";
// import img2 from "../Images/simg2.jpg";
// import img3 from "../Images/simg3.jpg";
import axios from "axios";
import { faArrowLeft, faArrowRight, faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ViewProduct.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(null);
  const [selectedProductSize, setSelectedProductSize] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const[showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginCart, setShowLoginCart] = useState(false);

  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3059/users/api/getWishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishlist(response.data.products.map((product) => product.productId));
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
    }
  };


  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:3059/users/api/viewproducts?search=&page=${page}`
      );
      setProducts(response.data.products);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages); // Update totalPages
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };
  
  
  const fetchSelectedSize = useCallback(() => {
    const storedSelectedSize = localStorage.getItem(
      `selectedSize_${selectedProduct?._id}`
    );
    const initialSelectedSizeIndex =
      storedSelectedSize !== null
        ? selectedProduct?.sizes.indexOf(storedSelectedSize)
        : null;

    if (initialSelectedSizeIndex !== -1) {
      setSelectedSizeIndex(initialSelectedSizeIndex);
      setSelectedProductSize(storedSelectedSize);
    } else {
      setSelectedSizeIndex(null);
      setSelectedProductSize(null);
    }
  }, [selectedProduct]);

  useEffect(() => {
    fetchProducts(currentPage);
    fetchWishlist();
  }, [currentPage]);
  

  useEffect(() => {
    if (selectedProduct) {
      fetchSelectedSize();
    }
  }, [selectedProduct, fetchSelectedSize]);


  const handleAddToWishlist = async (productId, isAlreadyInWishlist) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLoginPrompt();
        return;
      }
  
      setLoading(true);
      let response;
      if (isAlreadyInWishlist) {
        response = await axios.delete(
          `http://localhost:3059/users/api/removeFromWishlist/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3059/users/api/addToWishlist",
          {
            productId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setLoading(false);
  
      if (response.status === 200 || response.status === 201) {
        fetchWishlist();
      } else {
        console.error(
          "Error updating wishlist:",
          response.data.message || response.statusText
        );
      }
    } catch (error) {
      console.error("Error updating wishlist:", error.response || error.message);
    }
  };
  

  const handleProductClick = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(product);
    checkIfInCart(productId);
    setShowModal(true);
  };

  const checkIfInCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3059/users/api/getCart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const cart = response.data.data;
        const isInCart = cart.products.some(
          (item) => item.productId === productId
        );
        setIsInCart(isInCart);
      }
    } catch (error) {
      console.error("Error checking if in cart:", error);
    }
  };

  const handleSizeButtonClick = (index) => {
    setSelectedSizeIndex(index);
    setSelectedProductSize(
      Array.isArray(selectedProduct?.sizes)
        ? selectedProduct?.sizes[index]
        : typeof selectedProduct?.sizes === "string"
        ? selectedProduct?.sizes.split(",")[index]
        : null
    );
    localStorage.setItem(
      `selectedSize_${selectedProduct?._id}`,
      selectedProduct?.sizes[index]
    );
  };
  
const handleAddToCart = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLoginCart();
      return;
    }
    if (selectedSizeIndex !== null && selectedProduct?.sizes) {
      const response = await axios.post(
        "http://localhost:3059/users/api/addToCart",
        {
          productId,
          quantity: 1,
          size: selectedProductSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Product added to cart successfully");
        setIsInCart(true);
        setSelectedSizeIndex(null);

        // Fetch the updated cart after adding the product
        const updatedCartResponse = await axios.get(
          "http://localhost:3059/users/api/getCart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (updatedCartResponse.status === 200) {
          const updatedCart = updatedCartResponse.data.data;
          console.log("Updated cart state:", updatedCart);
          // Save the updated cart to localStorage
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
      } else {
        alert("Error adding product to cart");
      }
    } else {
      alert("Please select a size before adding to cart");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      console.log('New Page (Prev):', newPage);
      setCurrentPage(newPage);
      fetchProducts(newPage);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      console.log('New Page (Next):', newPage); 
      setCurrentPage(newPage);
      fetchProducts(newPage);
    }
  };

  const handleLoginPrompt = () =>{
    setShowLoginModal(true);
  }

  const handleLoginCart = () => {
    setShowLoginCart(true);
  };



  return (
    <>
      {/* Slider Component */}
      <div style={{ position: "relative" }} className="slider">
        <Slider {...settings} className="slide">
          <div>
            <img src={img2} alt="img 1" className="imgS" />
          </div>
          <div>
            <img src={img1} alt="img 2" className="imgS" />
          </div>
          <div>
            <img src={img3} alt="img 3" className="imgS" />
          </div>
        </Slider>
      </div>

      <div className="container d-flex flex-column justify-content-center align-items-center pb-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div key={product._id} className="col">
              <div className="cardP rounded bg-white border shadow m-3">
                <div className="position-relative">
                  <button
                    className={`btn btnW position-absolute top-0 end-0 m-2 rounded-circle ${
                      wishlist.includes(product._id)
                        ? "heart-pink"
                        : "heart-white"
                    }`}
                    onClick={() =>
                      handleAddToWishlist(
                        product._id,
                        wishlist.includes(product._id)
                      )
                    }
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  <img
                    src={`http://localhost:3059/${product.image}`}
                    alt={`${product.name}'s Profile`}
                    className="card-img-top BeerListItem-img"
                    onClick={() => handleProductClick(product._id)}
                  />
                </div>
                <div className="card-body font-monospace">
                  <h6 className="card-title m-2 text-center">{product.name}</h6>
                  <p className="card-text text-center mb-2">
                    <strong>₹{product.price}</strong>{" "}
                    <span className="discounted-price">
                      {product.previousPrice && (
                        <span>
                          <s className="text-secondary text-sm">
                            ₹{product.previousPrice}
                          </s>{" "}
                          <span className="discount-percentage text-warning text-sm">
                            ({Math.round(
                              ((product.previousPrice - product.price) /
                                product.previousPrice) *
                                100
                            )}
                           % OFF)
                          </span>
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-secondary mx-2" onClick={handlePrevPage}
          disabled={currentPage === 1} >
           <FontAwesomeIcon icon={faArrowLeft}/> Prev
        </button>
        <button className="btn btn-secondary mx-2" onClick={handleNextPage}
          disabled={currentPage === totalPages} >
          Next <FontAwesomeIcon icon={faArrowRight}/>
        </button>
        </div>

      </div>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please log in to add products to your wishlist.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowLoginModal(false);
              navigate("/login");
            }}
          >
            Log In
          </Button>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLoginCart} onHide={() => setShowLoginCart(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please log in to add products to your cart.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowLoginCart(false);
              navigate("/login");
            }}
          >
            Log In
          </Button>
          <Button variant="secondary" onClick={() => setShowLoginCart(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row g-3">
              <div className="col-6 position-relative">
                <button
                  className={`btn btnW position-absolute top-0 end-0 m-2 rounded-circle ${
                    wishlist.includes(selectedProduct?._id)
                      ? "heart-pink"
                      : "heart-white"
                  }`}
                  onClick={() =>
                    handleAddToWishlist(
                      selectedProduct?._id,
                      wishlist.includes(selectedProduct?._id)
                    )
                  }
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <img
                  src={`http://localhost:3059/${selectedProduct?.image}`}
                  alt={`${selectedProduct?.name}'s Profile`}
                  className="ms-2 card-img-top DBeerListItem-img"
                />
              </div>
              <div className="col-6">
                <div>
                  <h2 className="m-4 mb-2 mt-0">{selectedProduct?.name}</h2>
                </div>
                <div className="ms-4" style={{ fontStyle: "italic" }}>
                  {selectedProduct?.description}
                </div>
                <div>
                    <h6 className="ms-4 mt-1  text-secondary" style={{ fontStyle: "italic" }}>
                      {selectedProduct?.category}</h6>
                  </div>
                <div className="m-2 ms-4">
                  <strong>₹{selectedProduct?.price}</strong>{" "}
                  <span className="discounted-price">
                    {selectedProduct?.previousPrice && (
                      <span>
                        <s className="text-secondary">
                          ₹{selectedProduct?.previousPrice}
                        </s>{" "}
                        <span className="discount-percentage text-warning">
                          ({Math.round(
                            ((selectedProduct?.previousPrice -
                              selectedProduct?.price) /
                              selectedProduct?.previousPrice) *
                              100
                          )}
                          % off)
                        </span>
                      </span>
                    )}
                  </span>
                </div>

                <div className="m-4">
                  <label htmlFor="sizeSelect">Select Size: </label>
                  <div className="d-flex">
                    {Array.isArray(selectedProduct?.sizes) ? (
                      selectedProduct.sizes.map((size, index) => (
                        <button
                          key={size}
                          className={`btn ${
                            selectedSizeIndex === index ? "btn-primary" : "btn-secondary"
                          }`}
                          onClick={() => handleSizeButtonClick(index)}
                          style={{ marginRight: "5px" }}
                        >
                          {size.trim()}
                        </button>
                      ))
                    ) : typeof selectedProduct?.sizes === "string" ? (
                      selectedProduct.sizes.split(",").map((size, index) => (
                        <button
                          key={size}
                          className={`btn ${
                            selectedSizeIndex === index ? "btn-primary" : "btn-secondary"
                          }`}
                          onClick={() => handleSizeButtonClick(index)}
                          style={{ marginRight: "5px" }}
                        >
                          {size.trim()}
                        </button>
                      ))
                    ) : null}
                  </div>
                </div>

                <div className="m-4">
                  {isInCart ? (
                    <button
                      className="btn btn-success"
                      onClick={handleGoToCart}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} /> Go to Cart
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning"
                      onClick={() => handleAddToCart(selectedProduct?._id)}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewProduct;
