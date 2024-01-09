import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

function Account() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Account');
  })

  const [users, setUsers] = useState([]);
  const [editable, setEditable] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:3059/users/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data.user);
          setEditedUser(response.data.user); 
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
        });
    }
  }, []);

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.put("http://localhost:3059/users/api/user", editedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(editedUser);
        setEditable(false);
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const handleCancel = () => {
    setEditable(false);
    setEditedUser(users); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center mb-5 pb-5">
      <div
        className="container-lg"
        style={{
          backgroundImage: `url('https://appsrv1-147a1.kxcdn.com/volt-dashboard/img/illustrations/signin.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <h2 className="text-bold font-monospace text-center pt-2 m-3">
          Your Account Details
        </h2> */}
        <div
          key={users._id}
          className="cardA rounded bg-white border shadow p-4 mb-5 pb-5"
        >
          <h4 className="font-monospace text-bold text-center mt-3 mb-4">
            Hello, {users.name}
          </h4>
          <div className="col-12 m-3">
            <div
              style={{ fontStyle: "italic", opacity: editable ? "0.5" : "1" }}
            >
              Name
            </div>
            <div>
              {editable ? (
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              ) : (
                <span className="fw-bold">{users.name}</span>
              )}
            </div>
          </div>
          <div className="col-12 m-3">
            <div
              style={{ fontStyle: "italic", opacity: editable ? "0.5" : "1" }}
            >
              Email
              <div>
                <span className="fw-bold">{users.email}</span>
              </div>
            </div>
          </div>
          <div className="col-12 m-3">
            <div
              style={{ fontStyle: "italic", opacity: editable ? "0.5" : "1" }}
            >
              Contact
            </div>
            {editable ? (
              <input
                type="text"
                name="contact"
                value={editedUser.contact}
                onChange={handleInputChange}
                disabled={!editable}
              />
            ) : (
              <span className="fw-bold">{users.contact}</span>
            )}
          </div>
          <div className="col-12 m-3">
            <div
              style={{ fontStyle: "italic", opacity: editable ? "0.5" : "1" }}
            >
              Address
            </div>
            {editable ? (
              <input
                type="text"
                name="address"
                value={editedUser.address}
                onChange={handleInputChange}
                disabled={!editable}
              />
            ) : (
              <span className="fw-bold">{users.address}</span>
            )}
          </div>
          <div className="col-12 m-3">
            <div
              style={{ fontStyle: "italic", opacity: editable ? "0.5" : "1" }}
            >
              Birthday
            </div>
            {editable ? (
              <input
                type="date"
                name="birthday"
                value={
                  editedUser.birthday
                    ? new Date(editedUser.birthday).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                disabled={!editable}
              />
            ) : (
              <span className="fw-bold">
                {users.birthday
                  ? new Date(users.birthday).toLocaleDateString()
                  : ""}
              </span>
            )}
          </div>

          <div className="col-12 m-3">
            <div
              style={{ fontStyle: "italic", opacity: editable ? "0.5" : "1" }}
            >
              Gender
            </div>
            {editable ? (
              <select
                name="gender"
                value={editedUser.gender}
                onChange={handleInputChange}
                disabled={!editable}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span className="fw-bold">{users.gender}</span>
            )}
          </div>
          {editable && (
            <div className="col-12 mt-2 text-center">
              <button className="btn btnA me-2" onClick={handleSave}>
                Save
              </button>
              <button className="btn btnA" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
          {!editable && (
            <div className="col-12 mt-3 pb-2">
              <button className="btn btn-light" onClick={handleEdit}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default Account;
