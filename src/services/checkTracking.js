const axios = require('axios');
const cheerio = require('cheerio');
const TrackingModel = require('../tracking.model');
const { getSelectorValue } = require('./addTracking');
const { notifyUser } = require('./notifyUser');

exports.checkTracking = async function checkTracking(trackingId) {
 const tracking = await TrackingModel.findById(trackingId).lean();
 const { resourceUrl, cssSelector, currentValue, title } = tracking;

 const newCurrentValue = await getSelectorValue(resourceUrl, cssSelector);

    if (newCurrentValue !== currentValue) {

     // update current and previous values
     const updatedTracking = await TrackingModel.findOneAndUpdate({ _id: trackingId }, {
         currentValue: newCurrentValue,
         previousValue: currentValue,
         lastCheckedAt: Date.now(),
     }, { new: true }).lean();

     // notify user
     await notifyUser(updatedTracking);
    } else {
        await TrackingModel.updateOne({ _id: trackingId }, { lastCheckedAt: Date.now() });
    }
};
