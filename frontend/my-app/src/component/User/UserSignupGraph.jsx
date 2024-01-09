import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const UserSignupGraph = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3059/users/api/monthlySignupData', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        setMonthlyData(response.data);
      } catch (error) {
        console.error('Error fetching monthly signup data:', error);
      }
    };

    fetchMonthlyData();
  }, []);

  const data = {
    labels: monthlyData.map((data) => moment(`${data.year}-${data.month}`, 'YYYY-MM').format('MMM YYYY')),
    datasets: [
      {
        label: 'Monthly Signups',
        data: monthlyData.map((data) => data.count),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <Line data={data} />
    </>
  );
};

export default UserSignupGraph;
