const TrackingModel = require('../tracking.model');

exports.getTrackings = function getTrackings() {
    return TrackingModel.find();
};
