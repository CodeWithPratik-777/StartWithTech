const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const contactRoute = require('./routes/contactRoute');
const legalRoutes = require('./routes/legalRoutes');
const subscribeRoutes = require('./routes/subscribe');
const postRoutes = require('./routes/postRoutes');
const sitemapRoute = require('./routes/sitemap');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const _dirname = path.dirname("");
const buildpath = path.join(_dirname, '../frontend/build');
app.use(express.static(buildpath));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
}));

app.use('/', sitemapRoute);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoute);
app.use('/api/legal', legalRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
