import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditUser() {
  const {userId} = useParams();
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3059/users/api/getUserById/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Server Response:', response);
        if (response.data) {
          setUserData(response.data);
        } else {
          console.error('Invalid data format received from the server:', response.data);
        }
      } catch (error) {
        console.error('Error fetching User Data:', error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3059/users/api/updateUserById/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Server Response:', response);
      if (response.data.success) {
        navigate('/allusers');
      } else {
        console.error('Update failed:', response.data);
      }
    } catch (error) {
      console.error('Error updating User Data:', error.message);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () =>{
    navigate("/allusers")
  }

  return (
    <>
      <div className="p-3 m-3 d-flex flex-column justify-content-center align-items-center">
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
        <div className="cardA rounded bg-white border shadow p-4 mb-5 pb-5">
        <h2 className="text-bold font-monospace text-center mb-3">
          User Form
        </h2>
          <form className="row g-3">
            <div className="col-12">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className={"form-control"}
                id="name"
                placeholder="Name"
                name="name" 
                value={userData.name || ''} 
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label htmlFor="contact" className="form-label">
                Contact No.
              </label>
              <input
                type="text"
                className={"form-control"}
                id="contact"
                placeholder="Contact number"
                name="contact" 
                value={userData.contact || ''} 
                onChange={handleChange}
              />
              
            </div>
            <div className="col-12">
              <label htmlFor="address" className="form-label">
                Address
              </label>
                <input
                  type="text"
                  className={"form-control"}
                  id="address"
                  placeholder="address"
                  name="address" 
                value={userData.address || ''} 
                onChange={handleChange}
                />
            </div>
            <div className="col-12">
              <label htmlFor="birthday" className="form-label">
                Birthday
              </label>
                <input
                  type="date"
                  className={"form-control"}
                  id="birthday"
                  placeholder="DD/MM/YY"
                  name="birthday" 
                value={userData.birthday || ''} 
                onChange={handleChange}
                />
            </div>
            <div className="col-12">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                className={"form-control"}
                name="gender"
                value={userData.gender || ''}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-12 mt-4 text-center">
            <button
                className="btn btnA me-4"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button type="button" 
                className="btn btnA"
                onClick={handleSave}>
                Update
              </button>  
            </div>
          </form>
        </div>
        </div>
      </div>

    </>
  );
}
