/** Cron job for crawl automatically daily */
const fs = require("fs");
const CronJob = require("cron").CronJob;

const MongoDb = require("./db/MongoDb");

const Constants = require("./config/Constants");
const DateUtils = require("./utils/DateUtils");
const Utils = require("./utils/Utils");
const TrendsDailyCrawlService = require("./service/TrendsDailyCrawlService");
const TrendsDailyFilterRawService = require("./service/TrendsDailyFilterRawService");
const TrendsDailyTelegramService = require("./service/TrendsDailyTelegramService");
const TrendsDailyFindService = require("./service/TrendsDailyFindService");

const log = require("winston-log-lite")(module);

const DAY_OFFSET = -4;
const FOLDER_DATA_TRENDS_DAILY = './data/trends-daily/';

var dataToday;
var urlNotifiedArr = [];

function initialize() {
    validateDir(FOLDER_DATA_TRENDS_DAILY);
}

async function initDb() {
    await MongoDb.init();
}

function validateDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
}


var jobCrawl = new CronJob(
    Constants.CRON_TIME.CRAWL,
    async function () {
            await crawl();
        },
        null,
        true,
        Constants.TimeZone_Vietnamese
);

var jobFilter = new CronJob(
    Constants.CRON_TIME.FILTER,
    async function () {
            await filter();
        },
        null,
        true,
        Constants.TimeZone_Vietnamese
);

var jobNotify = new CronJob(
    Constants.CRON_TIME.NOTIFY,
    async function () {
            /** NOTIFY DATA YESTERDAY */
            // await notifyTelegramDataYesterday();

            /** NOTIFY DATA TODAY */
            await notifyTelegramDataToday();
        },
        null,
        true,
        Constants.TimeZone_Vietnamese
);

async function start() {
    log.info(`start(), start ${new Date()}`);
    
    initialize();
    
    await initDb();
    
    log.info(`start(), start many jobs`);

    jobCrawl.start();
    jobFilter.start();
    jobNotify.start();

    log.info(`start(), end ${new Date()}`);
}

start();

/** =========*** FUNCTION CRAWL ***=========== */

async function crawl() {
    log.info(`crawl ~ start ${new Date()}`);

    /** Check date has not crawled */
    var dateTemp = new Date();
    var arr = [];
    for (let i = -1; i >= DAY_OFFSET; i--) {
        dateTemp = DateUtils.addDate(dateTemp, -1);
        let date = DateUtils.parseDateToDDMMYYYY(dateTemp);
        // log.info(`date : ${date}`);

        let obj = await TrendsDailyFindService.findByDate(date);
        // log.info(`obj : ${JSON.stringify(obj)}`);

        /** If date has not crawled, add to array */
        if (obj == null || i == -1) arr.push(date);
    }

    log.info(`crawl ~ Array date will be crawled : ${arr}`);
    if (arr.length == 0) return;

    // Crawl data
    arr.map(async (item) => {
        return await TrendsDailyCrawlService.start(item);
    });
}

/** =========*** FUNCTION FILTER ***=========== */

async function filter() {
    log.info(`filter ~ filter raw ${new Date()}`);
    await TrendsDailyFilterRawService.filterRawData(DAY_OFFSET);
}

/** ========= FUNCTION NOTIFY TELEGRAM WITH DATA YESTERDAY AND SAVE RAW, FINAL DATA =========== */

async function notifyTelegramDataYesterday() {
    log.info(`notifyTelegramDataYesterday ~ start ${new Date()}`);

    let cronTime = Utils.cronTimeRnd();

    log.info(`notifyTelegramDataYesterday ~ cronTime : ${cronTime}`);

    var cronJob = new CronJob(
        cronTime,
        async function () {
                try {
                    await TrendsDailyTelegramService.notifyDataYesterday();
                } catch (error) {
                    log.error(`notifyTelegramDataYesterday ~ ${error}`);
                } finally {
                    cronJob.stop();
                }
            },
            null,
            true,
            Constants.TimeZone_Vietnamese
    );

    cronJob.start();
}

/** ========= FUNCTION NOTIFY TELEGRAM CRAWL DATA TODAY AND SAVE RAW DATA (NOT SAVE FINAL DATA) =========== */

async function notifyTelegramDataToday() {
    log.info(`notifyTelegramDataToday ~ ${new Date()} start, data: ${JSON.stringify(dataToday)}`);

    let currentDateStr = DateUtils.parseDateToDDMMYYYY(new Date());

    // Check if new day, clear array cache url has notified
    if (dataToday != null && dataToday.date != currentDateStr) {
        log.info(`notifyTelegramDataToday ~ start clear cache url notified because new day currentDateStr : ${currentDateStr}, dataToday.date : ${dataToday.date}`);
        urlNotifiedArr = [];
        dataToday = null;
    }

    if (dataToday == null || dataToday.articles == null || dataToday.articles.length == 0) {
        dataToday = await TrendsDailyCrawlService.start(currentDateStr);
    }

    if (dataToday == null || dataToday.articles == null || dataToday.articles.length == 0) {
        log.warn(`notifyTelegramDataToday ~ cannot crawl data of today`);
        return;
    }

    log.info(`notifyTelegramDataToday ~ ${dataToday.date} data : ${JSON.stringify(dataToday)}`);

    // Generate cron in current hour
    let cronTime = Utils.cronTimeRnd();

    log.info(`notifyTelegramDataToday ~ cronTime : ${cronTime}`);

    // Get random article in array
    let indexRnd;
    let article;

    let tmp;
    do {
        if (tmp > -1 && indexRnd > -1) {
            // Remove url has sent before
            dataToday.articles.splice(indexRnd, 1);
        }
        
        if (dataToday.articles.length == 0) {
            log.warn(`notifyTelegramDataToday ~ Loop is over all items`);
            return;
        }

        indexRnd = Utils.getRndInteger(0, dataToday.articles.length);
        article = dataToday.articles[indexRnd];
        tmp = urlNotifiedArr.indexOf(article.postUrl);
        
        log.info(`notifyTelegramDataToday ~ try indexRnd : ${indexRnd}, tmp : ${tmp}, url : ${article.postUrl}`);
    } while (tmp > -1)

    // Remove object of array
    dataToday.articles.splice(indexRnd, 1);
    
    log.info(`notifyTelegramDataToday ~ wait to notify url : ${article.postUrl}, has sent ${urlNotifiedArr.length} articles today`);

    var cronJob = new CronJob(
        cronTime,
        async function () {
                try {
                    // Notify
                    await TrendsDailyTelegramService.notifyData(article);

                    // Save url has notified
                    urlNotifiedArr.push(article.postUrl);

                } catch (error) {
                    log.error(`notifyTelegramDataToday ~ ${error}`);
                } finally {
                    cronJob.stop();
                }
            },
            null,
            true,
            Constants.TimeZone_Vietnamese
    );

    cronJob.start();
}

module.exports.DAY_OFFSET = DAY_OFFSET;
module.exports.initDb = initDb;
module.exports.crawl = crawl;
module.exports.filter = filter;
module.exports.notify = notifyTelegramDataToday;