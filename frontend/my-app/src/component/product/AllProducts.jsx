import React, { useEffect, useState } from "react";
import axios from "axios";
import { faEdit, faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [selectProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3059/users/api/viewallproducts");
      setProducts(response.data.products); 
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3059/users/api/deleteproduct/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  const openModal = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3059/users/api/viewproducts/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedProduct(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error.message);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="d-flex flex-column p-1 m-1 justify-content-center align-items-center">
        <h2 className="mb-4 text-bold font-monospace text-center">
          All Products
        </h2>
        <div className="cardAP rounded bg-white border shadow p-4 pb-5 mb-5">
          <div className="d-flex justify-content-end">
            <Link to="/addproduct" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Available Sizes</th>
                <th scope="col">Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      src={`http://localhost:3059/${product.image}`}
                      alt={`${product.name}'s Profile`}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    {product.sizes.join(', ')}
                  </td>
                  <td>
                    <strong>₹{product.price}</strong>{" "}
                    <span className="discounted-price">
                      {product.previousPrice && (
                        <span>
                          <s>₹{product.previousPrice}</s>{" "}
                          <span className="discount-percentage">
                            {Math.round(
                              ((product.previousPrice - product.price) /
                                product.previousPrice) *
                                100
                            )}
                            % off
                          </span>
                        </span>
                      )}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info me-2"
                      onClick={() => openModal(product._id)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <Link
                      to={`/editproduct/${product._id}`}
                      className="btn btn-primary me-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteProduct(product._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={isModalOpen} onHide={closeModal} contentLabel="Product Details" className="modal" >
        <Modal.Header closeButton>
          <Modal.Title>
            <h2 className="text-bold font-monospace text-center">
              Product Details
            </h2>
          </Modal.Title>
        </Modal.Header>
        {selectProduct && (
          <Modal.Body>
            <div className="container">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src={`http://localhost:3059/${selectProduct.image}`}
                    alt={`${selectProduct.name}'s Profile`}
                    className="ms-2 card-img-top DBeerListItem-img"
                  />
                </div>
                <div className="col-6">
                  <div>
                    <h2 className="m-4 mb-2 mt-0">{selectProduct.name}</h2>
                  </div>
                  <div className="ms-4" style={{ fontStyle: "italic" }}>
                    {selectProduct.description}
                  </div>
                  <div>
                    <h6 className="m-4 text-secondary" style={{ fontStyle: "italic" }}>
                      {selectProduct.category}</h6>
                  </div>
                  <div>
                    <h6 className="m-4 text-secondary" style={{ fontStyle: "italic" }}>
                      Sizes: {selectProduct.sizes.join(', ')}
                    </h6>
                  </div>
                  <div>
                    <p className="card-text text-center m-4">
                      <strong >₹{selectProduct.price}</strong>{" "}
                      <span className="discounted-price">
                        {selectProduct.previousPrice && (
                          <span>
                            <s className="text-secondary">₹{selectProduct.previousPrice}</s>{" "}
                            <span className="discount-percentage text-primary">
                              {Math.round(
                                ((selectProduct.previousPrice - selectProduct.price) /
                                  selectProduct.previousPrice) *
                                  100
                              )}
                              % off
                            </span>
                          </span>
                        )}
                      </span>
                    </p>
                  </div>
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
  );
}

export default AllProducts;
