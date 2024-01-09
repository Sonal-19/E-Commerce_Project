import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../Admin/AdminDashboard';
import AdminSignup from '../Admin/AdminSignup';
import AdminOtpVerify from '../Admin/AdminOtpVerify';
import AdminLogin from '../Admin/AdminLogin';
import AdminForget from '../Admin/AdminForget';
import AdminAccount from '../Admin/AdminAccount';
import AddProduct from '../product/AddProduct';
import AllProducts from '../product/AllProducts';
import EditProduct from '../product/EditProduct';
import AllUsers from '../User/AllUsers';
import EditUser from '../User/EditUser';
import AddUser from '../User/AddUser';
import AdminAdd from '../Admin/AdminAdd';
import AllAdmin from '../Admin/AllAdmin';
import EditAdmin from '../Admin/EditAdmin';
import WeatherCard from '../Weather/WeatherCard';
import TodoList from '../Admin/TodoList';
import PrivacyPolicy from '../Footer/PrivacyPolicy';
import TermsConditions from '../Footer/TermsConditions';
import TermsOfUse from '../Footer/TermsOfUse';
import Accessibility from '../Footer/Accessibility';
import AddBlog from '../Blog/AddBlog';
import AllBlog from '../Blog/AllBlog';
import EditBlog from '../Blog/EditBlog';
import ViewBlog from '../Blog/ViewBlog';
import Chart from '../Admin/Chart';
import Progress from '../Admin/Progress';
import ContactList from '../Admin/ContactList';


const MainContent = () => {
  return (
    <>
      <div className='main-content col-10 mt-5 pt-4'>
        <Routes>
          <Route path='/admindashboard' element={<AdminDashboard />} />
          <Route path='/adminsignup' element={<AdminSignup />} />
          <Route path='/adminotpverify' element={<AdminOtpVerify />} />
          <Route path='/adminlogin' element={<AdminLogin />} />
          <Route path='/adminforget' element={<AdminForget />} />
          <Route path='/adminaccount' element={<AdminAccount />} />
          <Route path='/addproduct' element={<AddProduct/>} />
          <Route path='/allproducts' element={<AllProducts/>} />
          <Route path='/editproduct/:productId' element={<EditProduct/>} />
          <Route path='/allusers' element={<AllUsers/>} />
          <Route path='/adduser' element={<AddUser/>} />
          <Route path='/edituser/:userId' element={<EditUser/>} />
          <Route path='/adminadd' element={<AdminAdd/>} />
          <Route path='/alladmin' element={<AllAdmin/>} />
          <Route path='/editadmin/:adminId' element={<EditAdmin/>} />
          <Route path='/weather' element={<WeatherCard/>} />
          <Route path='/todo' element={<TodoList/>} />
          <Route path='/privacypolicy' element={<PrivacyPolicy/>} />
          <Route path='/termsconditions' element={<TermsConditions/>} />
          <Route path='/termsuse' element={<TermsOfUse/>} />
          <Route path='/accessibility' element={<Accessibility/>} />
          <Route path='/addblog' element={<AddBlog/>} />
          <Route path='/allblog' element={<AllBlog/>} />
          <Route path='/editblog/:blogId' element={<EditBlog/>} />
          <Route path='/viewblog/:blogId' element={<ViewBlog/>} />
          <Route path='/chart' element={<Chart/>} />
          <Route path='/progress' element={<Progress/>} />
          <Route path='/contactlist' element={<ContactList/>} />
          
        </Routes>
      </div>
    </>
  );
};

export default MainContent;
