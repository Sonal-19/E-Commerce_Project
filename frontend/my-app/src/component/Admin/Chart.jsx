import React from 'react';
import UserGraph from '../User/UserGraph';
import ProductGraph from '../product/ProductGraph';


export default function Chart() {
  return (
    <>
    <div className='container-fluid  m-5'>
    <h2 className="text-bold font-monospace text-center m-4 mb-5 mt-5">
      Monthly Chart of User and Product
      </h2>
    <div className='row mb-5 pb-5'>
        <div className='col-md-6  mb-5 pb-5 '>
          <UserGraph />
        </div>
        <div className='col-md-6 mb-5 pb-5'>
          <ProductGraph />
        </div>
      </div>
    </div>
    </>
  );
}
