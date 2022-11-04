"use strict";
const requestSync = require("sync-request");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const log = require("winston-log-lite")(module);
const config = require("../config/config");
const FileUtils = require("../utils/FileUtils");
const DateUtils = require("../utils/DateUtils");
const TimeUtils = require("../utils/TimeUtils");
const SortUtils = require("../utils/SortUtils");

/*****************************************************/

const TIME_SlEEP_MILISECONDS = 2000;

// Validate folder ./data/xemtencon
var FOLDER_OUT = config.DATA_URL + config.FOLDER_XEMTENCON;
FileUtils.validateDir(FOLDER_OUT);

var RESULTS = ['tốt', 'tạm', 'xấu'];

start();

/*****************************************************/

function start() {
  var names = FileUtils.readFileDataArray(config.DATA_URL + config.FILE_NAME_TEMP);
  if (names.length == 0) {
    log.warn(`start(), no name found !!!`);
    return;
  }

  /* Sync */
  // crawlSync(names);

  /* Async */
  crawlAsync(names);
}

function crawlSync(names) {
  let nameFile = names[0].split(" ");
  nameFile = nameFile[0] + "--" + nameFile[2];
  log.info(nameFile);

  let outputFile = FOLDER_OUT + "/" + config.FOLDER_XEMTENCON + "-score-" + nameFile + "-" + DateUtils.parseDateToYYYYMMDD(new Date()) + ".txt";

  if (fs.existsSync(outputFile)) {
    fs.truncateSync(outputFile);
    log.info(`truncate file ${outputFile} done`);
  }

  names.map(function (name) {
    crawlOneSync(name);
  });

  log.info("crawlSync done");
}

function crawlOneSync(name) {
  let res = requestSync("GET", config.WEB_SCRAPE_URL_XEMTENCON + encodeURI(name));
  let body = res.getBody();
  var $ = cheerio.load(body);

  let total = $(
    "div#content > div.page-inner > div.score > div > div.total"
  ).text();

  let textOut = name + "\t\t" + total;
  log.info(textOut);

  fs.appendFileSync(outputFile, textOut + "\n");
}

async function crawlAsync(names) {
  let nameFile = names[0].split(" ");
  nameFile = nameFile[0] + "--" + nameFile[2];
  log.info(nameFile);

  let outputFile = FOLDER_OUT + "/" + config.FOLDER_XEMTENCON + "-score-" + nameFile + "-" + DateUtils.parseDateToYYYYMMDD(new Date()) + ".txt";

  if (fs.existsSync(outputFile)) {
    fs.truncate(outputFile, 0, function () {
      log.info(`truncate file ${outputFile} done`);
    });
  }

  var arr = [];
  var dataSave = '';
  var promises = [];

  // Crawl each name
  for (let i = 0; i < names.length; i++) {
    promises.push(crawlOneAsync(arr, names[i], i));
    await TimeUtils.sleep(TIME_SlEEP_MILISECONDS);
  }

  // Wait crawl all finished
  await Promise.all(promises);

  // Sort result priority in order total ('tốt', 'tạm', 'xấu') -> mid-name (first-name and last-name is same)
  arr.sort(function (a, b) {
    // Sort in same total
    if (a.total == b.total) {
      let arrA = a.name.split(" ");
      let arrB = b.name.split(" ");
      // Sort mid-name (full-name have 3 words)
      if (arrA.length == 3 && arrB.length == 3) {
        return SortUtils.charCompare(arrA[1], arrB[1], 0);
      }
      return SortUtils.charCompare(a.name, b.name, 0);
    }

    if (a.total == RESULTS[0]) return -1;
    if (a.total == RESULTS[1] && b.total == RESULTS[0]) return 1;
    if (a.total == RESULTS[1] && b.total == RESULTS[2]) return -1;
    if (a.total == RESULTS[2]) return 1;
  })

  arr.map(function (item) {
    log.info(item.index + " - " + item.name + "\t\t" + item.total);
    dataSave += item.name + "\t\t" + item.total + '\n';
  });
  dataSave = dataSave.substr(0, dataSave.length - 1);

  FileUtils.writeFileAsync(outputFile, dataSave);
  log.info("crawlAsync done");
}

function crawlOneAsync(arrOut, name, index) {
  return new Promise(function (resolve, reject) {
    request(config.WEB_SCRAPE_URL_XEMTENCON + encodeURI(name), function (error, response, body) {
      if (error) reject(error);
      if (response.statusCode != 200) {
        log.warn("Invalid status code <" + response.statusCode + ">");
        // return;
      }
      var $ = cheerio.load(body);

      let total = $(
        "div#content > div.page-inner > div.score > div > div.total"
      ).text();
      arrOut.push({
        index: index,
        name: name,
        total: total
      });
      resolve(body);
    });
  });
}