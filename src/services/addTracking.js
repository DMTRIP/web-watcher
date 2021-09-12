const TrackingModel = require('../tracking.model');
const { getSelectorValue } = require('./getSelectorValue');

/**
 * @param {{
 *    resourceUrl: string
 *    title: string
 *    cssSelector: string
 *    checkingIntervalInSeconds?: Number
 * }} data
 */
exports.addTracking = async function addTracking(data) {
    const { resourceUrl, title, cssSelector, checkingIntervalInSeconds } = data;

    const initialSelectorValue = await getSelectorValue(resourceUrl, cssSelector);

    return await TrackingModel.create({
        title,
        resourceUrl,
        cssSelector,
        checkingIntervalInSeconds,
        initialSelectorValue,
        currentValue: initialSelectorValue,
    })
};
