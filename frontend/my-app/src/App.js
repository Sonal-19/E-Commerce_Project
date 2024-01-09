import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './component/layout/Navbar';
import NavbarAdmin from './component/layout/NavbarAdmin';
import SidebarAdmin from './component/layout/SidebarAdmin';
import MainContent from './component/layout/MainContent';
import Main from './component/layout/Main';
import AdminLogin from './component/Admin/AdminLogin';
import AdminSignup from './component/Admin/AdminSignup';
import AdminOtpVerify from './component/Admin/AdminOtpVerify';
import AdminForget from './component/Admin/AdminForget';
import Footer from './component/layout/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  let role=localStorage.getItem("userDetail") && JSON.parse(localStorage.getItem("userDetail")).role
  useEffect(() => {
    if(role==="Admin"){

      setIsLoggedIn(!!localStorage.getItem("userDetail"));
    }
  }, []); 

  const handleLogout = () => {
    if(role==="Admin"){
      navigate("/adminlogin")
    }else{
      navigate("/login")
    }
    
    setIsLoggedIn(false);
    localStorage.clear();
    
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/adminlogin" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} />}/>
        <Route path="/adminsignup" element={<AdminSignup />}/>
        <Route path="/adminotpverify" element={<AdminOtpVerify />}/>
        <Route path="/adminforget" element={<AdminForget />}/>

        <Route path="/*"
          element={isLoggedIn ? (
              <>
                <NavbarAdmin onLogout={handleLogout} />
                <div className="contain row container-fluid">
                  <SidebarAdmin />
                  <MainContent />
                </div>
              </>
            ) : (
              <>
                <Navbar />
                <Main />
                <Footer/>
              </>
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
