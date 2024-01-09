import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

const settings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const ProductCard = ({ product }) => {
  return (
    <>
      <div className="cardL rounded bg-white border shadow m-5">
        <h2 className='m-2 text-bold font-monospace text-center' >Recent Products</h2>
        <div className='d-flex'>        
        <div className="image-side text-center ms-3">
          <img src={`http://localhost:3059/${product.image}`} alt={product.name} 
          className="card-img-top BeerListItem-imgL" />
        </div>
       
        <div className="info-side p-3 text-center ms-4">
          <h4 className="card-title text-bold text-center">{product.name}</h4>
          <h6 className="m-4 text-secondary" style={{ fontStyle: "italic" }}>
            Category: {product.category}</h6>
         <h6 className="m-4 text-secondary" style={{ fontStyle: "italic" }}>
                      Sizes: {product.sizes.join(', ')}
        </h6>
          <p className="card-text text-center m-4">
                      <strong >₹{product.price}</strong>{" "}
                      <span className="discounted-price">
                        {product.previousPrice && (
                          <span>
                            <s className="text-secondary">₹{product.previousPrice}</s>{" "}
                            <span className="discount-percentage text-warning">
                              ({Math.round(
                                ((product.previousPrice - product.price) /
                                  product.previousPrice) *
                                  100
                              )}
                              % off)
                            </span>
                          </span>
                        )}
                      </span>
                    </p>
          <p className="card-text">
            <Link to='/allproducts'>Show More</Link>
          </p>
        </div>

        </div>
      </div>
    </>
  );
};

const LatestProductsSlider = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3059/users/api/getLatestProducts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLatestProducts(response.data);
      } catch (error) {
        console.error('Error fetching latest products:', error);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div style={{ position: 'relative' }} className="slider">
      <Slider {...settings} className="slide">
        {latestProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Slider>
    </div>
  );
};

export default LatestProductsSlider;
