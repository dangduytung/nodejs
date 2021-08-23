module.exports = {
    addByType: function (type, date, num) {
        switch (type) {
            case "y":
                date.setFullYear(date.getFullYear() + num);
                break;
            case "m":
                date.setMonth(date.getMonth() + num);
                break;
            case "d":
                date.setDate(date.getDate() + num);
                break;
            default:
                break;
        }
        return date;
    },

    addYear: function (date, num) {
        return addByType('y', date, num);
    },

    addMonth: function (date, num) {
        return addByType('m', date, num);
    },

    addDate: function (date, num) {
        return addByType('d', date, num);
    },


    parseDateToString: function (date) {
        return date.toString("HH:mm dddd, dd/MM");
    },

    parseDateToYYYYMMDD: function (date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();

        return yyyy + mm + dd;
    },

    parseDateToDDMMYYYY: function (date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();

        return dd + "/" + mm + "/" + yyyy;
    },

    parseDateToDDMMYYYYHHmm: function (date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();
        let hh = String(date.getHours()).padStart(2, '0');
        let mi = String(date.getMinutes()).padStart(2, '0');

        return dd + "/" + mm + "/" + yyyy + " " + hh + ":" + mi;
    },

    parseDateToDDMMYYYYHHmmssAmPm: function (date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();
        let hh = String(date.getHours()).padStart(2, '0');
        let mi = String(date.getMinutes()).padStart(2, '0');
        let s = String(date.getSeconds()).padStart(2, '0');
        var ampm = hh >= 12 ? "PM" : "AM";
        hh = hh % 12;
        hh = hh ? hh : 12; // the hour '0' should be '12'

        return dd + "/" + mm + "/" + yyyy + " " + hh + ":" + mi + ":" + s + " " + ampm;
    },

    parseIso8601ToDateStr: function (str) {
        let date = new Date(str);
        return parseDateToDDMMYYYY(date);
    },

    parseIso8601ToDateStrHHmm: function (str) {
        let date = new Date(str);
        return parseDateToDDMMYYYYHHmm(date);
    },

    /* Compare date string dd/mm/yyyy */
    compareDateDDMMYYYY: function (str1, str2) {
        let pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        let array1 = str1.match(pattern);
        let array2 = str2.match(pattern);
        let date1 = new Date(array1[3], array1[2] - 1, array1[1]);
        let date2 = new Date(array2[3], array2[2] - 1, array2[1]);
        return date1 >= date2;
    },

    /* Validate str dd/mm/yyyy,dd-mm-yyyy or dd.mm.yyyy */
    validateDateString: function (dateString) {
        let reg = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
        return reg.test(dateString);
    },

    /* Parse string "yyyy-MM-dd HH:mm:ss" to date */
    strToDateSeconds: function (str) {
        let regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
            [, year, month, day, hours, minutes, seconds] = regex.exec(str);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    },

    /* Parse string "yyyy-MM-dd HH:mm:ss.SSS" to date */
    strToDateMiliseconds: function (str) {
        let regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).(\d{1})/,
            [, year, month, day, hours, minutes, seconds, miliseconds] = regex.exec(str);
        return new Date(year, month - 1, day, hours, minutes, seconds, miliseconds);
    },

    //Asia/Ho_Chi_Minh
    changeTimezone: function (date, ianatz) {
        // suppose the date is 12:00 UTC
        var invdate = new Date(
            date.toLocaleString("en-US", {
                timeZone: ianatz,
            })
        );

        // then invdate will be 07:00 in Toronto
        // and the diff is 5 hours
        var diff = date.getTime() - invdate.getTime();

        // so 12:00 in Toronto is 17:00 UTC
        return new Date(date.getTime() + diff);
    },
}