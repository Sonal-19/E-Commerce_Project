import React, { useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

export default function SidebarAdmin() {
  const [activeSection, setActiveSection] = useState(null);

  const handleToggle = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <>
      <div className='sidebar col-2 mt-5' >
        <div className="sidebar-section"
          onClick={() => handleToggle('todo')}>
          <Link to="/admindashboard" className='section-link'>
            <span>Dashboard</span>
          </Link>
        </div>
        <div className="sidebar-section"
          onClick={() => handleToggle('todo')}>
          <Link to="/contactlist" className='section-link'>
            <span>Contact List</span>
          </Link>
        </div>

        <div className="sidebar-section"
          onClick={() => handleToggle('todo')}>
          <Link to="/adminaccount" className='section-link'>
            <span>Account</span>
          </Link>
        </div>

        <div className= "sidebar-section" 
          onClick={() => handleToggle('product')}
        >
          <Link to="#" className='section-link'>
            <span>Product</span>
            <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 'auto', marginRight: '5px' }} />
          </Link>
        </div>
        {activeSection === 'product' && (
          <>
          <div className='sub-menu sidebar-section'>
            <Link to="/allproducts" className="sub-menu-link">
              Product List
            </Link>
          </div>
		      <div className='sub-menu sidebar-section'>
            <Link to="/addproduct" className="sub-menu-link">
              Add New Product
            </Link>
          </div>
		  </>
        )}

        <div className="sidebar-section"
          onClick={() => handleToggle('user account')}>
          <Link to="#" className='section-link'>
            <span>User</span>
            <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 'auto', marginRight: '5px' }} />
          </Link>
        </div>
        {activeSection === 'user account' && (
          <>
          <div className='sub-menu sidebar-section'>
            <Link to="/allusers" className='sub-menu-link'>User List</Link>
          </div>
          <div className='sub-menu sidebar-section'>
            <Link to="/adduser" className='sub-menu-link'>Add New User</Link>
          </div>
          </>
        )}
        
        <div className="sidebar-section"
          onClick={() => handleToggle('admin account')}>
          <Link to="#" className='section-link'>
            <span>Admin</span>
            <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 'auto', marginRight: '5px' }} />
          </Link>
        </div>
        {activeSection === 'admin account' && (
          <>
          <div className='sub-menu sidebar-section'>
            <Link to="/alladmin" className='sub-menu-link'>Admin List</Link>
          </div>
          <div className='sub-menu sidebar-section'>
            <Link to="/adminadd" className='sub-menu-link'>Add New Admin</Link>
          </div>
          </>
        )}

        <div className="sidebar-section"
          onClick={() => handleToggle('customer policy')}>
          <Link to="#" className='section-link'>
            <span>Customer Policies</span>
            <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 'auto', marginRight: '5px' }} />
          </Link>
        </div>
        {activeSection === 'customer policy' && (
          <>
          <div className='sub-menu sidebar-section'>
            <Link to="/privacypolicy" className='sub-menu-link'>Privacy Policy</Link>
          </div>
          <div className='sub-menu sidebar-section'>
            <Link to="/termsuse" className='sub-menu-link'>Terms of Use</Link>
          </div>
          <div className='sub-menu sidebar-section'>
            <Link to="/accessibility" className='sub-menu-link'>Accessibility</Link>
          </div>
          <div className='sub-menu sidebar-section'>
            <Link to="/termsconditions" className='sub-menu-link'>Terms & Conditions</Link>
          </div>
          </>
        )}

      <div className="sidebar-section"
            onClick={() => handleToggle('todo')}>
            <Link to="#" className='section-link'>
              <span>ToDo</span>
              <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 'auto', marginRight: '5px' }} />
            </Link>
        </div>
          {activeSection === 'todo' && (
          <>
          <div className='sub-menu sidebar-section'>
            <Link to="/todo" className='sub-menu-link'>ToDo List</Link>
          </div>
          </>
          )}

        <div className="sidebar-section"
              onClick={() => handleToggle('blog')}>
              <Link to="#" className='section-link'>
                <span>Blog</span>
                <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 'auto', marginRight: '5px' }} />
              </Link>
          </div>
            {activeSection === 'blog' && (
            <>
            <div className='sub-menu sidebar-section'>
              <Link to="/allblog" className='sub-menu-link'>Blog List</Link>
            </div>
            <div className='sub-menu sidebar-section'>
              <Link to="/addblog" className='sub-menu-link'>Add New Blog</Link>
            </div>
            </>
            )}

          <div className="sidebar-section"
          onClick={() => handleToggle('todo')}>
          <Link to="/chart" className='section-link'>
            <span>Chart List</span>
          </Link>
          </div>

        <div className="sidebar-section"
              onClick={() => handleToggle('page')}>
              <Link to="#" className='section-link'>
                <span>Pages</span>
                <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 'auto', marginRight: '5px' }} />
              </Link>
          </div>
            {activeSection === 'page' && (
            <>
            <div className='sub-menu sidebar-section'>
              <Link to="/adminsignup" className='sub-menu-link'>Sign Up</Link>
            </div>
            <div className='sub-menu sidebar-section'>
              <Link to="/adminlogin" className='sub-menu-link'>Login </Link>
            </div>
            <div className='sub-menu sidebar-section'>
              <Link to="/adminforget" className='sub-menu-link'>Forget Password</Link>
            </div>
            </>
            )}

        <div className="sidebar-section"
          onClick={() => handleToggle('todo')}>
          <Link to="/progress" className='section-link'>
            <span>Progress Status</span>
          </Link>
          </div>

      </div>
    </>
  );
}
