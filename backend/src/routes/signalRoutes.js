const express = require('express');
const router = express.Router();
const {
    getState,
    startSignal,
    pauseSignal,
    resumeSignal,
    stopSignal,
    resetSignal,
    switchMode
} = require('../controllers/signalController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/state', getState);

// Protected admin routes
router.post('/start', protect, admin, startSignal);
router.post('/pause', protect, admin, pauseSignal);
router.post('/resume', protect, admin, resumeSignal);
router.post('/stop', protect, admin, stopSignal);
router.post('/reset', protect, admin, resetSignal);
router.post('/mode', protect, admin, switchMode);

module.exports = router;