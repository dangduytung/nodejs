const fs = require("fs");
const puppeteer = require("puppeteer");
const log = require("winston-log-lite")(module);
const DateUtils = require("../utils/DateUtils");

const MongoDb = require("../db/MongoDb");

function getOS() {
    const osPlatform = process.platform;

    if (osPlatform === 'win32') {
        return 'Windows';
    } else if (osPlatform === 'linux') {
        return 'Linux';
    } else {
        return 'Unknown';
    }
}

async function start(dateCrawl) {
    log.info(`Start crawl google trends daily dateCrawl : ${dateCrawl}`);

    const environment = getOS();
    console.log('Environment:', environment);

    if (environment === 'Unknown') return;

    const launchOptions = {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    if (environment === 'Linux') {
        launchOptions.executablePath = '/usr/bin/google-chrome';
    }

    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // Configure the navigation timeout
    page.setDefaultNavigationTimeout(60000);

    await page.goto(
        "https://trends.google.com/trends/trendingsearches/daily?geo=VN"
    );

    // await page.exposeFunction("crawlData", crawlData);

    /** Crawl */
    async function $crawl() {

        log.info(`Crawl data date : ${dateCrawl}`);

        return await page.evaluate(async (dateCrawl) => {

            var addPrefixTime = function (param) {
                return param < 10 ? "0" + param : param;
            };

            var parseDateToDDMMYYYY = function (date) {
                let dd = addPrefixTime(date.getDate());
                let mm = addPrefixTime(date.getMonth() + 1);
                let yyyy = date.getFullYear();

                return dd + "/" + mm + "/" + yyyy;
            };

            var crawlData = async function (ele_feedList) {
                let obj;

                [...ele_feedList].forEach((element, index, array) => {
                    let dateStr = element.firstElementChild.firstElementChild.textContent;

                    if (dateCrawl == parseDateToDDMMYYYY(new Date(dateStr))) {
                        let ele_articles = element.getElementsByClassName("md-list-block");

                        let articles = [];

                        for (let i = 0; i < ele_articles.length; i++) {
                            let ele_DetailWrapper = ele_articles[i].getElementsByClassName(
                                "details-wrapper"
                            )[0];
                            let indexPost = ele_DetailWrapper
                                .getElementsByClassName("index")[0]
                                .textContent.trim();

                            let postTitle = ele_DetailWrapper
                                .getElementsByClassName("details-top")[0]
                                .getElementsByTagName("a")[0]
                                .textContent.trim();

                            let ele_DetailPost = ele_DetailWrapper
                                .getElementsByClassName("details-bottom")[0]
                                .getElementsByTagName("a")[0];

                            let postDesc = ele_DetailPost.textContent.trim();

                            let postUrl = ele_DetailPost.getAttribute("href");

                            let searchCount = ele_DetailWrapper
                                .getElementsByClassName("search-count-title")[0]
                                .textContent.trim();

                            articles.push({
                                index: indexPost,
                                postTitle: postTitle,
                                postDesc: postDesc,
                                postUrl: postUrl,
                                searchCount: searchCount,
                            });
                        }

                        obj = {};
                        obj.dateStr = dateStr;
                        obj.date = parseDateToDDMMYYYY(new Date(dateStr));
                        obj.dateTime = +new Date();
                        obj.articles = articles;

                        return obj;
                    }
                });

                return obj;
            };

            var dataListRaw = document.getElementsByClassName("feed-list-wrapper");

            var data = await crawlData(dataListRaw);

            return data;
        }, dateCrawl);
    }

    // Button load more
    let selectorForLoadMoreButton = '.feed-load-more-button';

    /** Check if invalid data, so load more data by click button */
    var dataObj;
    var count = 0;
    while (true && count++ < 10) {
        dataObj = await $crawl();
        if (dataObj != null) break;

        await page.click(selectorForLoadMoreButton).catch(() => {});
        await page.waitForSelector(selectorForLoadMoreButton, {
            visible: true,
            timeout: 8000
        })
    }

    log.info(`data : ${JSON.stringify(dataObj)}`);

    /** Save data */
    if (dataObj != null) {
        log.info(
            `Complete crawl google trends daily, data length : ${dataObj.articles.length}`
        );

        dataObj.created = new Date();

        let dataStr = JSON.stringify(dataObj);
        // log.info(dataStr);

        let file =
            "./data/trends-daily/google-trends-daily-" +
            DateUtils.parseDateToSaveFile(new Date()) +
            ".json";
        log.info(`file : ${file}`);

        /** Save file */
        fs.writeFile(file, dataStr, (err) => {
            if (err) throw err;
            log.info(`Write file ${file} successfully`);
        });

        /** Save DB */
        MongoDb.trends_daily$insertOne(dataObj);
    }

    await browser.close();

    return dataObj;
}

module.exports.start = start;