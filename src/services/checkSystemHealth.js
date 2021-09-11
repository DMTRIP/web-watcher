const TrackingModel = require('../tracking.model');

/**
 * @description - returns true if everything is ok
 */
exports.checkSystemHealth = async function checkSystemHealth() {
    const twoDaysBefore = new Date();
    twoDaysBefore.setDate(twoDaysBefore.getDate() -2);

    const trackingRecord = await TrackingModel.findOne({
        $or: [
            { lastCheckedAt: { $exists: false } },
            { lastCheckedAt: { $lt: twoDaysBefore.toISOString() } },
        ]
    }).lean();

    return !trackingRecord;
};
