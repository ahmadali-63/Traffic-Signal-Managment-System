const mongoose = require('mongoose');

const signalHistorySchema = new mongoose.Schema({
    redDuration: {
    type: Number,
    required: true
},
    yellowDuration: {
    type: Number,
    required: true
},
    greenDuration: {
    type: Number,
    required: true
    },
    totalCycleDuration: {
    type: Number,
    required: true
},
    cycleNumber: {
    type: Number,
    required: true
},
    startedAt: {
    type: Date,
    required: true
},
    completedAt: {
    type: Date,
    required: true
},
    mode: {
    type: String,
    enum: ['auto', 'manual'],
    required: true
}
}, {
    timestamps: true
});

// Index for faster queries
signalHistorySchema.index({ completedAt: -1 });
signalHistorySchema.index({ cycleNumber: -1 });

module.exports = mongoose.model('SignalHistory', signalHistorySchema);