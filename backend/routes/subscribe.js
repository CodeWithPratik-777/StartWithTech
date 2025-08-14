const express = require('express');
const crypto = require('crypto');
const Subscriber = require('../models/Subscriber');
const sendVerifyEmail = require('../utils/sendSubscribeVerifyEmail');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    try {
        const existing = await Subscriber.findOne({ email });

        if (existing && existing.verified) {
            return res.status(400).json({ message: 'Verification email sent, if not already verified.' });
        }

        if (existing && existing.verifyTokenExpires > new Date()) {
            return res.status(400).json({ message: 'If this email is eligible, a verification link has been sent.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 15 * 60 * 1000); 

        if (existing) {
            existing.verifyToken = token;
            existing.verifyTokenExpires = expiry;
            await existing.save();
        } else {
            await Subscriber.create({
                email,
                verifyToken: token,
                verifyTokenExpires: expiry,
            });
        }

        await sendVerifyEmail({ email, token, baseUrl: process.env.BACKEND_URL });

        return res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (err) {
        console.error('Subscription error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get('/verify', async (req, res) => {
    const { token, email } = req.query;
    if (!token || !email) {
        return res.redirect(`${process.env.FRONTEND_URL}/?msg=invalid`);
    }

    try {
        const subscriber = await Subscriber.findOne({ email, verifyToken: token });

        if (!subscriber || subscriber.verifyTokenExpires < new Date()) {
            return res.redirect(`${process.env.FRONTEND_URL}/?msg=expired`);
        }

        subscriber.verified = true;
        subscriber.verifyToken = undefined;
        subscriber.verifyTokenExpires = undefined;
        await subscriber.save();

        return res.redirect(`${process.env.FRONTEND_URL}/?msg=verified`);
    } catch (err) {
        console.error('Verification error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/?msg=error`);
    }
});

module.exports = router;
