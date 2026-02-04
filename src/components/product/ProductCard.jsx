import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                {product.isNew && <span className="badge new">New</span>}
                {product.salePrice && <span className="badge sale">Sale</span>}
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < product.rating ? "#333" : "none"} stroke="#333" />
                    ))}
                    <span className="review-count">({product.reviews})</span>
                </div>
                <div className="product-price">
                    {product.salePrice ? (
                        <>
                            <span className="original-price">£{product.price}</span>
                            <span className="sale-price">£{product.salePrice}</span>
                        </>
                    ) : (
                        <span>£{product.price}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
