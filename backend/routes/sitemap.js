const express = require('express');
const router = express.Router();
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const Post = require('../models/Post');

router.get('/sitemap.xml', async (req, res) => {
    try {
        const hostname = process.env.SITE_URL || process.env.FRONTEND_URL;

        const staticLinks = [
            { url: '/', changefreq: 'daily', priority: 1.0 },
            { url: '/blog', changefreq: 'weekly', priority: 0.8 },
            { url: '/about', changefreq: 'monthly', priority: 0.6 },
            { url: '/contact', changefreq: 'monthly', priority: 0.5 },
            { url: '/terms', changefreq: 'yearly', priority: 0.3 },
            { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
            { url: '/disclaimer', changefreq: 'yearly', priority: 0.3 },
        ];

        const posts = await Post.find({}, 'slug updatedAt').lean();
        const postLinks = posts.map((post) => ({
            url: `/news/${post.slug}`,
            lastmodISO: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
            changefreq: 'weekly',
            priority: 0.8,
        }));

        const allLinks = [...staticLinks, ...postLinks];

        const stream = new SitemapStream({ hostname });

        res.header('Content-Type', 'application/xml');
        const xml = await streamToPromise(Readable.from(allLinks).pipe(stream));
        res.send(xml.toString());
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).end();
    }
});

module.exports = router;
