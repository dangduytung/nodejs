/** Create Api for front end */

require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const log = require('../helpers/winston')(module);

const TrendsDailyFindService = require("./service/TrendsDailyFindService");

const port = 3001;

// Configurations
app.use(bodyParser.json());

app.get("/google-trends-daily", async (req, res) => {
    let data = await TrendsDailyFindService.findAll();
    if (data == null) {
        res.end(`No data`);
        return;
    }
    log.info(`length : ${data.length}`);
    res.send(data);
});

// Listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});