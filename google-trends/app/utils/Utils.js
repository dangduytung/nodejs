function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function isRealValue(obj) {
    return obj && obj !== "null" && obj !== "undefined";
}

function isEmpty(value) {
    return value == null || value.trim().length === 0;
}

function isEmptyArray(value) {
    return value == null || value.length === 0;
}

function isEmptyJson(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function cronTimeRnd() {
    let d = new Date();
    let second = getRndInteger(0, 59);
    let minute = getRndInteger(d.getMinutes() + 1, 59);
    let hour = d.getHours();
    let cronTime = second + " " + minute + " " + hour + " * * *";
    return cronTime;
}

module.exports.getRndInteger = getRndInteger;
module.exports.isRealValue = isRealValue;
module.exports.isEmpty = isEmpty;
module.exports.isEmptyArray = isEmptyArray;
module.exports.isEmptyJson = isEmptyJson;
module.exports.cronTimeRnd = cronTimeRnd;