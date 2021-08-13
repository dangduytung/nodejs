const log = require('winston-log-lite')(module);
const Constants = require("../config/Constants");

const MongoDb = require("../db/MongoDb");

async function findAll() {
    log.info('findAll newest');
    return await MongoDb.trends_daily_final$find({}, Constants.DB_CONSTANTS.LIMIT, {dateTime : -1});
}

async function findByDate(date) {
    log.info(`findByDate date : ${date}`);
    return await MongoDb.trends_daily_final$find({date : date});
}

module.exports.findAll = findAll;
module.exports.findByDate = findByDate;