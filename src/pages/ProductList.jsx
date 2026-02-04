import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import ProductCard from '../components/product/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import './ProductList.css';

const ProductList = () => {
    const { content } = useContent();
    const products = content?.products || [];
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="product-list-page container">
            <div className="page-header">
                <h1>Wholesale Catalogue</h1>
                <p>Browse our collection of handmade, ethically sourced homeware for your business.</p>
            </div>

            <div className="shop-layout">
                {/* Sidebar Filters */}
                <aside className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
                    <div className="filter-group">
                        <h3>Category</h3>
                        <ul>
                            <li><label><input type="checkbox" /> Furniture</label></li>
                            <li><label><input type="checkbox" /> Lighting</label></li>
                            <li><label><input type="checkbox" /> Decor</label></li>
                            <li><label><input type="checkbox" /> Kitchen</label></li>
                        </ul>
                    </div>
                    <div className="filter-group">
                        <h3>Price</h3>
                        <ul>
                            <li><label><input type="checkbox" /> Under £50</label></li>
                            <li><label><input type="checkbox" /> £50 - £150</label></li>
                            <li><label><input type="checkbox" /> £150+</label></li>
                        </ul>
                    </div>
                    <button className="close-filters d-lg-none" onClick={() => setIsFilterOpen(false)}>Apply</button>
                </aside>

                {/* Product Grid */}
                <main className="product-grid-container">
                    <div className="toolbar">
                        <button className="filter-toggle d-lg-none" onClick={() => setIsFilterOpen(true)}>
                            <Filter size={16} /> Filter
                        </button>
                        <div className="sort-dropdown">
                            Sort by: Recommended <ChevronDown size={14} />
                        </div>
                        <span className="product-count">{products.length} Products</span>
                    </div>

                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProductList;
