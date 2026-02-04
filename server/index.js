import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initial default content (same as frontend's getDefaultContent)
const defaultContent = {
    hero: {
        title: 'Authentic Indian Handicrafts',
        subtitle: 'B2B Wholesale & Global Export',
        introTitle: 'B2B Handicraft Manufacturing & Export',
        introSubtitle: 'We are an India-based manufacturer and exporter of handmade home décor and handicrafts, supplying global wholesalers, retailers, hospitality groups, and interior project buyers.',
        mediaType: 'image',
        mediaUrl: '/src/assets/hero.png',
        showOverlay: true
    },
    categories: [
        { id: 1, title: 'Furniture & Lighting', buttonText: 'Shop Sale', tag: 'Up to 50% Off', image: '/src/assets/cat_lighting.png', cat: 'lighting' },
        { id: 2, title: 'Home Accessories', buttonText: 'Shop Sale', tag: 'Up to 50% Off', image: '/src/assets/cat_textiles.png', cat: 'textiles' },
        { id: 3, title: 'Kitchen & Dining', buttonText: 'Shop Sale', tag: 'Up to 50% Off', image: '/src/assets/kitchen.png', cat: 'decor' },
        { id: 4, title: 'Over £100', buttonText: 'Shop Now', tag: 'Premium Selection', image: '/src/assets/price_high.png', cat: 'over100' },
        { id: 5, title: 'Up to £100', buttonText: 'Shop Now', tag: 'Winter Value', image: '/src/assets/price_mid.png', cat: 'upto100' },
        { id: 6, title: 'Under £30', buttonText: 'Shop Now', tag: 'Gifting Ideas', image: '/src/assets/price_low.png', cat: 'under30' }
    ],
    sofa: {
        title: 'Handmade Sofas',
        subtitle: 'Comfort & Style',
        image: '/src/assets/sofa_banner.png',
        buttonText: 'View Collection'
    },
    bestsellers: {
        mainTitle: 'Vansutracrafts Bestsellers',
        description: 'Discover our most loved pieces, handpicked for their exceptional craftsmanship and timeless appeal.',
        leftImage: '/src/assets/gold_leaf.png',
        rightImg1: '/src/assets/prod_chair.png',
        rightImg2: '/src/assets/prod_frames.png'
    },
    featuredProducts: [
        { id: 1, title: 'Recycled Glass Dome Cake Stand', price: '£100', image: '/src/assets/prod_cake.png' },
        { id: 2, title: 'Janka Tealight Holders - Amber', price: 'Sold Out', image: '/src/assets/gold_leaf.png' },
        { id: 3, title: 'Kiko Brass Frame', price: '£22', image: '/src/assets/prod_frames.png' },
        { id: 4, title: 'Ukari Leather Dining Chair', price: '£180', image: '/src/assets/prod_chair.png' }
    ],
    products: [
        { id: 101, name: 'Ama Clay Coffee Mug', price: 28, rating: 5, reviews: 12, image: '/src/assets/prod_cake.png', isNew: true, category: 'decor' }
    ],
    whatsapp: {
        link: 'https://wa.me/919999999999',
        show: true
    },
    enquiries: [] // This will be handled by its own table, but kept for legacy sync if needed
};

// --- CONTENT ENDPOINTS ---

app.get('/api/content', async (req, res) => {
    try {
        let config = await prisma.configuration.findUnique({
            where: { id: 'site-config' }
        });

        if (!config) {
            config = await prisma.configuration.create({
                data: {
                    id: 'site-config',
                    content: defaultContent
                }
            });
        }

        res.json(config.content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

app.post('/api/content', async (req, res) => {
    try {
        const newContent = req.body;
        const config = await prisma.configuration.upsert({
            where: { id: 'site-config' },
            update: { content: newContent },
            create: { id: 'site-config', content: newContent }
        });
        res.json(config.content);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// --- ENQUIRIES ENDPOINTS ---

app.get('/api/enquiries', async (req, res) => {
    try {
        const enquiries = await prisma.enquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

app.post('/api/enquiries', async (req, res) => {
    try {
        const { businessName, email, phone, businessType, message, date } = req.body;
        const enquiry = await prisma.enquiry.create({
            data: {
                businessName,
                email,
                phone,
                businessType,
                message,
                date,
                status: 'New'
            }
        });
        res.json(enquiry);
    } catch (error) {
        console.error('Error creating enquiry:', error);
        res.status(500).json({ error: 'Failed to submit enquiry' });
    }
});

app.patch('/api/enquiries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.enquiry.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        console.error('Error updating enquiry:', error);
        res.status(500).json({ error: 'Failed to update enquiry' });
    }
});

app.delete('/api/enquiries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.enquiry.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ error: 'Failed to delete enquiry' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
