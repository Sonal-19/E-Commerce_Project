import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Product.css";

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product data...");
        if (productId) {
          console.log("Fetching product data for ID:", productId);
          const response = await axios.get(
            `http://localhost:3059/users/api/viewproducts/${productId}`
          );
          console.log("Received product data:", response.data);
          setProduct(response.data);

          checkIfInCart(productId);
          checkIfInWishlist(productId);
        } else {
          console.log("Product ID is undefined.");
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchProduct();
  }, [productId]);

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

  const checkIfInWishlist = async (productId) => {
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

      if (response.status === 200) {
        const wishlist = response.data.products.map(
          (product) => product.productId
        );
        const isInWishlist = wishlist.includes(productId);
        setIsInWishlist(isInWishlist);
      }
    } catch (error) {
      console.error("Error checking if in wishlist:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token sent in the request:", token);
      const response = await axios.post(
        "http://localhost:3059/users/api/addToCart",
        {
          productId,
          quantity: 1,
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
      } else {
        alert("Error adding product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token sent in the request:", token);
      const response = await axios.post(
        "http://localhost:3059/users/api/addToWishlist",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Product added to wishlist successfully");
        setIsInWishlist(true);
      } else {
        alert("Error adding product to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token sent in the request:", token);
      const response = await axios.delete(
        `http://localhost:3059/users/api/removeFromWishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Product removed from wishlist successfully");
        setIsInWishlist(false);
      } else {
        alert("Error removing product from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center mt-3 mb-3">
        <div
          key={product?._id}
          className="cardPD row d-flex flex-colum rounded bg-white border shadow"
        >
          <div className="row g-3 d-flex ">
            <div className="col-6">
              <img
                src={`http://localhost:3059/${product?.image.replace(
                  /\\/g,
                  "/"
                )}`}
                alt={`${product?.name}'s Profile`}
                className="ms-2 card-img-top DBeerListItem-img"
              />
            </div>
            <div className="col-6 mt-5 ">
              <div>
                <h2 className="m-4 pt-4">{product?.name}</h2>
              </div>
              <div className="ms-4" style={{ fontStyle: "italic" }}>
                {product?.description}
              </div>
              <div>
                <h5 className="m-4">₹{product?.price}</h5>
              </div>
              <div className="m-4">
                {isInCart ? (
                  <button className="btn btn-success" onClick={handleGoToCart}>
                    <FontAwesomeIcon icon={faShoppingCart} /> Go to Cart
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleAddToCart(product?._id)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} /> ADD TO CART
                  </button>
                )}
              </div>
              <div className="m-4">
                {isInWishlist ? (
                  <button
                    className="btn  btnR"
                    style={{ color: "white" }}
                    onClick={() => handleRemoveFromWishlist(product?._id)}
                  >
                    <FontAwesomeIcon icon={faHeart} /> REMOVE WISHLIST
                  </button>
                ) : (
                  <button
                    className="btn btnA"
                    onClick={() => handleAddToWishlist(product?._id)}
                  >
                    <FontAwesomeIcon icon={faHeart} /> ADD TO WISHLIST
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
