const mongoose = require('mongoose');

const TrackingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    resourceUrl: { type: String, required: true },
    cssSelector: { type: String, required: true },
    initialSelectorValue: { type: String, required: true },
    currentValue: { type: String, required: true },
    previousValue: { type: String },
    isWatching: { type: Boolean, default: true },
    checkingIntervalInSeconds: { type: Number, default: 60 },
    lastCheckedAt: Date,
    createdAt: { type: Date, default: Date.now() },
    notifications: [{
        newValue: { type: String, required: true },
        previousValue: { type: String, required: true },
        createdAt: { type: Date, default: Date.now() },
    }],
});

const TrackingModel = mongoose.model('tracking', TrackingSchema, 'tracking');

module.exports = TrackingModel;
