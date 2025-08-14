const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createPost,
  getCategory,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  renameCategory,
  addCategory,
  search
} = require('../controllers/postController');

router.post('/', authMiddleware, upload.single('image'), createPost);
router.get('/categories', getCategory);
router.post('/categories', authMiddleware, addCategory); 
router.put('/categories/:id', authMiddleware, renameCategory); 
router.get('/all-posts', getAllPosts);
router.get('/search', search);
router.get('/:slug', getPostBySlug);
router.put('/:id', authMiddleware, upload.single('image'), updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
