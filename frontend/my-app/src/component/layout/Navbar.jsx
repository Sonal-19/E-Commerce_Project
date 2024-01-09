import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faShoppingCart,faSignOutAlt,faUser,faHeart,faSearch,} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Navbar.css";
import logo1 from "../Images/logo7.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking login status:", error.message);
      }
    };

    checkLoginStatus();
  }, [isLoggedIn]); 

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3059/users/api/viewproducts?search=${searchQuery}&page=1`
      );

      navigate("/searchproduct", { state: { products: response.data } });
    } catch (error) {
      console.error("Error fetching search results:", error.message);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg  bg-white border shadow fixed-top">
        <div className="container-fluid d-flex align-items-center">
          <Link to="/" className="navbar-brand me-5">
            <img src={logo1} alt="logo1" className="logo " />
          </Link>

          <div className="ms-auto d-flex align-items-center flex-grow-1">
            <form>
            <div className="input-group flex-grow-1">
              <input
                className="form-control bg-light"
                type="search"
                placeholder="Search more"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span
                className="input-group-text cursor-pointer"
                onClick={handleSearch}
              >
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
            </form>
          </div>

          <div className="ms-auto d-flex">
            {isLoggedIn ? (
              <>
                <div className="ms-5">
                  <Link to="/account" className="btn">
                    <FontAwesomeIcon icon={faUser} style={{ color: "black" }} />
                    <div className="icon-text">Account</div>
                  </Link>
                </div>
                <div className="ms-2">
                  <Link to="/wishlist" className="btn">
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ color: " rgb(240, 33, 68)" }}
                    />
                    <div className="icon-text">Wishlist</div>
                  </Link>
                </div>
                <div className="ms-2">
                  <Link to="/cart" className="btn">
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      style={{ color: "black" }}
                    />
                    <div className="icon-text">Cart</div>
                  </Link>
                </div>
                <div className="ms-2">
                  <button className="btn" onClick={handleLogout}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      style={{ color: "gray" }}
                    />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="m-2">
                  <Link  className="btn btn-outline-dark"
                  to="/login">LOGIN</Link>
                </div>
                <div className="m-2">
                  <Link  className="btn btn-outline-dark"
                  to="/signup">SIGNUP</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
