import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Home from "../Pages/Home";
import SignUp from "../Pages/Signup";
import OtpVerify from "../Pages/OtpVerify";
import Login from "../Pages/Login";
import Forget from "../Pages/Forget";
// import AddProduct from "../product/AddProduct";
import ViewProduct from "../product/ViewProduct";
import Cart from "../Pages/Cart";
import Account from "../Pages/Account";
import ProductDetail from "../product/ProductDetail";
import Wishlist from "../Pages/Wishlist";
import SearchProduct from "../product/SearchProduct";
import PrivacyPolicyViewer from "../Footer/PrivacyPolicyViewer";
import ContactUs from "../Footer/ContactUs";
import TermsConditionsViewer from "../Footer/TermsConditionsViewer";
import TermsOfUseView from "../Footer/TermsOfUseView";
import AccessibilityView from "../Footer/AccessibilityView";
import UserBlog from "../Blog/UserBlog";
import BlogContent from "../Blog/BlogContent";

export default function Main() {
  return (
    <> 
     <div className="mt-5 pt-4">
     <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otpverify" element={<OtpVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<Forget />} />
        {/* <Route path='/addproduct' element={<AddProduct/>} /> */}
        <Route path="/viewproduct" element={<ViewProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/searchproduct" element={<SearchProduct />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyViewer />} />
        <Route path="/t&c" element={<TermsConditionsViewer />} />
        <Route path="/termsofuse" element={<TermsOfUseView />} />
        <Route path="/accessibilityview" element={<AccessibilityView />} />
        <Route path="/userblog" element={<UserBlog />} />
        <Route path="/blog/:blogId" element={<BlogContent />} />
       

      </Routes>
     </div>
    </>
  );
}
