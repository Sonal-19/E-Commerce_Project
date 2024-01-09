import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css";
import logo1 from "../Images/logo2.png";

export default function Footer() {
  return (
    <>
      <footer id="footer" className="footerF p-1">
        <div className="container footer-top p-3">
          <div className="row gy-4">
            <div className="col-6 footer-about">
            <Link to="/">
              <img src={logo1} alt="logo1" className="logo mb-2" />
            </Link>
              <p>ChicThread embodies the essence of timeless elegance and contemporary fashion. 
                 Our online dress haven brings you a curated collection of stylish threads, where every piece tells a story of sophistication and trendsetting style.
                 Discover the perfect ensemble that effortlessly complements your unique fashion journey with ChicThread where fashion meets flair.
              </p>
              <div className="social-links d-flex mt-4 ">
                <Link to="https://twitter.com/?lang=en" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} className='me-2' style={{color:'black', fontSize:'24px'}} />
                </Link>
                <Link to="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} className='me-2' style={{color:'black', fontSize:'24px'}}/>
                </Link>
                <Link to="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} className='me-2' style={{color:'black', fontSize:'24px'}} />
                </Link>
                <Link to="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLinkedin} className='me-2' style={{color:'black', fontSize:'24px'}}/>
                </Link>
              </div>
            </div>

            <div className="col-3 footer-links text-center">
              <h5>USEFUL LINKS</h5>
              <ul>
                <li className='pt-1'> <Link to="/userblog">Blog</Link></li>
                <li className='pt-1'> <Link to="/contactus">Contact us</Link></li>
                <li className='pt-1'> <Link to="/accessibilityview">Accessibility</Link></li>
                <li className='pt-1'><Link to="/termsofuse">Terms of Use</Link></li>
                <li className='pt-1'><Link to="/privacy-policy">Privacy policy</Link></li>
                <li className='pt-1'><Link to="/t&c">Terms & Conditions </Link></li>
              </ul>
            </div>

            <div className="col-3 footer-contact text-center">
              <h4>Contact Us</h4>
              <p>S-419 Industrial Area</p>
              <p>Phase-8, Mohali-160071</p>
              <p>Punjab, INDIA</p>
              <p className="mt-2"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
              <p><strong>Email:</strong> <span>info@chicthread.com</span></p>
            </div>
          </div>
        </div>

        <div className="container copyright text-center mt-4">
          <p>© <span>Copyright</span> <strong className="px-1">ChicThread</strong> <span>All Rights Reserved</span></p>
          <div className="credits">
          </div>
        </div>
      </footer>
    </>
  );
}
