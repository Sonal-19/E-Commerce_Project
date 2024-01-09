import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

function AdminAccount() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Account');
  })
  const [admins, setAdmins] = useState([]);
  const [editable, setEditable] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3059/users/api/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAdmins(response.data.admin);
          setEditedAdmin(response.data.admin); 
        })
        .catch((error) => {
          console.error("Error fetching admin information:", error);
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
        const formData = new FormData();
        formData.append("image", editedAdmin.image);
        formData.append("name", editedAdmin.name);
        formData.append("contact", editedAdmin.contact);
        // Append other form fields as needed

        await axios.put("http://localhost:3059/users/api/admin", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setAdmins(editedAdmin);
        setEditable(false);
      }
    } catch (error) {
      console.error("Error updating admin information:", error);
    }
  };

  const handleCancel = () => {
    setEditable(false);
    setEditedAdmin(admins); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedAdmin((prevAdmin) => ({
      ...prevAdmin,
      image: file,
    }));
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center mb-5 pb-5 ms-0 ps-0 me-0 pe-0">
      <div
          className="container-lg"
          style={{
            backgroundImage: `url('https://appsrv1-147a1.kxcdn.com/volt-dashboard/img/illustrations/signin.svg')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            minHeight: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        <div
          key={admins._id}
          className="cardA rounded bg-white border shadow p-4 mt-3 mb-5 pb-5"
        >
        {/* <h2 className="text-bold font-monospace text-center pt-2 m-3">
          Your Account Details
        </h2> */}
          <h4 className="font-monospace text-bold text-center mt-3 mb-4">
            Hello, {admins.name}
          </h4>
          {/* Display Image */}
          <div className="text-center">
          <img
            src={`http://localhost:3059/${admins.image}`}
            alt={`${admins.name}'s Profile`}
            className="img-thumbnail"
            style={{ width: "100px", height: "100px", borderRadius: "50%", borderColor: 'black' }}
          />
            </div>

            {/* Editable Image Input */}
            {editable && (
              <div className="col-12 m-3">
                <label htmlFor="image" style={{ fontStyle: "italic" }}>
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
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
                  value={editedAdmin.name}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              ) : (
                <span className="fw-bold">{admins.name}</span>
              )}
            </div>
          </div>
          <div className="col-12 m-3">
            <div
              style={{ fontStyle: "italic", opacity: editable ? "0.5" : "1" }}
            >
              Email
              <div>
                <span className="fw-bold">{admins.email}</span>
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
                value={editedAdmin.contact}
                onChange={handleInputChange}
                disabled={!editable}
              />
            ) : (
              <span className="fw-bold">{admins.contact}</span>
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
                value={editedAdmin.address}
                onChange={handleInputChange}
                disabled={!editable}
              />
            ) : (
              <span className="fw-bold">{admins.address}</span>
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
                  editedAdmin.birthday
                    ? new Date(editedAdmin.birthday).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                disabled={!editable}
              />
            ) : (
              <span className="fw-bold">
                {admins.birthday
                  ? new Date(admins.birthday).toLocaleDateString()
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
                value={editedAdmin.gender}
                onChange={handleInputChange}
                disabled={!editable}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span className="fw-bold">{admins.gender}</span>
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

export default AdminAccount;


