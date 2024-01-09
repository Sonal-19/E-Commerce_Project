import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const Card = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalWishlists, setTotalWishlists] = useState(0);
  const [totalCarts, setTotalCarts] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = localStorage.getItem('token');

        // Fetch total users
        const responseUsers = await axios.get('http://localhost:3059/users/api/allUsers', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setTotalUsers(responseUsers.data.users.length);

        // Fetch total products
        const responseProducts = await axios.get('http://localhost:3059/users/api/viewallproducts', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setTotalProducts(responseProducts.data.products.length);
       // setProducts(response.data.products); 

        // Fetch total wishlists
        const responseWishlists = await axios.get('http://localhost:3059/users/api/getAllWishlist', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setTotalWishlists(responseWishlists.data.length);

        // Fetch total carts
        const responseCarts = await axios.get('http://localhost:3059/users/api/getAllCart', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setTotalCarts(responseCarts.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Set interval for fetching data and updating the chart every 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
      setAnimationKey((prevKey) => prevKey + 1);
    }, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const chartData = {
    labels: ['Users', 'Products', 'Wishlists', 'Carts'],
    datasets: [
      {
        data: [totalUsers, totalProducts, totalWishlists, totalCarts],
        backgroundColor: [
          'rgba(5, 132, 237, 0.895)',
          'rgb(255, 221, 3)',
          'rgba(255, 4, 88, 0.895)',
          'rgb(255, 121, 3)',
        ],
      },
    ],
  };

  return (
    <div className="container ">
      <div className="cardA rounded bg-white border d-flex flex-column shadow p-2 pb-0 mb-0" style={{ maxWidth: '500px', width: '90vw' }}>
      <h2 className='m-2 text-bold font-monospace text-center'>Progress Status</h2>
        <div style={{ display: 'flex', width: '100%' }}>
          <div className='ms-5 ps-4 pb-0 mb-0'  style={{ flex: 1, width: '100%', height:'320px'  }}>
            <Doughnut
              key={animationKey} 
              data={chartData}
              options={{
                cutout: '49%',
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                  },
                  tooltip: { enabled: true },
                },
                animation: {
                  animateRotate: true,
                  animateScale: true,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
