const signalService = require('../services/signalService');

// @desc    Get current signal state
// @route   GET /api/signal/state
// @access  Public
const getState = async (req, res) => {
try {
    const state = signalService.getCurrentState();
    res.status(200).json(state);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// @desc    Start signal
// @route   POST /api/signal/start
// @access  Private/Admin
const startSignal = async (req, res) => {
try {
    await signalService.startSignal();
    res.status(200).json({ message: 'Signal started successfully' });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// @desc    Pause signal
// @route   POST /api/signal/pause
// @access  Private/Admin
const pauseSignal = async (req, res) => {
try {
    await signalService.pauseSignal();
    res.status(200).json({ message: 'Signal paused successfully' });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// @desc    Resume signal
// @route   POST /api/signal/resume
// @access  Private/Admin
const resumeSignal = async (req, res) => {
try {
    await signalService.resumeSignal();
    res.status(200).json({ message: 'Signal resumed successfully' });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// @desc    Stop signal
// @route   POST /api/signal/stop
// @access  Private/Admin
const stopSignal = async (req, res) => {
try {
    await signalService.stopSignal();
    res.status(200).json({ message: 'Signal stopped successfully' });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// @desc    Reset signal
// @route   POST /api/signal/reset
// @access  Private/Admin
const resetSignal = async (req, res) => {
try {
    await signalService.resetSignal();
    res.status(200).json({ message: 'Signal reset successfully' });
} catch (error) {
    res.status(500).json({ message: error.message });
    }
};

// @desc    Switch mode
// @route   POST /api/signal/mode
// @access  Private/Admin
const switchMode = async (req, res) => {
try {
    const { mode } = req.body;
    if (!mode || !['auto', 'manual'].includes(mode)) {
        return res.status(400).json({ message: 'Invalid mode. Must be auto or manual' });
    }
    
    await signalService.switchMode(mode);
    res.status(200).json({ message: `Mode switched to ${mode}` });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getState,
    startSignal,
    pauseSignal,
    resumeSignal,
    stopSignal,
    resetSignal,
    switchMode
};