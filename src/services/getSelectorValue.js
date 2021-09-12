const axios = require('axios');
const cheerio = require('cheerio');

exports.getSelectorValue = async function getSelectorValue(resourceUrl, cssSelector) {
    const resourceHTML = (await axios.get(resourceUrl))?.data;

    const $ = cheerio.load(resourceHTML);

    return $(cssSelector)?.text();
};
