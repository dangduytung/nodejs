/**
 * Filter raw data fields (first, mid, last) from folder `name-raw` to folder `name-final`
 */
"use strict";
const log = require("winston-log-lite")(module);
const config = require("../config/config");
const FileUtils = require("../utils/FileUtils");
const StringUtils = require("../utils/StringUtils");
const SortUtils = require("../utils/SortUtils");

/*****************************************************/

process();

/*****************************************************/

function processFile(file) {
  /** Exit if not exist */
  if (!FileUtils.isExistFile(file)) return;

  /** Read data file */
  let data = FileUtils.readFileDataArray(file);

  /** Filter empty string name */
  data = processRaw(data);

  /** Sort Vietnamese Alphabet */
  data = SortUtils.sortUnicode(data);
  return data;
}

function processRaw(data) {
  let result = [];
  data.map(function (name) {
    if (!StringUtils.isEmpty(name)) {
      if (result.indexOf(name.trim()) == -1) {
        result.push(name.trim().toLowerCase());
      }
    }
  });
  return result;
}

function mergeName(arrData, arrDataRaw) {
  if (!arrData || !arrDataRaw) return arrData;
  arrDataRaw.map(function (name) {
    if (arrData.indexOf(name) == -1) {
      arrData.push(name);
    }
  });
  arrData = SortUtils.sortUnicode(arrData);
  // log.debug('mergeName arrData : ' + arrData);
  return arrData;
}

function process() {
  let folderDataRaw = config.DATA_URL + config.FOLDER_NAME_RAW;
  let folderDataFinal = config.DATA_URL + config.FOLDER_NAME_FINAL;
  FileUtils.validateDir(folderDataRaw);
  FileUtils.validateDir(folderDataFinal);

  config.NAME_FIELDS.map(function (field) {
    log.info(`process(), field ${field}`);
    let fileRaw = folderDataRaw + "/" + field + "-name.txt";
    let fileFinal = folderDataFinal + "/" + field + "-name.txt";

    let data_nameRaws = processFile(fileRaw);
    log.info(`Data raw after read : ${data_nameRaws}`);

    let data_nameFinals = processFile(fileFinal);
    log.info(`Data final after read : ${data_nameFinals}`);

    if (data_nameFinals) {
      data_nameFinals = mergeName(data_nameFinals, data_nameRaws);
    } else {
      data_nameFinals = data_nameRaws;
    }
    log.info(`Data after merge : ${data_nameFinals}`);

    /* Save final file */
    if (data_nameFinals) {
      FileUtils.writeFileArray(fileFinal, data_nameFinals);
    }
  });
}