import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppWidget from './components/layout/WhatsAppWidget';

import { ContentProvider } from './context/ContentContext';
import Admin from './pages/Admin';

// Layout wrapper
const Layout = ({ children }) => (
    <div className="app-wrapper">
        <Header />
        <main>
            {children}
        </main>
        <Footer />
        <WhatsAppWidget />
    </div>
);

function App() {
    return (
        <ContentProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout><Home /></Layout>} />
                    <Route path="/catalogue" element={<Layout><ProductList /></Layout>} />
                    <Route path="/contact" element={<Layout><Contact /></Layout>} />
                    <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
                    <Route path="/admin" element={<Layout><Admin /></Layout>} />
                </Routes>
            </Router>
        </ContentProvider>
    );
}

export default App;
