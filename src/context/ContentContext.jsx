import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default Assets
import catLighting from '../assets/cat_lighting.png';
import catTextiles from '../assets/cat_textiles.png';
import catDecor from '../assets/prod_frames.png';
import priceHigh from '../assets/price_high.png';
import priceMid from '../assets/price_mid.png';
import priceLow from '../assets/price_low.png';
import sofaBanner from '../assets/sofa_banner.png';
import prodCake from '../assets/prod_cake.png';
import prodFrames from '../assets/prod_frames.png';
import prodChair from '../assets/prod_chair.png';

const API_URL = '/api';
const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    const getDefaultContent = useCallback(() => ({
        hero: {
            mediaUrl: null,
            mediaType: 'image',
            title: 'Exquisite Indian Handicrafts',
            subtitle: 'Premium Manufacturing & Export Partner',
            showOverlay: true
        },
        categories: [
            { id: 1, title: 'Furniture & Lighting', buttonText: 'Shop Sale', tag: 'Up to 50% Off', image: catLighting, cat: 'lighting' },
            { id: 2, title: 'Home Accessories', buttonText: 'Shop Sale', tag: 'Up to 50% Off', image: catTextiles, cat: 'textiles' },
            { id: 3, title: 'Kitchen & Dining', buttonText: 'Shop Sale', tag: 'Up to 50% Off', image: catDecor, cat: 'decor' },
            { id: 4, title: 'Over £100', buttonText: 'Shop Now', tag: 'Premium Selection', image: priceHigh, cat: 'over100' },
            { id: 5, title: 'Up to £100', buttonText: 'Shop Now', tag: 'Winter Value', image: priceMid, cat: 'upto100' },
            { id: 6, title: 'Under £30', buttonText: 'Shop Now', tag: 'Gifting Ideas', image: priceLow, cat: 'under30' }
        ],
        sofa: {
            title: 'Handmade Sofas',
            subtitle: 'Comfort & Style',
            image: sofaBanner,
            buttonText: 'View Collection'
        },
        bestsellers: {
            mainTitle: 'Vansutracrafts Bestsellers',
            description: 'Discover our most loved pieces, from our hand-carved furniture to our artisanal decor. Each piece showcases the craftsmanship and character of Indian heritage, crafted for global homes.',
            leftImage: prodCake,
            rightImg1: prodFrames,
            rightImg2: prodChair
        },
        featuredProducts: [
            { id: 1, title: 'Recycled Glass Dome Cake Stand', price: '£100', image: prodCake },
            { id: 2, title: 'Janka Tealight Holders - Amber', price: 'Sold Out', image: catTextiles },
            { id: 3, title: 'Kiko Brass Frame', price: '£22', image: prodFrames },
            { id: 4, title: 'Ukari Leather Dining Chair', price: '£180', image: prodChair }
        ],
        products: [
            { id: 101, name: 'Ama Clay Coffee Mug', price: 28, rating: 5, reviews: 12, image: prodCake, isNew: true, category: 'decor' },
            { id: 102, name: 'Mali Ribbed Cabinet', price: 850, salePrice: 595, rating: 4, reviews: 8, image: prodChair, category: 'furniture' },
            { id: 103, name: 'Kiko Brass Photo Frame', price: 35, rating: 5, reviews: 45, image: prodFrames, category: 'decor' },
            { id: 104, name: 'Esti Table Lamp', price: 125, rating: 5, reviews: 3, image: catLighting, isNew: true, category: 'lighting' },
            { id: 105, name: 'Jara Rattan Chair', price: 295, rating: 4, reviews: 15, image: prodChair, category: 'furniture' },
            { id: 106, name: 'Zia Jute Rug', price: 180, salePrice: 126, rating: 4, reviews: 22, image: catTextiles, category: 'decor' },
        ],
        whatsapp: {
            link: 'https://wa.me/1234567890',
            show: true
        },
        enquiries: []
    }), []);

    const [content, setContent] = useState(getDefaultContent());
    const [loading, setLoading] = useState(true);

    // Initial load from local storage (fast) and then API (truth)
    useEffect(() => {
        const saved = localStorage.getItem('homepage-content');
        if (saved) {
            setContent(JSON.parse(saved));
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const contentRes = await fetch(`${API_URL}/content`);
            const contentData = await contentRes.json();

            const enquiriesRes = await fetch(`${API_URL}/enquiries`);
            const enquiriesData = await enquiriesRes.json();

            const fullContent = { ...contentData, enquiries: enquiriesData };
            setContent(fullContent);
            localStorage.setItem('homepage-content', JSON.stringify(fullContent));
        } catch (error) {
            console.error('Failed to fetch from API, using local storage fallback', error);
        } finally {
            setLoading(false);
        }
    };

    const updateContent = async (section, data) => {
        // Handle arrays (categories, products, featuredProducts) vs objects (hero, sofa, etc.)
        const newContent = {
            ...content,
            [section]: Array.isArray(data) ? data : { ...content[section], ...data }
        };
        setContent(newContent);

        try {
            await fetch(`${API_URL}/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent)
            });
            localStorage.setItem('homepage-content', JSON.stringify(newContent));
        } catch (error) {
            console.error('Sync failed', error);
        }
    };

    const updateListItem = async (section, id, data) => {
        // Handle enquiries separately if status update
        if (section === 'enquiries') {
            try {
                await fetch(`${API_URL}/enquiries/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                fetchData(); // Refresh to get latest state
            } catch (error) {
                console.error('Failed to update enquiry', error);
            }
            return;
        }

        const newContent = {
            ...content,
            [section]: content[section].map(item => item.id === id ? { ...item, ...data } : item)
        };
        setContent(newContent);

        try {
            await fetch(`${API_URL}/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent)
            });
        } catch (error) {
            console.error('Sync failed', error);
        }
    };

    const addItem = async (section, item) => {
        if (section === 'enquiries') {
            try {
                await fetch(`${API_URL}/enquiries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                fetchData();
            } catch (error) {
                console.error('Failed to add enquiry', error);
            }
            return;
        }

        const newContent = {
            ...content,
            [section]: [item, ...content[section]]
        };
        setContent(newContent);

        try {
            await fetch(`${API_URL}/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent)
            });
        } catch (error) {
            console.error('Sync failed', error);
        }
    };

    const removeItem = async (section, id) => {
        if (section === 'enquiries') {
            try {
                await fetch(`${API_URL}/enquiries/${id}`, {
                    method: 'DELETE'
                });
                fetchData();
            } catch (error) {
                console.error('Failed to delete enquiry', error);
            }
            return;
        }

        const newContent = {
            ...content,
            [section]: content[section].filter(item => item.id !== id)
        };
        setContent(newContent);

        try {
            await fetch(`${API_URL}/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent)
            });
        } catch (error) {
            console.error('Sync failed', error);
        }
    };

    const resetToDefaults = () => {
        const defaults = getDefaultContent();
        setContent(defaults);
        localStorage.removeItem('homepage-content');
        // Optional: Call API to reset too
    };

    return (
        <ContentContext.Provider value={{ content, loading, updateContent, updateListItem, addItem, removeItem, resetToDefaults }}>
            {children}
        </ContentContext.Provider>
    );
};
