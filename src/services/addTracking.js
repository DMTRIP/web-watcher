const axios = require('axios');
const cheerio = require('cheerio');
const TrackingModel = require('../tracking.model');

async function getSelectorValue(resourceUrl, cssSelector) {
    const resourceHTML = (await axios.get(resourceUrl))?.data;

    const $ = cheerio.load(resourceHTML);

    return $(cssSelector)?.text();
};

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

exports.getSelectorValue = getSelectorValue;
