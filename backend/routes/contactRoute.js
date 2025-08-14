const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const sendContactEmail = require('../utils/sendContactEmail');

const SUBJECT_WORD_LIMIT = 100;
const MESSAGE_WORD_LIMIT = 1000;

router.post('/', async (req, res) => {
  const { name, email, subject = '', message = '' } = req.body;

  if (!email || !name || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const subjectWordCount = subject.trim().split(/\s+/).length;
  const messageWordCount = message.trim().split(/\s+/).length;

  if (subjectWordCount > SUBJECT_WORD_LIMIT) {
    return res.status(400).json({ message: `Subject should not exceed ${SUBJECT_WORD_LIMIT} words.` });
  }

  if (messageWordCount > MESSAGE_WORD_LIMIT) {
    return res.status(400).json({ message: `Message should not exceed ${MESSAGE_WORD_LIMIT} words.` });
  }

  try {
    const existing = await Contact.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: 'We’ve already received your message. Please try again later.' });
    }

    await Contact.create({ email });

    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ message: 'Thanks! We’ll get back to you soon.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
