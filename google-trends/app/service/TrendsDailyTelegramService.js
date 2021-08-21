// require('dotenv').config()
const log = require('winston-log-lite')(module);
const Utils = require('../utils/Utils');
const DateUtils = require("../utils/DateUtils");
const TelegramSendMessage = require("../telegram/TelegramSendMessage");

const MongoDb = require("../db/MongoDb");

async function sendMessage(message) {
    const chatId = process.env.TELEGRAM_CHAT_ID

    log.info(`sendMessage chatId: ${chatId}`);

    if (chatId == undefined) return false;

    log.info(`sendMessage message : ${message}`);

    await TelegramSendMessage({
        chat_id: chatId,
        parse_mode: "html",
        text: message
    })

    return true;
}

/**
 * If notify data crawled of yesterday, will be save on DB
 */
async function notifyDataYesterday() {
    log.info(`notifyDataYesterday start`);

    let yesterday = DateUtils.addDate(new Date(), -1);
    let yesterdayStr = DateUtils.parseDateToDDMMYYYY(yesterday);

    log.info(`notifyDataYesterday find data day ${yesterdayStr}`);

    /** Find newest (yesterday) record */
    let trendsDailyLatest = await MongoDb.trends_daily_final$find({date : yesterdayStr}, 1, {_id : -1});

    // log.info(`trendsDailyLatest : ${JSON.stringify(trendsDailyLatest)}`);

    /** Check data */
    if (trendsDailyLatest.length == 0) {
        log.warn(`No trends found to notify`);
        return;
    }
    if (trendsDailyLatest[0].articles.length == 0) {
        log.warn(`No article found to notify`);
        return;
    }

    /** Get random article */
    let indexRandom = Utils.getRndInteger(0, trendsDailyLatest[0].articles.length - 1);
    log.info(`indexRandom article : ${indexRandom}`);

    let objTrendsDaily = trendsDailyLatest[0];
    let objArticle = objTrendsDaily.articles[indexRandom];
    
    if (Utils.isEmpty(objArticle.postUrl)) {
        log.warn(`No url of article found to notify`);
        return;
    }

    /** Check article has sent before */
    let _id_sent = new require('mongodb').ObjectID(objTrendsDaily._id);
    let objSent = {_id_sent : _id_sent, url : objArticle.postUrl};

    let artilceSent = await MongoDb.trends_daily_notify$findOne(objSent);

    if (Utils.isRealValue(artilceSent)) {
        log.warn(`Article has sent before : ${artilceSent.url}`);
        return;
    }

    /** Create message to send */
    let message = "<b>" + objArticle.postTitle + "</b>"
        // + "\n" + objArticle.postDesc
        + "\n" + objArticle.postUrl + " (" + objArticle.searchCount + ")";

    /** Send notify */
    let isSent = await sendMessage(message);

    if (!isSent) {
        log.warn(`Send message telegram error`)
        return;
    }

    /** Save notify has just sent */
    let objNotify = {_id_sent : trendsDailyLatest[0]._id, url : objArticle.postUrl, date : objTrendsDaily.date, created : new Date()};
    log.info(`objNotify : ${JSON.stringify(objNotify)}`);

    MongoDb.trends_daily_notify$insertOne(objNotify);
}

/**
 * If notify data crawled of current day, will be not save on DB.
 * Because we need wait 1 day to updated index searchCount from Google Trends
 */
async function notifyData(article) {
    log.info(`notifyData article : ${JSON.stringify(article)}`);

    /** Create message to send */
    let message = "<b>" + article.postTitle + "</b>"
        + "\n" + article.postDesc
        + "\n" + article.postUrl + " (" + article.searchCount + ")";

    /** Send notify */
    return await sendMessage(message);
}

module.exports.sendMessage = sendMessage
module.exports.notifyDataYesterday = notifyDataYesterday
module.exports.notifyData = notifyData