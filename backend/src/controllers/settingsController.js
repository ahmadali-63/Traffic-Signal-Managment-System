const SignalSettings = require('../models/SignalSettings');
const signalService = require('../services/signalService');
const { validationResult } = require('express-validator');

// @desc    Get signal settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
try {
    const settings = await SignalSettings.getDefaultSettings();
    res.status(200).json(settings);
} catch (error) {
    res.status(500).json({ message: error.message });
    }
};

// @desc    Update signal settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { redDuration, yellowDuration, greenDuration } = req.body;
    
    const settings = await signalService.updateSettings({
        redDuration,
        yellowDuration,
        greenDuration
    });
    
    res.status(200).json(settings);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

module.exports = { getSettings, updateSettings };