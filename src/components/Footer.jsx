import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            alert('Thank you for subscribing!');
            setEmail('');
        }
    };

    return (
        <footer className="footer" id="footer">
            {/* Main Footer Content */}
            <div className="container footer-main">
                <div className="footer-grid">
                    {/* Shop Section */}
                    <div className="footer-col">
                        <h3>SHOP</h3>
                        <ul>
                            <li><a href="/categories">BAWK</a></li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div className="footer-col">
                        <h3>LEGAL</h3>
                        <ul>
                            <li><a href="/refund-policy">Refund Policy</a></li>
                            <li><a href="/privacy-policy">Privacy Policy</a></li>
                            <li><a href="/contact">Contact Information</a></li>
                        </ul>
                    </div>

                    {/* Headquarters Section */}
                    <div className="footer-col">
                        <h3>HEADQUARTERS</h3>
                        <p className="hq-address">vinay nagar sec-2</p>
                        <a href="mailto:rogerprashant72@gmail.com" className="hq-link">rogerprashant72@gmail.com</a>
                        <a href="tel:+918446692339" className="hq-link">+91 8446692339</a>
                    </div>
                </div>
            </div>

            {/* Subscribe Section */}
            <div className="footer-subscribe-section">
                <h4>Subscribe to our emails</h4>
                <form className="subscribe-form" onSubmit={handleSubscribe}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" aria-label="Subscribe">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </form>

                {/* Social Icon */}
                <div className="footer-social">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <p>© 2026, BAWK</p>
                    {/* <div className="footer-bottom-links">
                        <a href="/privacy-policy">Privacy policy</a>
                        <a href="/terms">Terms of service</a>
                        <a href="/shipping">Shipping policy</a>
                        <a href="/refund-policy">Refund policy</a>
                        <a href="/contact">Contact Information</a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
