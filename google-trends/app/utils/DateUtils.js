var addPrefixTime = function (param) {
    return param < 10 ? "0" + param : param;
};

var addDate = function (date, addDay) {
    date.setDate(date.getDate() + addDay);
    return date;
};

var parseDateToDDMMYYYY = function (date) {
    let dd = addPrefixTime(date.getDate());
    let mm = addPrefixTime(date.getMonth() + 1);
    let yyyy = date.getFullYear();

    return dd + "/" + mm + "/" + yyyy;
};

var isSameDate = function (date1, date2) {
    return parseDateToDDMMYYYY(date1) == parseDateToDDMMYYYY(date2);
};

var parseDateToSaveFile = function (date) {
    let dd = addPrefixTime(date.getDate());
    let mm = addPrefixTime(date.getMonth() + 1);
    let yyyy = date.getFullYear();
    var hh = addPrefixTime(date.getHours());
    var ms = addPrefixTime(date.getMinutes());
    var ss = addPrefixTime(date.getSeconds());
    return yyyy + "-" + mm + "-" + dd + "_" + hh + "-" + ms + "-" + ss;
};


module.exports.addDate = addDate;
module.exports.parseDateToDDMMYYYY = parseDateToDDMMYYYY;
module.exports.isSameDate = isSameDate;
module.exports.parseDateToSaveFile = parseDateToSaveFile;