const express = require('express');
const router = express.Router();
const { getDashboardAnalytics, getStatistics } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboardAnalytics);
router.get('/statistics', protect, admin, getStatistics);

module.exports = router;