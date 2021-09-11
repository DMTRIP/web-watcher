const cron = require('node-cron');
const TrackingModel  = require('./tracking.model');
const { checkTracking } = require('./services/checkTracking');

cron.schedule(process.env.CORN_SHCEDULE, async () => {
    try {
        console.log(`running every ${process.env.CORN_SHCEDULE}`);

        const trackingArray = await TrackingModel.find({ isWatching: true });

        await trackingArray.map(async tracking => {
            return checkTracking(tracking._id);
        })
    } catch (e) {
        console.log(e);
    }
}, {});
