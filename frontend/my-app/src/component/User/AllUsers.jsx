import { faEdit, faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const[selectedUser, setSelectedUser] = useState(null);
  const[showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3059/users/api/allUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Server Response:', response);
      if (response.data.success) {
        const users = response.data.users;
        setUsers(users);
      } else {
        console.error('Request was not successful:', response.data);
      }
    } catch (error) {
      console.error('Error fetching Users Data:', error.message);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3059/users/api/getUserById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User Data by ID:', response.data);
      if (response.data) {
        setSelectedUser(response.data);
        setShowModal(true);
      } else {
        console.error('User not found.');
      }
    } catch (error) {
      console.error('Error fetching User Data by ID:', error.message);
    }
  };
  
  const deleteUserById = async(userId) =>{
    try{
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:3059/users/api/deleteUserById/${userId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('User Data by ID deleted:', response.data);
      fetchUsers();
    } catch (error){
      console.error("Error deleting User:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="d-flex flex-column p-1 m-1 justify-content-center align-items-center">
        <h2 className="mb-4 text-bold font-monospace text-center">
          All Users Data</h2>
        <div className="cardAP rounded bg-white border shadow p-4 pb-5 mb-5">
        <div className="d-flex justify-content-end">
            <Link to="/adduser" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Contact</th>
              <th scope="col">Address</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map((user, index) => (
              <tr key={user._id}>
                <th scope="row">{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
                <td>{user.address}</td>
                <td>
                  <button className="btn btn-info me-2"
                    onClick={()=> fetchUserById(user._id)} >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <Link to={`/edituser/${user._id}`} className="me-2 btn btn-primary">
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <button className="btn btn-danger"
                    onClick={()=> deleteUserById(user._id)}  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} className='mb-5 pb-5 mt-3 pt-2'>
        <Modal.Header closeButton>
          <Modal.Title >
          <h2 className="text-bold font-monospace text-center ms-5 ps-5">
          User Details </h2>
          </Modal.Title>
        </Modal.Header>
        {selectedUser && (
        <Modal.Body>
          <div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Name
            </div>
            <div className="fw-bold">
              {selectedUser.name}
            </div>
          </div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Email
            </div>
            <div className="fw-bold">
              {selectedUser.email}
            </div>
          </div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Contact
            </div>
            <div className="fw-bold">
              {selectedUser.contact}
            </div>
          </div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Address
            </div>
            <div className="fw-bold">
              {selectedUser.address}
            </div>
          </div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Birthday
            </div>
            <div className="fw-bold">
              {selectedUser.birthday ? new Date(selectedUser.birthday).toISOString().split("T")[0]
                    : ""}
            </div>
          </div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Gender
            </div>
            <div className="fw-bold">
              {selectedUser.gender}
            </div>
          </div>
          </div>
          
        </Modal.Body>
        )}
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
