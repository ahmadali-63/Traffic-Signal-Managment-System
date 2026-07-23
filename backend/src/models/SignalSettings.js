const mongoose = require('mongoose');

const signalSettingsSchema = new mongoose.Schema({
    redDuration: {
    type: Number,
    required: true,
    min: 1,
    max: 60,
    default: 5
},
    yellowDuration: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 5
},
    greenDuration: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
    default: 20
},
    mode: {
    type: String,
    enum: ['auto', 'manual'],
    default: 'auto'
},
    status: {
    type: String,
    enum: ['running', 'paused', 'stopped'],
    default: 'stopped'
},
    currentLight: {
    type: String,
    enum: ['red', 'yellow', 'green'],
    default: 'red'
},
    remainingTime: {
    type: Number,
    default: 0
},
    totalCycles: {
    type: Number,
    default: 0
},
    lastUpdated: {
    type: Date,
    default: Date.now
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
signalSettingsSchema.statics.getDefaultSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
    settings = await this.create({});
}
    return settings;
};

module.exports = mongoose.model('SignalSettings', signalSettingsSchema);