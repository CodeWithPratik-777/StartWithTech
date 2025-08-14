const express = require('express');
const router = express.Router();
const { getLegalPage, updateLegalPage } = require('../controllers/legalController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/:type', getLegalPage);
router.post('/:type', verifyToken, updateLegalPage);

module.exports = router;
