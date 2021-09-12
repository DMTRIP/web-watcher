const { Commands } = require('./commands');
const axios = require('axios');

module.exports = {
    getKeyboard() {
        return [Commands.addTracking, Commands.listTrackings, Commands.healthCheck].map(command => `/${command}`);
    },

    async listAllTrackings() {
        const response = await axios.get('trackings');

        if (response?.data?.trackings) {
            return response.data.trackings.map(tracking => {
                return formTrackingHTML(tracking);
            })
        }

        function formTrackingHTML(tracking) {
            const { title, resourceUrl, cssSelector, initialSelectorValue, currentValue, isWatching, lastCheckedAt } = tracking;

            return `
===============
<pre>Title: ${title}</pre>
<pre>Resource: ${resourceUrl}</pre>
<pre>LastCheckedAt: ${lastCheckedAt}</pre>
<pre>CssSelector: ${cssSelector}</pre>
<pre>InitialSelectorValue: ${initialSelectorValue}</pre>
<pre>CurrentValue: ${currentValue}</pre>
<pre>IsWatching: ${isWatching}</pre>
===============
        `
        }
    }
};
