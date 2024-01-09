import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import '../product/ViewProduct.css';

const Wishlist = () => {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Wishlist');
  })

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3059/users/api/getWishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlist(response.data.products);
      } catch (error) {
        console.error('Error fetching wishlist:', error.message);
      }
    };
    fetchWishlist();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:3059/users/api/addToCart",
        {
          productId,
          quantity: 1, // Set quantity to 1 for adding to cart
          size: "S", // Set default size or retrieve from user selection
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        const addedProduct = response.data.cart.products.find(
          (item) => item.productId === productId
        );
  
        if (addedProduct) {
          alert("Product added to cart successfully");
          setWishlist((prevWishlist) =>
            prevWishlist.filter((item) => item.productId !== productId)
          );
        } else {
          alert("Error adding product to cart");
        }
      } else {
        alert("Error adding product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
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
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.productId !== productId));
      } else {
        alert("Error removing product from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <>
      <div>
        <div className="container pb-5 mb-5 mt-2 pt-5">
          {wishlist.length === 0 ? (
            <>
            <div className="text-center"> 
              <div className="m-3">
              <h4 >YOUR WISHLIST IS EMPTY</h4>
              </div>
              <div className="mt-3 pt-2 text-center">
              <p style={{ fontStyle: "italic" }} >
                Add items that you like to your wishlist. 
                Review them anytime and easily move them to the cart.</p>
              </div>
              <img src="https://img.freepik.com/free-vector/illustration-notepad_53876-3296.jpg?w=740&t=st=1703426125~exp=1703426725~hmac=28ebe3fc9664bbac970860c7656fd3fcd9b2b040c62a1cba21f8284e3423634a" alt=""  
              className="card-img-top BeerListItem-img m-3"/>
              <div className="m-3 mb-5 pb-2">
              <Link  className="btn btn-outline-dark"
              to='/'>CONTINUE SHOPPING</Link>
              </div>
            </div>
            </>
          ):(
          <>
          <h2 className="text-bold font-monospace text-center pb-3">
            Your Wishlist <FontAwesomeIcon icon={faHeart} style={{ color: ' rgb(240, 33, 68)' }} />
          </h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {wishlist.map((item) => (
              <div key={item.productId} className="col">
                <div className="cardP rounded bg-white border shadow m-3">
                  <div className="position-relative">
                    <button
                      className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle"
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <img
                      src={`http://localhost:3059/${item.image}`}
                      alt={`${item.name}'s Profile`}
                      className="card-img-top BeerListItem-img"
                    />
                  </div>
                  <div className="card-body font-monospace">
                    <h6 className="card-title m-2 text-center">{item.name}</h6>
                    <p className="card-text text-center mb-2">
                      <strong>₹{item.price}</strong>{" "}
                      <span className="discounted-price">
                        {item.previousPrice && (
                          <span>
                            <s className="text-secondary text-sm">
                              ₹{item.previousPrice}
                            </s>{" "}
                            <span className="discount-percentage text-warning text-sm">
                              ({Math.round(
                                ((item.previousPrice - item.price) /
                                  item.previousPrice) *
                                  100
                              )}
                            % OFF)
                            </span>
                          </span>
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <Link to="/cart">
                      <button className="btn btn-sm btn-warning w-100" onClick={() => handleAddToCart(item.productId)}>
                        Move to Cart
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
