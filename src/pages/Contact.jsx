import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import './Contact.css';

const Contact = () => {
    const { addItem } = useContent();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        phone: '',
        businessType: 'Retail Store',
        message: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const enquiry = {
            ...formData,
            id: Date.now(),
            date: new Date().toLocaleString(),
            status: 'New'
        };
        addItem('enquiries', enquiry);
        setSubmitted(true);
        // Reset form
        setFormData({
            businessName: '',
            email: '',
            phone: '',
            businessType: 'Retail Store',
            message: ''
        });
    };

    if (submitted) {
        return (
            <div className="contact-page container">
                <div className="contact-success card" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h1 style={{ color: '#4A332D', marginBottom: '20px' }}>Enquiry Sent Successfully!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>Thank you for reaching out. Our team will get back to you shortly.</p>
                    <button className="btn btn-dark" style={{ marginTop: '30px' }} onClick={() => setSubmitted(false)}>Send Another Enquiry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-page container">
            <div className="contact-header">
                <h1>Contact Us</h1>
                <p>Interested in stocking our products? Get in touch with our wholesale team.</p>
            </div>

            <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="businessName">Business Name</label>
                        <input type="text" id="businessName" value={formData.businessName} onChange={handleChange} placeholder="Your Business Name" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="name@business.com" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" value={formData.phone} onChange={handleChange} placeholder="Optional" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="businessType">Business Type</label>
                        <select id="businessType" value={formData.businessType} onChange={handleChange}>
                            <option>Retail Store</option>
                            <option>Interior Designer</option>
                            <option>Hospitality</option>
                            <option>Online Retailer</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Tell us about your business needs..." required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn">Send Enquiry</button>
                </form>

                <div className="contact-info">
                    <h3>Other ways to connect</h3>
                    <p><strong>Email:</strong> trade@vansutracrafts.com</p>
                    <p><strong>Phone:</strong> +91 0000 000000</p>
                    <p><strong>Address:</strong><br />
                        Vansutracrafts<br />
                        Artisan Workshop, Jodhpur<br />
                        India
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
