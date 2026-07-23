    const SignalHistory = require('../models/SignalHistory');
    const SignalSettings = require('../models/SignalSettings');
    const ActivityLog = require('../models/ActivityLog');
    const User = require('../models/User');

    // @desc    Get dashboard analytics
    // @route   GET /api/analytics/dashboard
    // @access  Private/Admin
    const getDashboardAnalytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
        totalCycles,
        todayCycles,
        avgCycleTime,
        totalUsers,
        recentActivity,
        settings
        ] = await Promise.all([
        SignalHistory.countDocuments(),
        SignalHistory.countDocuments({
            completedAt: { $gte: today }
        }),
        SignalHistory.aggregate([
            { $group: {
            _id: null,
            avgTime: { $avg: '$totalCycleDuration' }
            }}
        ]),
        User.countDocuments(),
        ActivityLog.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .populate('user', 'username'),
        SignalSettings.getDefaultSettings()
        ]);

        res.status(200).json({
        totalCycles,
        todayCycles,
        avgCycleTime: avgCycleTime[0]?.avgTime || 0,
        totalUsers,
        recentActivity,
        currentStatus: {
            mode: settings.mode,
            status: settings.status,
            currentLight: settings.currentLight
        }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

    // @desc    Get cycle statistics
    // @route   GET /api/analytics/statistics
    // @access  Private/Admin
    const getStatistics = async (req, res) => {
    try {
        const stats = await SignalHistory.aggregate([
        {
            $group: {
            _id: null,
            totalCycles: { $sum: 1 },
            avgRedDuration: { $avg: '$redDuration' },
            avgYellowDuration: { $avg: '$yellowDuration' },
            avgGreenDuration: { $avg: '$greenDuration' },
            avgTotalDuration: { $avg: '$totalCycleDuration' },
            minTotalDuration: { $min: '$totalCycleDuration' },
            maxTotalDuration: { $max: '$totalCycleDuration' }
            }
        }
        ]);

        res.status(200).json(stats[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

    module.exports = { getDashboardAnalytics, getStatistics };