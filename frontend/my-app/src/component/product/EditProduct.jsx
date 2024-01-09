import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const sizeOptions = ["S", "M", "L"];

export default function EditProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    previousPrice: "",
    offer: "",
    sizes: [],
    image: null,
    description: "",
    category: "",
  });
  const [productImagePrev, setProductImagePrev] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3059/users/api/viewproducts/${productId}`
        );
        const productData = response.data;

        setProduct((prevProduct) => ({
          ...prevProduct,
          name: productData.name,
          price: productData.price,
          previousPrice: productData.previousPrice,
          offer: productData.offer,
          sizes: Array.isArray(productData.sizes)
            ? productData.sizes
            : productData.sizes.split(", ").map((size) => size.trim()),
          image: productData.image,
          description: productData.description,
          category: productData.category,
        }));

        setProductImagePrev(URL.createObjectURL(productData.image));
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleEditProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", parseFloat(product.price));
      formData.append("previousPrice", parseFloat(product.previousPrice));
      formData.append("offer", parseFloat(product.offer));
      formData.append("sizes", product.sizes.join(", "));
      formData.append("description", product.description);
      formData.append("category", product.category);
      if (product.image) {
        formData.append("image", product.image);
      }

      const response = await axios.put(
        `http://localhost:3059/users/api/editproduct/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        window.alert("Product updated successfully");
        navigate("/allproducts");
      } else {
        console.log("Edit failed. Please check your information.");
      }
    } catch (error) {
      console.error("Error editing product:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct((prevProduct) => ({
      ...prevProduct,
      image: file,
    }));
    setProductImagePrev(URL.createObjectURL(file));
  };

  const handleCancelEdit = () => {
    navigate("/allproducts");
  };

  const handleCheckboxChange = (size) => {
    setProduct((prevProduct) => {
      const updatedSizes = prevProduct.sizes.includes(size)
        ? prevProduct.sizes.filter((s) => s !== size)
        : [...prevProduct.sizes, size];

      return {
        ...prevProduct,
        sizes: updatedSizes,
      };
    });
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-bold font-monospace text-center m-2">
          Edit Product
        </h2>
        <div className="cardA rounded bg-white border shadow p-4 mb-3">
          <form className="row g-3">
            <div className="col-12">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                name="name"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Price</label>
              <input
                className="form-control"
                type="text"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                name="price"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Previous Price</label>
              <input
                className="form-control"
                type="text"
                value={product.previousPrice}
                onChange={(e) => setProduct({ ...product, previousPrice: e.target.value })}
                name="previousPrice"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Offer (%)</label>
              <input
                className="form-control"
                type="text"
                value={product.offer}
                onChange={(e) => setProduct({ ...product, offer: e.target.value })}
                name="offer"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <input
                className="form-control"
                type="text"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                name="description"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                name="category"
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
              >
                <option value="book">Book</option>
                <option value="child">Child</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="sizes">Sizes:</label>
              <div>
                {sizeOptions.map((size) => (
                  <div key={size}>
                    <input
                      type="checkbox"
                      id={`size${size}`}
                      name={`size${size}`}
                      checked={product.sizes.includes(size)}
                      onChange={() => handleCheckboxChange(size)}
                    />
                    <label htmlFor={`size${size}`}>{size}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Image</label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="col-12 text-center">
              {productImagePrev ? (
                <img
                  src={productImagePrev}
                  alt={`${productImagePrev}'s Profile`}
                  className="img-thumbnail"
                  style={{ width: "100px", height: "100px" }}
                />
              ) : (
                <img
                  src={`http://localhost:3059/${product.image}`}
                  alt={`${product.image}'s Profile`}
                  className="img-thumbnail"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
            </div>
            <div className="col-12 mt-4 text-center">
              <button
                className="btn btnA me-4"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="btn btnA"
                type="button"
                onClick={handleEditProduct}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
