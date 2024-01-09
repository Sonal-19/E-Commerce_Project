import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
const[product, setProduct] = useState({
  name:"",
  price:"",
  previousPrice: "",
  description:"",
  category:"women", //Default Category
  sizes:[],
  image: null,
});
  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    try {
        e.preventDefault()
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", parseFloat(product.price));
      formData.append("previousPrice", parseFloat(product.previousPrice));
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("image", product.image);
      product.sizes.forEach((size, index) => {
        formData.append(`sizes[${index}]`, size);
      });
      
      const response = await axios.post(
        "http://localhost:3059/users/api/addproducts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("product added", response.data);

      if (response.data.success) {
        window.alert("Add Product");
        navigate("/allproducts");
      } else {
        console.log("Add Product failed. Please check your information.");
      }

    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct((prevProduct) =>({
      ...prevProduct,
      image: file,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
  
    if (name === 'sizes') {
      updatedValue = value.split(',').map(size => size.trim());
    }
  
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: updatedValue,
    }));
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-bold font-monospace text-center m-3">Add Product</h2>
        <div className="cardA rounded bg-white border shadow p-4 mb-5 pb-5">
            <form  className="row g-3">
                <div className="col-12">
                    <label className="form-label">Name </label>
                    <input 
                    className="form-control"
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="col-12">
                    <label className="form-label">Price </label>
                    <input 
                    className="form-control"
                    type="text"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="col-12">
              <label className="form-label">Previous Price </label>
              <input
                className="form-control"
                type="text"
                name="previousPrice"
                value={product.previousPrice}
                onChange={handleInputChange}
              />
            </div>
                <div className="col-12">
                    <label className="form-label">Description </label>
                    <input 
                    className="form-control"
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="col-12">
                    <label className="form-label">Category </label>
                    <select
                      className="form-control"
                      name="category"
                      value={product.category}
                      onChange={handleInputChange}
                    >
                      <option value="book">Book</option>
                      <option value="child">Child</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                </div>
                <div className="col-12">
                  <label htmlFor="sizes">Sizes:</label>
                  <input
                    type="text"
                    id="sizes"
                    name="sizes"
                    value={product.sizes.join(', ')}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="col-12">
                    <label className="form-label">Image </label>
                    <input 
                    className="form-control"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    />
                </div>
                <div className="col-12">
                <button className="btn btnA w-100" 
                type="button"
                onClick={handleAddProduct}>Add Product</button>
                </div>
            </form>
        </div>
      </div>
    </>
  );
}
