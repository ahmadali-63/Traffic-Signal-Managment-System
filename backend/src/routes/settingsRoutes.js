const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/auth');

const updateValidation = [
    body('redDuration').isInt({ min: 1, max: 60 }).withMessage('Red duration must be between 1 and 60 seconds'),
    body('yellowDuration').isInt({ min: 1, max: 10 }).withMessage('Yellow duration must be between 1 and 10 seconds'),
    body('greenDuration').isInt({ min: 1, max: 120 }).withMessage('Green duration must be between 1 and 120 seconds')
];

router.get('/', protect, admin, getSettings);
router.put('/', protect, admin, updateValidation, updateSettings);

module.exports = router;