const log = require("winston-log-lite")(module);
const DateUtils = require("../utils/DateUtils");

const MongoDb = require("../db/MongoDb");

async function filterRawData(dayOffset) {
    log.info(`Process raw data dayOffset : ${dayOffset}`);

    if (dayOffset >= 0) return;
    
    var arr = [];

    for (let i = dayOffset; i < 0; i++) {
        /** Get old date string */
        let oldDate = DateUtils.addDate(new Date(), i);
        let ddmmyyyy = DateUtils.parseDateToDDMMYYYY(oldDate);
        // log.info(`ddmmyyyy : ${ddmmyyyy}`)

        /** Find final data */
        let finalData = await MongoDb.trends_daily_final$find({date : ddmmyyyy});
        // log.info(`finalData : ${finalData}`);
        if (finalData.length > 0) continue;

        /** Find raw data */
        let rawData = await MongoDb.trends_daily$find({date : ddmmyyyy});
        // log.info(`rawData : ${rawData}`);
        if (rawData.length > 0) arr.push(rawData[0]);
    }

    if (arr.length == 0) return log.warn(`No data trends daily insert to collection final`);

    log.info(`Have ${arr.length} trends daily will be inserted to final collection`);
    
    MongoDb.trends_daily_final$insertMany(arr);
}

module.exports.filterRawData = filterRawData;