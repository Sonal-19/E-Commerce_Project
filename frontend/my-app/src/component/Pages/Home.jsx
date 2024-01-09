
import axios from "axios";
import React, { useEffect, useState } from "react";

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    
    if (token) {
      axios
        .get("http://localhost:3059/users/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
        });
    }
  }, []);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-bold font-monospace text-center m-3">
          Details of Users
        </h2>
          <div key={users._id} className="w-50 rounded bg-white border shadow p-4 mb-5 pb-5">
            <h4 className="font-monospace text-bold text-center">Hello, {users.name}</h4>
            <div className="col-12 m-2">
              <strong>Name: {users.name} </strong>
            </div>
            <div className="col-12 m-2">
              <strong>Email: {users.email} </strong>
            </div>
            <div className="col-12 m-2">
              <strong>Contact: {users.contact} </strong>
            </div>
          </div>
      </div>
    </>
  );
}

export default Home;
