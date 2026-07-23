const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    action: {
    type: String,
    required: true
},
    details: {
    type: String,
    required: true
},
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
    userId: {
    type: String
},
    ip: {
    type: String
},
    timestamp: {
    type: Date,
    default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ action: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);