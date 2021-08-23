"use strict";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const log = require("winston-log-lite")(module);
const config = require("../config/config");
const FileUtils = require("../utils/FileUtils");
const NumberUtils = require("../utils/NumberUtils");
const StringUtils = require("../utils/StringUtils");
const DateUtils = require("../utils/DateUtils");
const TimeUtils = require("../utils/TimeUtils");
const SortUtils = require("../utils/SortUtils");

/*****************************************************/

// Validate folder ./data/tenchocon
var FOLDER_OUT = config.DATA_URL + config.FOLDER_TENCHOCON;
FileUtils.validateDir(FOLDER_OUT);

start();

/*****************************************************/

function start() {
  // Read names from file
  var names = FileUtils.readFileDataArray(config.DATA_URL + config.FILE_NAME_TEMP);
  if (names.length == 0) {
    log.warn(`start(), no name found !!!`);
    return;
  }

  // Crawl names
  crawlAsync(names);
}

async function crawlAsync(names) {
  let nameFile = names[0].split(" ");
  nameFile = nameFile[0] + "--" + nameFile[2];
  log.info(nameFile);

  let outputFile = FOLDER_OUT + "/" + config.FOLDER_TENCHOCON + "-score-" + nameFile + "-" + DateUtils.parseDateToYYYYMMDD(new Date()) + ".txt";

  if (fs.existsSync(outputFile)) {
    fs.truncate(outputFile, 0, function () {
      log.info(`truncate file ${outputFile} done`);
    });
  }

  var arr = [];
  var dataSave = "";
  var promises = [];

  // Crawl each name
  for (let i = 0; i < names.length; i++) {
    promises.push(crawlOneAsync(arr, names[i], i));
    await TimeUtils.sleep(300);
  }

  // Wait crawl all finished
  await Promise.all(promises);

  // Sort result priority in order score -> mid-name (first-name and last-name is same)
  arr.sort(function (a, b) {
    // Sort in same score
    if (a.score == b.score) {
      let arrA = a.name.split(" ");
      let arrB = b.name.split(" ");
      // Sort mid-name (full-name have 3 words)
      if (arrA.length == 3 && arrB.length == 3) {
        return SortUtils.charCompare(arrA[1], arrB[1], 0);
      }
      return SortUtils.charCompare(a.name, b.name, 0);
    }

    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    }
  })

  // Process raw result data: array to string
  arr.map(function (item) {
    log.info(item.index + "\t" + item.name + "\t" + item.score + "\t" + item.scoreText);
    dataSave += item.name + "\t" + item.score + "\t" + item.scoreText + "\n";
  });
  dataSave = dataSave.substr(0, dataSave.length - 1);

  /** Write result to file */
  FileUtils.writeFileAsync(outputFile, dataSave);
  log.info("crawlAsync done");
}

function crawlOneAsync(arrOut, name, index) {
  return new Promise(function (resolve, reject) {
    let url = config.WEB_SCRAPE_URL_TENCHOCON + encodeURI(name).replace('%20', '-').replace('%20', '-') + ".html";
    log.info(`request url : ${url}`);
    request(url, function (error, response, body) {
      if (error) reject(error);
      if (response.statusCode != 200) {
        log.warn("Invalid status code <" + response.statusCode + "> " + response.statusMessage);
        // return;
      }
      var $ = cheerio.load(body);
      let text = $("span#lb_danhgia").text();
      // log.debug(index + ' ' + text);
      if (!StringUtils.isEmpty(text)) {
        let obj = parseTextResult(text);
        arrOut.push({
          index: index,
          name: name,
          score: obj.score,
          scoreText: obj.scoreText
        });
      }
      resolve(body);
    });
  });
}

function parseTextResult(text) {
  // log.debug('parseTextResult text : ' + text);
  text = text.split('/');
  let h = -1,
    t = -1;
  for (let i = 0; i < text[0].length; i++) {
    if (NumberUtils.isNumeric(text[0].charAt(i))) {
      if (h == -1) {
        h = i;
      }
      t = i;
    }
  }

  let name = text[0].substr(0, h).trim();
  let score = text[0].substr(h, t + 1);
  let scoreText = text[1].replace('100 điểm', '').trim();
  log.info(name + ' ' + score + ' ' + scoreText);
  return {
    name: name,
    score: score,
    scoreText: scoreText
  };
}