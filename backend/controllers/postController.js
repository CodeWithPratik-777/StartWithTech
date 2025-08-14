const Post = require('../models/Post');
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category');

const createPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      category,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      if (req.file) {
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete uploaded image:', err);
        });
      }

      return res.status(400).json({ message: 'A post with the same slug already exists. Please choose a different title.' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    let categoryDoc = await Category.findOne({ name: category.trim() });
    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: category.trim() });
    }

    const newPost = new Post({
      author: req.user.id,
      title,
      slug,
      content,
      category: categoryDoc._id,
      metaTitle,
      metaDescription,
      metaKeywords,
      imageUrl,
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Create Post Error:', err);
    res.status(500).json({ message: 'Failed to create post. Please try again later.' });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const counts = await Post.aggregate([
      { $match: { category: { $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    const enriched = categories.map(cat => ({
      ...cat.toObject(),
      postCount: countMap[cat._id.toString()] || 0
    }));

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('category', 'name')
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error('Fetch Posts Error:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('category', 'name')
      .populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching post by slug:', err);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      content,
      category,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existingPost = await Post.findOne({ slug, _id: { $ne: id } });
    if (existingPost) {
      if (req.file) {
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete uploaded image:', err);
        });
      }

      return res.status(400).json({
        message: 'A post with the same slug already exists. Please choose a different title.',
      });
    }

    const oldCategoryId = post.category?.toString();

    if (req.file) {
      if (post.imageUrl) {
        const oldPath = path.join(__dirname, '..', post.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      post.imageUrl = `/uploads/${req.file.filename}`;
    }

    post.title = title;
    post.slug = slug;
    post.content = content;

    let categoryId = category;

    if (typeof category === 'string' && !category.match(/^[0-9a-fA-F]{24}$/)) {
      let existing = await Category.findOne({ name: category });

      if (!existing) {
        existing = await Category.create({ name: category });
      }

      categoryId = existing._id;
    }

    if (categoryId && oldCategoryId !== String(categoryId)) {
      post.category = categoryId;
    }

    post.metaTitle = metaTitle;
    post.metaDescription = metaDescription;
    post.metaKeywords = metaKeywords;

    await post.save();

    if (oldCategoryId && oldCategoryId !== String(categoryId)) {
      const postsInOldCategory = await Post.find({ category: oldCategoryId });
      if (postsInOldCategory.length === 0) {
        await Category.findByIdAndDelete(oldCategoryId);
      }
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.imageUrl) {
      const imgPath = path.join(__dirname, '..', post.imageUrl.replace(/^\/+/, ''));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    const categoryId = post.category;
    await Post.findByIdAndDelete(id);

    if (categoryId) {
      const remaining = await Post.find({ category: categoryId });
      if (remaining.length === 0) {
        await Category.findByIdAndDelete(categoryId);
      }
    }

    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const renameCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const existing = await Category.findOne({ name });
    if (existing && existing._id.toString() !== id) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error while renaming category' });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error while adding category' });
  }
};

const search = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const exactMatch = await Post.findOne({ title: { $regex: `^${query}$`, $options: 'i' } })
      .populate('category')
      .populate('author');

    if (exactMatch) {
      return res.json([exactMatch]); 
    }

    const regex = new RegExp(query, 'i');
    const results = await Post.find({
      $or: [
        { title: regex },
        { slug: regex }
      ]
    }).populate('category').populate('author').limit(20);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createPost, getCategory, getAllPosts, getPostBySlug, updatePost, deletePost, renameCategory, addCategory, search };
