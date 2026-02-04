import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import './Home.css';

const Home = () => {
    const { content, loading } = useContent();

    if (loading && !content.hero?.title) {
        return <div className="loading-screen">Loading content...</div>;
    }

    // Safety destructuring with defaults
    const {
        hero = {},
        categories = [],
        sofa = {},
        bestsellers = {},
        featuredProducts = []
    } = content || {};

    return (
        <div className="home-page">

            {/* 1. Media-Only Hero Banner */}
            <section className="media-hero-section">
                {hero?.mediaUrl ? (
                    <div className="hero-media-wrapper">
                        {hero.mediaType === 'video' ? (
                            <video src={hero.mediaUrl} autoPlay loop muted playsInline className="hero-media-bg" />
                        ) : (
                            <img src={hero.mediaUrl} alt="Hero Banner" className="hero-media-bg" />
                        )}
                        {hero.showOverlay && (
                            <div className="hero-media-overlay">
                                <div className="overlay-content">
                                    <h2 className="overlay-subtitle">{hero.title}</h2>
                                    <h1 className="overlay-main-title">{hero.subtitle}</h1>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="hero-media-placeholder">
                        <h2>Welcome to vansutracrafts</h2>
                        <p>Upload a banner in the Admin dashboard to get started.</p>
                    </div>
                )}
            </section>

            {/* NEW: B2B Introduction */}
            <section className="b2b-intro-section container">
                <div className="b2b-intro-content">
                    <h2 className="section-title-serif">{hero?.introTitle || 'B2B Handicraft Manufacturing & Export'}</h2>
                    <p className="section-subtitle-neutral">
                        {hero?.introSubtitle || 'We are an India-based manufacturer and exporter of handmade home décor and handicrafts, supplying global wholesalers, retailers, hospitality groups, and interior project buyers.'}
                    </p>
                    <div className="b2b-actions">
                        <button className="btn-outline-dark">Request Export Catalogue</button>
                        <Link to="/contact" className="btn-outline-dark">Wholesale / Export Enquiry</Link>
                    </div>
                </div>
            </section>

            {/* 2. Category Grid */}
            <section className="container section-categories-refined">
                <div className="grid-3">
                    {Array.isArray(categories) && categories.filter(Boolean).map(cat => (
                        <Link key={cat?.id || Math.random()} to={`/catalogue?cat=${cat?.cat || ''}`} className="category-card-premium">
                            <div className="category-img-wrapper">
                                <img src={cat?.image || ''} alt={cat?.title || ''} />
                                {cat?.tag && <div className="category-tag">{cat.tag}</div>}
                                <div className="category-overlay-content">
                                    <h3 className="category-title-serif">{cat?.title || ''}</h3>
                                    <span className="btn-outline-small">{cat?.buttonText || 'View Range'}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* NEW: Who We Supply To */}
            <section className="b2b-supply-section container">
                <h2 className="section-title-serif">Who We Supply To</h2>
                <ul className="b2b-supply-list">
                    <li>Importers & distributors</li>
                    <li>Home décor retail chains</li>
                    <li>Online marketplaces</li>
                    <li>Hotels, resorts & hospitality groups</li>
                    <li>Interior designers & project buyers</li>
                </ul>
            </section>

            <section className="sofa-banner">
                {sofa?.image && <img src={sofa?.image} alt={sofa?.title || ''} className="banner-bg" />}
                <div className="banner-content">
                    <h2>{sofa?.title}</h2>
                    <p className="cursive-sub">{sofa?.subtitle || ''}</p>
                    <Link to="/catalogue" className="btn btn-dark">{sofa?.buttonText || 'View Collection'}</Link>
                </div>
            </section>

            {/* NEW: Export Product Categories */}
            <section className="b2b-export-categories container">
                <h2 className="section-title-serif">Our Export Product Categories</h2>
                <div className="b2b-category-list-pills">
                    <span>Wooden Handicrafts</span>
                    <span>Metal & Brass Décor</span>
                    <span>Vintage & Reclaimed Wood Items</span>
                    <span>Tableware & Utility Décor</span>
                    <span>Wall Art & Statement Pieces</span>
                </div>
                <div className="b2b-cta-wrapper">
                    <button className="btn-dark">View Full Export Catalogue (PDF / WhatsApp)</button>
                </div>
            </section>

            {/* NEW: Why Choose Us */}
            <section className="b2b-why-choose container">
                <h2 className="section-title-serif">Why Choose Us</h2>
                <div className="b2b-features-grid">
                    <div className="b2b-feature-item">
                        <h4>In-house quality inspection</h4>
                    </div>
                    <div className="b2b-feature-item">
                        <h4>Skilled artisan network</h4>
                    </div>
                    <div className="b2b-feature-item">
                        <h4>Customization & OEM support</h4>
                    </div>
                    <div className="b2b-feature-item">
                        <h4>Export-grade packaging standards</h4>
                    </div>
                    <div className="b2b-feature-item">
                        <h4>Reliable production timelines</h4>
                    </div>
                </div>
            </section>

            {/* 5. Winter Bestsellers */}
            <section className="container section-bestsellers-split">
                <div className="bestseller-split-layout">
                    <div className="bestseller-left">
                        {bestsellers?.leftImage && <img src={bestsellers.leftImage} alt="Featured" className="feature-img" />}
                    </div>

                    <div className="bestseller-right">
                        <div className="bestseller-collage">
                            {bestsellers?.rightImg1 && <img src={bestsellers.rightImg1} alt="Collage 1" />}
                            {bestsellers?.rightImg2 && <img src={bestsellers.rightImg2} alt="Collage 2" />}
                        </div>

                        <div className="bestseller-text-content">
                            <h2>{bestsellers?.mainTitle || 'Bestsellers'}</h2>
                            <p>{bestsellers?.description || ''}</p>
                            <Link to="/catalogue" className="shop-link-bold">View Range</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Featured Products Grid */}
            <section className="container section-featured-products">
                <div className="grid-4">
                    {Array.isArray(featuredProducts) && featuredProducts.filter(Boolean).map(prod => (
                        <div key={prod?.id || Math.random()} className="product-card-simple">
                            <div className="product-img-frame">
                                <img src={prod?.image || ''} alt={prod?.title || ''} />
                            </div>
                            <div className="product-info-minimal">
                                <h4 className="prod-name">{prod?.title || ''}</h4>
                                <span className={`prod-price ${prod?.price === 'Sold Out' ? 'sold-out' : ''}`}>
                                    {prod?.price || ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* NEW: Custom Manufacturing & Private Label */}
            <section className="b2b-custom-mfg container">
                <h2 className="section-title-serif">Custom Manufacturing & Private Label</h2>
                <div className="b2b-custom-content">
                    <p>We offer:</p>
                    <ul className="b2b-bullet-list">
                        <li>Design development from reference images</li>
                        <li>Size, finish, and material customization</li>
                        <li>Private labeling and branded packaging</li>
                        <li>Bulk and project-based production</li>
                    </ul>
                </div>
            </section>



            {/* NEW: Export Experience & Markets Served */}
            <section className="b2b-experience-section container">
                <h2 className="section-title-serif">Export Experience & Markets Served</h2>
                <ul className="b2b-bullet-list">
                    <li>Exporting to USA, UK, Europe, Middle East, and Australia</li>
                    <li>Experience with FOB, CIF, and DDP shipments</li>
                    <li>HS codes and export documentation handled</li>
                    <li>Minimum Order Quantity (MOQ): Flexible / Product-based</li>
                </ul>

                {/* NEW: Final Export CTA */}
                <div className="b2b-final-cta">
                    <h3>Interested in wholesale or export orders?</h3>
                    <div className="b2b-actions">
                        <a
                            href={content.whatsapp?.link || '#'}
                            className="btn btn-whatsapp-highlight"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            WhatsApp Export Enquiry
                        </a>
                    </div>
                </div>
            </section>

            {/* NEW: About Us Section */}
            <section className="b2b-about-section container">
                <div className="b2b-about-content">
                    <h2 className="section-title-serif">About Us</h2>
                    <p className="b2b-about-text">
                        We are an India-based handicraft manufacturing and export company working closely with
                        skilled artisans to supply handmade home décor to global buyers. Our focus is consistent
                        quality, ethical sourcing, customization capability, and long-term partnerships with
                        international clients.
                    </p>
                </div>
            </section>

        </div >
    );
};

export default Home;
