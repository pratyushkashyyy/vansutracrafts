import React, { useState } from 'react';
import { Star, Truck, ShieldCheck, Heart } from 'lucide-react';
import kitchenImage from '../assets/kitchen.png';
import './ProductDetail.css';

const ProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('story');

    // Mock Data
    const product = {
        name: 'Mali Ribbed Cabinet',
        price: 850,
        rating: 5,
        reviews: 12,
        images: [
            kitchenImage, // Borrowing existing assets for now
            'https://placehold.co/600x800?text=Detail+1',
            'https://placehold.co/600x800?text=Detail+2',
        ],
        description: 'Our Mali ribbed cabinet is crafted from sustainable mango wood. The ribbed detail is hand-carved by skilled artisans in India. This solid wood cabinet is perfect for storing crockery, linens or books.',
        dimensions: 'H85 x W95 x D40 cm',
        sku: 'MB1203',
    };

    return (
        <div className="product-detail-page container">
            <div className="product-layout">
                {/* Gallery */}
                <div className="product-gallery">
                    <div className="main-image">
                        <img src={product.images[selectedImage]} alt={product.name} />
                    </div>
                    <div className="thumbnail-list">
                        {product.images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                                onClick={() => setSelectedImage(idx)}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="product-info-column">
                    <div className="breadcrumbs">Home / Furniture / Cabinets / {product.name}</div>
                    <h1 className="product-title">{product.name}</h1>

                    <div className="rating-row">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="#333" stroke="#333" />
                        ))}
                        <span>({product.reviews} Reviews)</span>
                    </div>

                    <div className="price-row">
                        <span className="price">£{product.price}</span>
                        <span className="stock-status">In Stock</span>
                    </div>

                    <p className="short-desc">{product.description}</p>

                    <div className="actions">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button className="btn btn-add">Add to Basket</button>
                        <button className="btn-wishlist"><Heart /></button>
                    </div>

                    <div className="features">
                        <div className="feature">
                            <Truck size={20} />
                            <span>Free delivery on orders over £50</span>
                        </div>
                        <div className="feature">
                            <ShieldCheck size={20} />
                            <span>2 Year Guarantee</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="product-tabs">
                        <div className="tab-headers">
                            <button
                                className={activeTab === 'story' ? 'active' : ''}
                                onClick={() => setActiveTab('story')}
                            >
                                Design Story
                            </button>
                            <button
                                className={activeTab === 'details' ? 'active' : ''}
                                onClick={() => setActiveTab('details')}
                            >
                                Details & Care
                            </button>
                            <button
                                className={activeTab === 'delivery' ? 'active' : ''}
                                onClick={() => setActiveTab('delivery')}
                            >
                                Delivery
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'story' && (
                                <p>Handmade in India, this piece celebrates the natural beauty of mango wood. The ribbed texture adds depth and interest to any room.</p>
                            )}
                            {activeTab === 'details' && (
                                <ul>
                                    <li>Material: Mango Wood</li>
                                    <li>Dimensions: {product.dimensions}</li>
                                    <li>SKU: {product.sku}</li>
                                </ul>
                            )}
                            {activeTab === 'delivery' && (
                                <p>Standard delivery: 3-5 working days. Express delivery available.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
