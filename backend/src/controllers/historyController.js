const SignalHistory = require('../models/SignalHistory');
const ActivityLog = require('../models/ActivityLog');
const { createObjectCsvStringifier } = require('csv-writer');

// @desc    Get history with pagination and filters
// @route   GET /api/history
// @access  Private/Admin
const getHistory = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const mode = req.query.mode;

    // Build filter
    const filter = {};
    if (startDate && endDate) {
        filter.completedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
    };
    }
    if (mode) {
    filter.mode = mode;
    }

    const [history, total] = await Promise.all([
    SignalHistory.find(filter)
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit),
    SignalHistory.countDocuments(filter)
    ]);

    res.status(200).json({
        history,
        pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    }
    });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// @desc    Delete history
// @route   DELETE /api/history/:id
// @access  Private/Admin
const deleteHistory = async (req, res) => {
try {
    const history = await SignalHistory.findById(req.params.id);
    if (!history) {
        return res.status(404).json({ message: 'History record not found' });
    }

    await history.deleteOne();
    
    // Log activity
    const log = new ActivityLog({
        action: 'HISTORY_DELETE',
        details: `Deleted history record ${req.params.id}`,
        timestamp: new Date()
    });
    await log.save();

    res.status(200).json({ message: 'History record deleted successfully' });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// @desc    Export history as CSV
// @route   GET /api/history/export
// @access  Private/Admin
const exportHistory = async (req, res) => {
try {
    const history = await SignalHistory.find().sort({ completedAt: -1 });

    const csvStringifier = createObjectCsvStringifier({
    header: [
        { id: 'cycleNumber', title: 'Cycle Number' },
        { id: 'redDuration', title: 'Red Duration (s)' },
        { id: 'yellowDuration', title: 'Yellow Duration (s)' },
        { id: 'greenDuration', title: 'Green Duration (s)' },
        { id: 'totalCycleDuration', title: 'Total Duration (s)' },
        { id: 'mode', title: 'Mode' },
        { id: 'startedAt', title: 'Started At' },
        { id: 'completedAt', title: 'Completed At' }
    ]
    });

    const records = history.map(record => ({
        ...record.toObject(),
        startedAt: record.startedAt.toLocaleString(),
        completedAt: record.completedAt.toLocaleString()
    }));

    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=signal_history.csv');
    res.status(200).send(csv);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

module.exports = { getHistory, deleteHistory, exportHistory };