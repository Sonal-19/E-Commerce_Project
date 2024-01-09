import React, { useEffect, useState } from 'react'
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from "react-bootstrap";
import axios from 'axios';

export default function ContactList() {
  useEffect(()=>{
    function setPageTitle(pageName){
      document.title= `${pageName}`;
    }
    setPageTitle('Contact List');
  })
  const[contactForms, setContactForms] = useState([]);
  const[selectedContactForm, setSelectedContactForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContactForms = async()=>{
    try{
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3059/users/api/getAllContactForms',{
        headers: {Authorization: `Bearer ${token}`},
      });
      if(response.status === 200){
        const contactFormsData = response.data.contactForms;
        setContactForms(contactFormsData);
      } else {
        console.error('Unexpected response status:', response.status); 
      } 
    } catch (error) {
      console.error('Error fetching contact form submissions:', error.response?.data || error.message);
    }
  };

  const openModal = async (contactFormId) =>{
    try{
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3059/users/api/getContactFormDetailById/${contactFormId}`,{
        headers: {Authorization: `Bearer ${token}`},
      });
      setSelectedContactForm(response.data);
      setIsModalOpen(true);
  } catch (error) {
    console.error('Error fetching contact form details:', error.message);
  }
  };

  const closeModal = () =>{
    setSelectedContactForm(null);
    setIsModalOpen(false);
  }

  const handleCloseModal = () => {
    setSelectedContactForm(null);
    setIsModalOpen(false);
  };

  const deleteContactFormById = async(contactFormId) =>{
    try{
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3059/users/api/deleteContactFormById/${contactFormId}`,{
        headers: {Authorization: `Bearer ${token}`, },
      });
      console.log('Contact form by ID deleted:', response.data);
      fetchContactForms();
    } catch (error){
      console.error("Error deleting User:", error.message);
    }
  };

  useEffect(()=>{
    fetchContactForms();
    }, []);

  return (
    <>
    <div className="d-flex flex-column p-1 m-1 justify-content-center align-items-center">
        <h2 className="mb-4 text-bold font-monospace text-center">
          All Contact Form Data</h2>
        <div className="cardAP rounded bg-white border shadow p-4 pb-5 mb-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(contactForms) && contactForms.map((contactForm, index) => (
              <tr key={contactForm._id}>
                <th scope="row">{index + 1}</th>
                <td>{contactForm.name}</td>
                <td>{contactForm.email}</td>
                <td>
                  <button className="btn btn-info me-2"
                    onClick={()=> openModal(contactForm._id)} >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="btn btn-danger"
                    onClick={()=> deleteContactFormById(contactForm._id)} >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </div>

      {/* Modal for displaying contact form details */}
      <Modal show={isModalOpen} onHide={closeModal} contentLabel="Contact Form Detail" className="modal" >
        <Modal.Header closeButton>
          <Modal.Title>
            <h2 className="text-bold font-monospace text-center">
              Contact Form Detail
            </h2>
          </Modal.Title>
        </Modal.Header>
        {selectedContactForm && (
          <Modal.Body>
          <div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Name
            </div>
            <div className="fw-bold">
            {selectedContactForm.name}
            </div>
          </div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Email
            </div>
            <div className="fw-bold">
            {selectedContactForm.email}
            </div>
          </div>
          <div className="col-12 m-3">
            <div style={{ fontStyle: "italic"}}>
              Message
            </div>
            <div className="fw-bold">
            {selectedContactForm.message}
            </div>
          </div>
          </div>

          </Modal.Body>
        )}
        <Modal.Footer>
          <Button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> 

    </>
  )
}
