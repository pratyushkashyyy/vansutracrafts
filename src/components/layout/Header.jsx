import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="promo-bar">
                <p>Wholesale & Export Enquiries Only | Catalogue on Request</p>
            </div>

            <div className="main-header container">
                <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </div>

                <div className="logo">
                    <Link to="/">vansutracrafts</Link>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <Link to="/catalogue" onClick={() => setIsMenuOpen(false)}>Catalogue</Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-icons">
                    <Search className="icon" />
                    {/* Cart removed for B2B leads focus */}
                </div>
            </div>
        </header>
    );
};

export default Header;
