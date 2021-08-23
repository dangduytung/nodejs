'use strict'
const log = require("winston-log-lite")(module);
const define = require("../config/define");

function searchByYear(year) {
    let objYear = define.year.find(x => x.year === year);
    if (!objYear) {
        log.warn("Not found year : " + year);
    }
    let names = define.menhTen.find(x => x.id === objYear.menhId);

    log.info(" " + names.name);
}

//searchByYear(2019);