import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section">
                    <h4>Customer Care</h4>
                    <ul>
                        <li><Link to="#">Contact Us</Link></li>
                        <li><Link to="#">Delivery & Returns</Link></li>
                        <li><Link to="#">FAQs</Link></li>
                        <li><Link to="#">Track Order</Link></li>
                        <li><Link to="#">Trade Enquiries</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Shop With Us</h4>
                    <ul>
                        <li><Link to="#">Winter Sale</Link></li>
                        <li><Link to="#">New Arrivals</Link></li>
                        <li><Link to="#">Gift Cards</Link></li>
                        <li><Link to="#">Our Stores</Link></li>
                        <li><Link to="#">Catalogues</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>About Vansutracrafts</h4>
                    <ul>
                        <li><Link to="#">Our Story</Link></li>
                        <li><Link to="#">Artisans</Link></li>
                        <li><Link to="#">Sustainability</Link></li>
                        <li><Link to="#">Careers</Link></li>
                        <li><Link to="#">Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div className="footer-section newsletter">
                    <h4>Stay in the loop</h4>
                    <p>Sign up to our newsletter for 15% off your first order.</p>
                    <div className="input-group">
                        <input type="email" placeholder="Enter your email address" />
                        <button>Sign Up</button>
                    </div>
                    <div className="social-links">
                        <Instagram size={20} />
                        <Facebook size={20} />
                        <Twitter size={20} />
                        <Mail size={20} />
                    </div>
                </div>
            </div>

            <div className="footer-bottom container">
                <p>&copy; {new Date().getFullYear()} Vansutracrafts. All rights reserved.</p>
                <p>B Corp Certified</p>
            </div>
        </footer>
    );
};

export default Footer;
