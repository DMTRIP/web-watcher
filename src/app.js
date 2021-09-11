const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

const { addTracking } = require('./services/addTracking');
const { checkSystemHealth } = require('./services/checkSystemHealth');
const { getTrackings } = require('./services/getTrackings');
require('./job');
dotenv.config();

(async () => {
    await mongoose.connect(process.env.MONGO_DB_URI);

    const app = express();

    app.use(bodyParser.json());

    app.get('/health-check', async (req, res) => {
        try {
            const ok = await checkSystemHealth();

            if (ok) {
                res.status(200).send({ ok: true, message: 'ok' })
            } else {
                res.status(200).send({ ok: false, message: 'not ok' })
            }
        } catch (e) {
            res.status(400).send(e);
        }
    });

    app.post('/tracking', async (req, res) => {
        try {
            const { resourceUrl, title, cssSelector, checkingIntervalInSeconds } = req.body;

            if (!resourceUrl || !title || !cssSelector) {
                return res.status(400).send({ errorMessage: 'All or some required fields are missing (resourceUrl|title|cssSelector)' });
            }

            const tracking = await addTracking({
                resourceUrl,
                title,
                cssSelector,
                checkingIntervalInSeconds,
            });

            res.status(200).send({ tracking });
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    });

    app.get('/trackings', async (req, res) => {
       try {
           const trackings = await getTrackings();
           res.status(200).send({ trackings });
       }  catch (e) {
           res.status(400).send(e);
       }
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../test.html'));
    });

    app.listen(8080, () => {
        console.log('App is running on port 8080');
    });
})();
