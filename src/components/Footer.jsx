import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <div className="container footer-container">
                <div className="footer-col">
                    <h3>Contact Us</h3>
                    <p>BAWK</p>
                    <p>MP GWALIOR </p>
                    <p className="footer-contact">support@bawk.com</p>
                    <p className="footer-contact">+91 000 000 0000</p>
                    <div className="social-links">
                        <span>FB</span>
                        <span>IG</span>
                        <span>TW</span>
                    </div>
                </div>
                <div className="footer-col">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Delivery & Payment</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h3>Our Services</h3>
                    <ul>
                        <li><a href="#">My Account</a></li>
                        <li><a href="#">Order History</a></li>
                        <li><a href="#">Wishlist</a></li>
                        <li><a href="#">Newsletter</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h3>Our Store</h3>
                    <div className="map-placeholder">
                        Map Location Placeholder
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2024 BAWK. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
