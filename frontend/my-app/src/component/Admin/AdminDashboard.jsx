import React from 'react';
import UserGraph from '../User/UserGraph';
import ProductGraph from '../product/ProductGraph';
import Card from './Card';
import LatestProductsSlider from '../product/ProductCard';
import WeatherCard from '../Weather/WeatherCard';
import TodoList from './TodoCard';

const AdminDashboard = () => {
  return (
    <div className='container-fluid'>
      {/* First Row */}
      <div className='row'>
        <div className='col-md-6'>
          <WeatherCard />
         
        </div>
        <div className='col-md-6'>
        <LatestProductsSlider/>
         
        </div>
      </div>

      <div className='row mb-5'>
        <div className='col-md-6'>
        <TodoList/>
        
        </div>
        <div className='col-md-6'>
          <Card />
        </div>
      </div>

      {/* Second Row */}
      <div className='row mb-5 ms-5'>
        <div className='col-md-6'>
          <UserGraph />
        </div>
        <div className='col-md-6'>
          <ProductGraph />
        </div>
      </div>
      {/* <div className='row mb-5'>
        <div className='col-md-6'>
        <TodoList/>
        
        </div>
        <div className='col-md-6'>
          <Card />
        </div>
      </div> */}
    </div>
  );
};

export default AdminDashboard;
