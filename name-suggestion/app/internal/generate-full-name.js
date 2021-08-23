/**
 * Generate full name and save as file
 */
"use strict";
const log = require("winston-log-lite")(module);
require("../config/Prototypes");
const config = require("../config/config");
const FileUtils = require("../utils/FileUtils");

/*****************************************************/

var first_names = [];
var mid_names = [];
var last_names = [];

start();

/*****************************************************/

function start() {
  /** Validate input first name, last name */
  let argvLength = process.argv.length;
  if (argvLength == 2) {
    log.warn('You must input firtname.');
    return;
  } else if (argvLength == 3) {
    log.warn('You must input lastname.');
    return;
  }

  let firtName = process.argv[2];
  let lastName = process.argv[3];

  /** Read full name in file */
  loadDataFromFiles();

  /** Map with current data */
  let fullNames = getAllNamesByFirstAndLast(firtName, lastName);

  /** Write log */
  printName(fullNames);

  /** Write data to file */
  FileUtils.writeFileArray(config.DATA_URL + config.FILE_NAME_TEMP, fullNames);
}

function loadDataFromFiles() {
  config.NAME_FIELDS.map(function (field) {
    let file = config.DATA_URL + config.FOLDER_NAME_FINAL + "/" + field + "-name.txt";
    let data = FileUtils.readFileDataArray(file);
    switch (field) {
      case config.NAME_FIELDS[0]:
        first_names = data;
        break;
      case config.NAME_FIELDS[1]:
        mid_names = data;
        break;
      case config.NAME_FIELDS[2]:
        last_names = data;
        break;
      default:
        break;
    }
  });
}

function getAllNames() {
  let full_names = [];
  first_names.map(function (first) {
    mid_names.map(function (mid) {
      last_names.map(function (last) {
        let full_name = first + " " + mid + " " + last;
        full_names.push(full_name);
      });
    });
  });
  return full_names;
}

function getAllNamesByFirst(nameFirst) {
  if (!nameFirst || first_names.indexOf(nameFirst.trim().toLowerCase()) == -1) {
    log.warn(`Not found full name with họ ${nameFirst}`);
    return [];
  }
  let full_names = [];
  first_names.map(function (first) {
    if (nameFirst.trim().toLowerCase() == first.toLowerCase()) {
      mid_names.map(function (mid) {
        last_names.map(function (last) {
          if (
            nameFirst.trim().toLowerCase() == last.toLowerCase() &&
            mid != last
          ) {
            let full_name =
              first.capitalize() +
              " " +
              mid.capitalize() +
              " " +
              last.capitalize();
            full_names.push(full_name);
          }
        });
      });
    }
  });
  return full_names;
}

function getAllNamesByLast(nameLast) {
  if (!nameLast || last_names.indexOf(nameLast.trim().toLowerCase()) == -1) {
    log.warn(`Not found full name with tên ${nameLast}`);
    return [];
  }
  let full_names = [];
  first_names.map(function (first) {
    mid_names.map(function (mid) {
      last_names.map(function (last) {
        if (nameLast.trim().toLowerCase() == last.toLowerCase() && mid != last) {
          let full_name =
            first.capitalize() +
            " " +
            mid.capitalize() +
            " " +
            last.capitalize();
          full_names.push(full_name);
        }
      });
    });
  });
  return full_names;
}

function getAllNamesByFirstAndLast(nameFirst, nameLast) {
  if (
    !nameFirst ||
    !nameLast ||
    first_names.indexOf(nameFirst.trim().toLowerCase()) == -1 ||
    last_names.indexOf(nameLast.trim().toLowerCase()) == -1
  ) {
    log.warn(`Not found full name with họ : ${nameFirst} tên : ${nameLast}`);
    return [];
  }
  let full_names = [];
  first_names.map(function (first) {
    if (nameFirst.trim().toLowerCase() == first.toLowerCase()) {
      mid_names.map(function (mid) {
        last_names.map(function (last) {
          if (
            nameLast.trim().toLowerCase() == last.toLowerCase() &&
            mid != last
          ) {
            let full_name =
              first.capitalize() +
              " " +
              mid.capitalize() +
              " " +
              last.capitalize();
            full_names.push(full_name);
          }
        });
      });
    }
  });
  return full_names;
}

function printName(data) {
  data.map(function (name, i) {
    log.info(`${i + 1} - ${name}`);
  });
}