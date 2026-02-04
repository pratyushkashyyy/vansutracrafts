import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import './Admin.css';

const Admin = () => {
    const { content, loading, updateContent, updateListItem, addItem, removeItem, resetToDefaults } = useContent();

    // Tab and New Item States
    const [activeTab, setActiveTab] = useState('hero');
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'decor', image: null });

    // Local "Draft" States for each section
    const [draftHero, setDraftHero] = useState(content.hero || {});
    const [draftSofa, setDraftSofa] = useState(content.sofa || {});
    const [draftBestsellers, setDraftBestsellers] = useState(content.bestsellers || {});
    const [draftWhatsApp, setDraftWhatsApp] = useState(content.whatsapp || {});
    const [draftCategories, setDraftCategories] = useState(content.categories || []);
    const [draftFeatured, setDraftFeatured] = useState(content.featuredProducts || []);
    const [draftProducts, setDraftProducts] = useState(content.products || []);

    // Sync draft states when global content loads/changes
    React.useEffect(() => {
        if (!loading && content.id) {
            setDraftHero(content.hero || {});
            setDraftSofa(content.sofa || {});
            setDraftBestsellers(content.bestsellers || {});
            setDraftWhatsApp(content.whatsapp || {});
            setDraftCategories(content.categories || []);
            setDraftFeatured(content.featuredProducts || []);
            setDraftProducts(content.products || []);
        }
    }, [content, loading]);

    if (loading || !content.hero) {
        return <div className="loading-screen admin-loading">Loading configuration...</div>;
    }

    const handleSaveSection = (section, draftData) => {
        updateContent(section, draftData);
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
    };

    const handleSaveList = (section, draftList) => {
        // Since updateContent handles the whole object/array if passed as 'section', 
        // we can use it to save whole arrays too.
        updateContent(section, draftList);
        alert(`Changes saved successfully!`);
    };

    const handleHeroDraftChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDraftHero(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSofaDraftChange = (e) => {
        const { name, value } = e.target;
        setDraftSofa(prev => ({ ...prev, [name]: value }));
    };

    const handleBestsellerDraftChange = (e) => {
        const { name, value } = e.target;
        setDraftBestsellers(prev => ({ ...prev, [name]: value }));
    };

    const handleListDraftChange = (section, id, field, value) => {
        const setters = {
            categories: setDraftCategories,
            featuredProducts: setDraftFeatured,
            products: setDraftProducts
        };
        setters[section](prev => prev.map(item => item.id === id ? { ...item, ...field === 'obj' ? value : { [field]: value } } : item));
    };

    const compressImage = (file, maxWidth = 1600, quality = 0.7) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
            };
        });
    };

    const handleImageUploadDraft = async (section, field, e, id = null) => {
        const file = e.target.files[0];
        if (file) {
            try {
                let finalData;
                if (file.type.startsWith('video/')) {
                    finalData = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    });
                } else {
                    finalData = await compressImage(file, section === 'hero' ? 1920 : 1000);
                }

                if (id) {
                    handleListDraftChange(section, id, field, finalData);
                } else {
                    const setters = {
                        hero: setDraftHero,
                        sofa: setDraftSofa,
                        bestsellers: setDraftBestsellers
                    };
                    setters[section](prev => ({ ...prev, [field]: finalData }));
                }
            } catch (error) {
                console.error("Upload failed", error);
                alert("Failed to process media.");
            }
        }
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            alert('Please fill in name, price, and upload an image.');
            return;
        }
        const id = Date.now();
        addItem('products', { ...newProduct, id });
        setNewProduct({ name: '', price: '', category: 'decor', image: null });
    };

    const confirmReset = () => {
        if (window.confirm('This will reset all content to defaults. Are you sure?')) {
            resetToDefaults();
        }
    };

    return (
        <div className="admin-page container">
            <header className="admin-header">
                <div className="header-flex">
                    <div>
                        <h1>Content Manager</h1>
                        <p>Manage homepage banners, texts, and images.</p>
                    </div>
                    <button className="btn-reset" onClick={confirmReset}>Reset Defaults</button>
                </div>
            </header>

            <div className="admin-tabs">
                <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>Hero Media</button>
                <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>Categories (6)</button>
                <button className={activeTab === 'featuredProducts' ? 'active' : ''} onClick={() => setActiveTab('featuredProducts')}>Featured Products</button>
                <button className={activeTab === 'sofa' ? 'active' : ''} onClick={() => setActiveTab('sofa')}>Sofa Banner</button>
                <button className={activeTab === 'bestsellers' ? 'active' : ''} onClick={() => setActiveTab('bestsellers')}>Bestsellers</button>
                <button className={activeTab === 'catalogue' ? 'active' : ''} onClick={() => setActiveTab('catalogue')}>Full Catalogue ({content.products.length})</button>
                <button className={activeTab === 'enquiries' ? 'active' : ''} onClick={() => setActiveTab('enquiries')}>
                    Enquiries {content.enquiries?.length > 0 && <span className="tab-badge">{content.enquiries.length}</span>}
                </button>
                <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>
            </div>

            <main className="admin-content">
                {activeTab === 'hero' && (
                    <section className="admin-section card">
                        <h3>Homepage Hero (Media)</h3>
                        <div className="form-group-grid">
                            <div className="form-item">
                                <label>Media Type</label>
                                <select name="mediaType" value={draftHero.mediaType} onChange={handleHeroDraftChange}>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>
                            <div className="form-item">
                                <label className="toggle-label">
                                    <input type="checkbox" name="showOverlay" checked={draftHero.showOverlay} onChange={handleHeroDraftChange} />
                                    Show Text Overlay
                                </label>
                            </div>
                            <div className="form-item full-width">
                                <label>Upload Media ({draftHero.mediaType})</label>
                                <div className="image-preview-area">
                                    {draftHero.mediaUrl ? (
                                        draftHero.mediaType === 'video' ?
                                            <video src={draftHero.mediaUrl} className="current-thumb" muted /> :
                                            <img src={draftHero.mediaUrl} alt="Current" className="current-thumb" />
                                    ) : (
                                        <div className="empty-preview">No media uploaded</div>
                                    )}
                                    <input type="file" accept={draftHero.mediaType === 'video' ? 'video/*' : 'image/*'} onChange={(e) => handleImageUploadDraft('hero', 'mediaUrl', e)} />
                                </div>
                            </div>

                            {draftHero.showOverlay && (
                                <>
                                    <div className="form-item">
                                        <label>Overlay Title</label>
                                        <input name="title" value={draftHero.title} onChange={handleHeroDraftChange} />
                                    </div>
                                    <div className="form-item">
                                        <label>Overlay Subtitle</label>
                                        <input name="subtitle" value={draftHero.subtitle} onChange={handleHeroDraftChange} />
                                    </div>
                                    <div className="form-item">
                                        <label>Promo Code</label>
                                        <input name="code" value={draftHero.code || ''} onChange={handleHeroDraftChange} />
                                    </div>
                                    <div className="form-item full-width">
                                        <label>B2B Intro Title</label>
                                        <input name="introTitle" value={draftHero.introTitle || ''} onChange={handleHeroDraftChange} />
                                    </div>
                                    <div className="form-item full-width">
                                        <label>B2B Intro Subtitle</label>
                                        <textarea name="introSubtitle" value={draftHero.introSubtitle || ''} onChange={handleHeroDraftChange} rows="3" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="admin-section-footer">
                            <button className="btn-save" onClick={() => handleSaveSection('hero', draftHero)}>Save Hero Changes</button>
                        </div>
                    </section>
                )}

                {activeTab === 'categories' && (
                    <section className="admin-section card">
                        <h3>Consolidated Category Grid (6 Items)</h3>
                        <div className="list-manager">
                            {draftCategories.map(cat => (
                                <div key={cat.id} className="list-item">
                                    <div className="list-item-image">
                                        <img src={cat.image} alt={cat.title} />
                                        <input type="file" onChange={(e) => handleImageUploadDraft('categories', 'image', e, cat.id)} />
                                    </div>
                                    <div className="list-item-content">
                                        <div className="form-item">
                                            <label>Tag (e.g. Up to 50% Off)</label>
                                            <input value={cat.tag || ''} onChange={(e) => handleListDraftChange('categories', cat.id, 'tag', e.target.value)} />
                                        </div>
                                        <div className="form-item">
                                            <label>Title</label>
                                            <input value={cat.title} onChange={(e) => handleListDraftChange('categories', cat.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="form-item">
                                            <label>Button Label</label>
                                            <input value={cat.buttonText || ''} onChange={(e) => handleListDraftChange('categories', cat.id, 'buttonText', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="admin-section-footer">
                            <button className="btn-save" onClick={() => handleSaveList('categories', draftCategories)}>Save Category Changes</button>
                        </div>
                    </section>
                )}

                {activeTab === 'featuredProducts' && (
                    <section className="admin-section card">
                        <h3>Featured Products Grid (4 Items)</h3>
                        <div className="list-manager">
                            {draftFeatured.map(prod => (
                                <div key={prod.id} className="list-item">
                                    <div className="list-item-image">
                                        <img src={prod.image} alt={prod.title} />
                                        <input type="file" onChange={(e) => handleImageUploadDraft('featuredProducts', 'image', e, prod.id)} />
                                    </div>
                                    <div className="list-item-content">
                                        <div className="form-item">
                                            <label>Title</label>
                                            <input value={prod.title} onChange={(e) => handleListDraftChange('featuredProducts', prod.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="form-item">
                                            <label>Price or Status (e.g. £22 or Sold Out)</label>
                                            <input value={prod.price} onChange={(e) => handleListDraftChange('featuredProducts', prod.id, 'price', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="admin-section-footer">
                            <button className="btn-save" onClick={() => handleSaveList('featuredProducts', draftFeatured)}>Save Featured Changes</button>
                        </div>
                    </section>
                )}

                {activeTab === 'sofa' && (
                    <section className="admin-section card">
                        <h3>Sofa Banner</h3>
                        <div className="form-group-grid">
                            <div className="form-item">
                                <label>Title</label>
                                <input name="title" value={draftSofa.title} onChange={handleSofaDraftChange} />
                            </div>
                            <div className="form-item">
                                <label>Subtitle</label>
                                <input name="subtitle" value={draftSofa.subtitle} onChange={handleSofaDraftChange} />
                            </div>
                            <div className="form-item">
                                <label>Button Label</label>
                                <input name="buttonText" value={draftSofa.buttonText} onChange={handleSofaDraftChange} />
                            </div>
                            <div className="form-item full-width">
                                <label>Image</label>
                                <div className="image-preview-area">
                                    <img src={draftSofa.image} alt="Sofa" className="current-thumb tall" />
                                    <input type="file" onChange={(e) => handleImageUploadDraft('sofa', 'image', e)} />
                                </div>
                            </div>
                        </div>
                        <div className="admin-section-footer">
                            <button className="btn-save" onClick={() => handleSaveSection('sofa', draftSofa)}>Save Sofa Changes</button>
                        </div>
                    </section>
                )}

                {activeTab === 'bestsellers' && (
                    <section className="admin-section card">
                        <h3>Bestsellers Section</h3>
                        <div className="form-group-grid">
                            <div className="form-item full-width">
                                <label>Title</label>
                                <input name="mainTitle" value={draftBestsellers.mainTitle} onChange={handleBestsellerDraftChange} />
                            </div>
                            <div className="form-item full-width">
                                <label>Description</label>
                                <textarea name="description" value={draftBestsellers.description} onChange={handleBestsellerDraftChange} rows="4" />
                            </div>
                            <div className="form-item">
                                <label>Large Image (Left)</label>
                                <div className="image-preview-area">
                                    <img src={draftBestsellers.leftImage} className="current-thumb" />
                                    <input type="file" onChange={(e) => handleImageUploadDraft('bestsellers', 'leftImage', e)} />
                                </div>
                            </div>
                            <div className="form-item">
                                <label>Collage 1 (Top Right)</label>
                                <div className="image-preview-area">
                                    <img src={draftBestsellers.rightImg1} className="current-thumb" />
                                    <input type="file" onChange={(e) => handleImageUploadDraft('bestsellers', 'rightImg1', e)} />
                                </div>
                            </div>
                            <div className="form-item">
                                <label>Collage 2 (Bottom Right)</label>
                                <div className="image-preview-area">
                                    <img src={draftBestsellers.rightImg2} className="current-thumb" />
                                    <input type="file" onChange={(e) => handleImageUploadDraft('bestsellers', 'rightImg2', e)} />
                                </div>
                            </div>
                        </div>
                        <div className="admin-section-footer">
                            <button className="btn-save" onClick={() => handleSaveSection('bestsellers', draftBestsellers)}>Save Bestseller Changes</button>
                        </div>
                    </section>
                )}

                {activeTab === 'catalogue' && (
                    <section className="admin-section card">
                        <h3>Wholesale Catalogue Manager</h3>

                        {/* Add New Product Form */}
                        <div className="add-new-form">
                            <h4>Add New Product</h4>
                            <div className="form-group-grid">
                                <div className="form-item">
                                    <label>Product Name</label>
                                    <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Ama Clay Coffee Mug" />
                                </div>
                                <div className="form-item">
                                    <label>Price (£)</label>
                                    <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="28" />
                                </div>
                                <div className="form-item">
                                    <label>Category</label>
                                    <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                                        <option value="furniture">Furniture</option>
                                        <option value="lighting">Lighting</option>
                                        <option value="decor">Decor</option>
                                        <option value="kitchen">Kitchen</option>
                                    </select>
                                </div>
                                <div className="form-item full-width">
                                    <label>Product Image</label>
                                    <div className="image-preview-area">
                                        {newProduct.image && <img src={newProduct.image} className="current-thumb" alt="New Preview" />}
                                        <input type="file" onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const compressedData = await compressImage(file, 1000);
                                                setNewProduct({ ...newProduct, image: compressedData });
                                            }
                                        }} />
                                    </div>
                                </div>
                                <button className="btn-save" onClick={handleAddProduct}>Add to Catalogue</button>
                            </div>
                        </div>

                        <hr className="admin-divider" />

                        {/* Existing Products List */}
                        <div className="list-manager">
                            <h4>Manage Existing Products</h4>
                            {draftProducts.map(prod => (
                                <div key={prod.id} className="list-item">
                                    <div className="list-item-image">
                                        <img src={prod.image} alt={prod.name} />
                                        <input type="file" onChange={(e) => handleImageUploadDraft('products', 'image', e, prod.id)} />
                                    </div>
                                    <div className="list-item-content">
                                        <div className="form-item">
                                            <label>Name</label>
                                            <input value={prod.name} onChange={(e) => handleListDraftChange('products', prod.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="form-item">
                                            <label>Price (£)</label>
                                            <input type="number" value={prod.price} onChange={(e) => handleListDraftChange('products', prod.id, 'price', e.target.value)} />
                                        </div>
                                        <div className="form-item">
                                            <label>Category</label>
                                            <select value={prod.category} onChange={(e) => handleListDraftChange('products', prod.id, 'category', e.target.value)}>
                                                <option value="furniture">Furniture</option>
                                                <option value="lighting">Lighting</option>
                                                <option value="decor">Decor</option>
                                                <option value="kitchen">Kitchen</option>
                                            </select>
                                        </div>
                                        <button className="btn-delete" onClick={() => removeItem('products', prod.id)}>Delete Product</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="admin-section-footer">
                            <button className="btn-save" onClick={() => handleSaveList('products', draftProducts)}>Save Catalogue Changes</button>
                        </div>
                    </section>
                )}

                {activeTab === 'enquiries' && (
                    <section className="admin-section card">
                        <h3>Business Enquiries</h3>
                        {content.enquiries?.length > 0 ? (
                            <div className="enquiry-list">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Business</th>
                                            <th>Email / Phone</th>
                                            <th>Type</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {content.enquiries.map(enq => (
                                            <tr key={enq.id}>
                                                <td>{enq.date}</td>
                                                <td className="bold">{enq.businessName}</td>
                                                <td>
                                                    <div>{enq.email}</div>
                                                    <div className="subtext">{enq.phone}</div>
                                                </td>
                                                <td><span className="type-pill">{enq.businessType}</span></td>
                                                <td className="message-cell">{enq.message}</td>
                                                <td><span className={`status-pill ${enq.status?.toLowerCase() || 'new'}`}>{enq.status || 'New'}</span></td>
                                                <td>
                                                    <div className="admin-actions-cell">
                                                        {enq.status !== 'Served' && (
                                                            <button className="btn-serve" onClick={() => updateListItem('enquiries', enq.id, { status: 'Served' })}>Mark as Served</button>
                                                        )}
                                                        <button className="btn-delete" onClick={() => removeItem('enquiries', enq.id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">No enquiries received yet.</div>
                        )}
                    </section>
                )}

                {activeTab === 'settings' && (
                    <section className="admin-section card">
                        <h3>Site Settings</h3>
                        <div className="form-group-grid">
                            <div className="form-item full-width">
                                <label>WhatsApp Link (e.g. https://wa.me/yournumber)</label>
                                <input
                                    value={draftWhatsApp.link || ''}
                                    onChange={(e) => setDraftWhatsApp(prev => ({ ...prev, link: e.target.value }))}
                                    placeholder="https://wa.me/..."
                                />
                            </div>
                            <div className="form-item">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={draftWhatsApp.show ?? true}
                                        onChange={(e) => setDraftWhatsApp(prev => ({ ...prev, show: e.target.checked }))}
                                    />
                                    Show WhatsApp Widget
                                </label>
                            </div>
                        </div>
                        <div className="admin-section-footer">
                            <button className="btn-save" onClick={() => handleSaveSection('whatsapp', draftWhatsApp)}>Save Settings</button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Admin;
