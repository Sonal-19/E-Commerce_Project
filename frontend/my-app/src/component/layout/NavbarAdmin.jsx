import React, { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch,faUser,faSignOutAlt,faBell,} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import logo1 from "../Images/logo2.png";
import { NavDropdown } from "react-bootstrap";

function NavbarAdmin({ onLogout }) {
  const [admin, setAdmin] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    onLogout();
    setDropdownVisible(false);
  };

  const handleSearch = () => {
    // Find the matching route based on the search input
    const matchedRoute = findMatchingRoute(searchInput);
    // Navigate to the matched route if found
    if (matchedRoute) {
      navigate(matchedRoute);
    }
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchInput(searchText);

    // Update suggestions based on the search input
    const newSuggestions = getSuggestions(searchText);
    setSuggestions(newSuggestions);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearchIconClick = () => {
    handleSearch();
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.route);
    setSearchInput("");
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };

  // Function to find the matching route
  const findMatchingRoute = (searchText) => {
    const lowerCaseSearch = searchText.toLowerCase();
    const routes = [
      "/admindashboard",
      "/adminaccount",
      "/adminadd",
      "/alladmin",
      "/adduser",
      "/allusers",
      "/todo",
      "/addproduct",
      "/allproducts",
      "/privacypolicy",
      "/termsconditions",
      "/termsuse",
      "/accessibility",
      // Add other routes as needed
    ];
    for (const route of routes) {
      if (route.includes(lowerCaseSearch)) {
        return route;
      }
    }
    return null;
  };

  // Function to get suggestions based on the search input
  const getSuggestions = (searchText) => {
    const lowerCaseSearch = searchText.toLowerCase();
    const matchedSuggestions = [];

    // Filter routes based on the search input
    const routes = [
      { route: "/admindashboard", label: "Admin Dashboard" },
      { route: "/adminaccount", label: "Admin Account" },
      { route: "/adminadd", label: "Add Admin" },
      { route: "/alladmin", label: "Admin List" },
      { route: "/adduser", label: "Add User" },
      { route: "/allusers", label: "User List" },
      { route: "/addproduct", label: "Add Product" },
      { route: "/allproducts", label: "Product List" },
      { route: "/addblog", label: "Add Blog" },
      { route: "/allblog", label: "Blog List" },
      { route: "/todo", label: "Todo List" },
      { route: "/privacypolicy", label: "Privacy Policy" },
      { route: "/termsconditions", label: "Terms and Conditions" },
      { route: "/termsuse", label: "Terms of Use" },
      { route: "/accessibility", label: "Accessibility" },
      // Add other routes as needed
    ];

    for (const route of routes) {
      if (route.label.toLowerCase().includes(lowerCaseSearch)) {
        matchedSuggestions.push(route);
      }
    }

    return matchedSuggestions;
  };

  const handleNotificationClick = async (notification) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:3059/users/api/readNotification/${notification._id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (notification.type === 0) {
        navigate("/contactlist");
      } else if (notification.type === 1) {
        navigate("/allproducts");
      } else if (notification.type === 2) {
        navigate("/allusers");
      }
      setNotificationCount(notificationCount - 1);
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://localhost:3059/users/api/admin",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAdmin(response.data.admin);
        }

        const notificationsResponse = await axios.get(
          "http://localhost:3059/users/api/getNotification", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const notificationsData = notificationsResponse.data;
        console.log("notification", notificationsData);
        setNotifications(notificationsData);

        // // Check if notificationsData is an array before setting state
        // if (Array.isArray(notificationsData)) {
        //   setNotifications(notificationsData);
        // }

        const unreadNotificationsResponse = await axios.get(
          "http://localhost:3059/users/api/getunreadNotification", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const unreadNotifications = unreadNotificationsResponse.data;
        setNotificationCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border shadow fixed-top mb-0 mt-0">
        <div className="container-fluid d-flex align-items-center mb-0 pb-0 mt-0 pt-0">
          <div className="m-2 pe-2">
            <Link to="/admindashboard">
              <img src={logo1} alt="logo1" className="logo me-5" />
            </Link>
          </div>

          <div className="d-flex align-items-center position-relative">
            {/* Search Input */}
            <form ref={searchRef} className="me-3" onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <input
                  className="form-control bg-light"
                  type="text"
                  placeholder={searchInput ? "" : "Search for..."}
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                />
                <span
                  className="input-group-text cursor-pointer"
                  onClick={handleSearchIconClick}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="dropdown-menu show">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.route}
                      className="dropdown-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Notifications */}
            <div className="me-3 cursor-pointer">
                <NavDropdown title={
                    <div>
                      <FontAwesomeIcon icon={faBell} style={{ fontSize: '1.6rem' }} />
                       {notificationCount > 0 && (
                        <span className="badge bg-danger position-absolute translate-middle" style={{ fontSize: '0.49rem' }}>
                          {notificationCount}
                        </span>
                      )}
                    </div>
                  }
                >
                  {notifications.filter((notification) => !notification.read)
                    .length > 0 ? (
                    notifications.map((notification) => (
                      <>
                        {!notification.read && (
                          <NavDropdown.Item key={notification._id}
                            onClick={() => handleNotificationClick(notification)}>
                            <div>{notification.content}</div>
                          </NavDropdown.Item>
                        )}
                        {/* <NavDropdown.Divider /> */}
                      </>
                    ))
                  ) : (
                    <NavDropdown.Item>
                      <div>No notifications</div>
                    </NavDropdown.Item>
                  )
                  }
                </NavDropdown>
              </div>
              
              {/* Admin Dropdown */}
              <div className="dropdown">
                <img
                  src={`http://localhost:3059/${admin.image}`}
                  alt={`${admin.name}'s Profile`}
                  className="img-thumbnail dropdown-toggle  me-3 cursor-pointer"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                  onClick={handleDropdownToggle}
                />
                <div
                  className={`dropdown-menu dropNav mt-3 ${
                    dropdownVisible ? "show" : ""
                  }`}
                  aria-labelledby="dropdownMenuButton"
                >
                  <Link to="/adminaccount" className="dropdown-item">
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{
                        color: "gray",
                        marginLeft: "auto",
                        marginRight: "19px",
                      }}
                    />
                    Account
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      style={{
                        color: "gray",
                        marginLeft: "auto",
                        marginRight: "19px",
                      }}
                    />
                    Logout
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-monospace text-bold text-center me-5">
                  {admin.name}
                </h4>
              </div>
          </div>
    
        </div>
      </nav>
    </>
  );
}

export default NavbarAdmin;
