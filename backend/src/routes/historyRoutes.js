const express = require('express');
const router = express.Router();
const { getHistory, deleteHistory, exportHistory } = require('../controllers/historyController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getHistory);
router.get('/export', protect, admin, exportHistory);
router.delete('/:id', protect, admin, deleteHistory);

module.exports = router;