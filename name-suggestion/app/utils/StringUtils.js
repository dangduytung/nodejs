module.exports = {

    isEmpty: function (str) {
        return !str || 0 === str.length;
    },

    isBlank: function (str) {
        return (!str || /^\s*$/.test(str));
    },

    /* Similar String.prototype.padStart */
    padZero: function (num, size) {
        num = num.toString();
        while (num.length < size)
            num = "0" + num;
        return num;
    },

    /* Character to ascii */
    hashCode: function (s) {
        return s.split("").reduce(function (a, b) {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);
    },

    /* Validate email */
    validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    /* Define function to find and replace specified term with replacement string */
    replaceAll: function (str, term, replacement) {
        // Option 1
        let regexp = term.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        // let regexp = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return str.replace(new RegExp(regexp, "g"), replacement);

        // Option 2
        // let exp = new RegExp(term, "g");
        // return str.replace(exp, replacement);
    },

    /* Unsign vietnamese string */
    unsignString: function (str) {
        if (str != undefined && str != null && str != "") {
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(
                /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
                " "
            );
            /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
            str = str.replace(/-+-/g, ""); //thay thế 2- thành 1-
            str = str.replace(/^\-+|\-+$/g, "");
            str = str.replace("-", " ");
            //cắt bỏ ký tự - ở đầu và cuối chuỗi
        }
        return str;
    },

    unsignMaxString: function (str) {
        if (str) {
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace("-", " ");
        }
        return str;
    },
}