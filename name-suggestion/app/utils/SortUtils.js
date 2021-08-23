var _this = this;
var ALPHABETS = ["A", "Á", "À", "Ả", "Ạ", "Ă", "Ắ", "Ằ", "Ẳ", "Ặ", "Â", "Ấ", "Ầ", "Ẩ", "Ậ", "B", "C", "D", "Đ", "E", "É", "È", "Ẻ", "Ẹ", "Ê", "Ế", "Ề", "Ể", "Ệ", "F", "G", "H", "I", "Í", "Ì", "Ỉ", "Ị", "J", "K", "L", "M", "N", "O", "Ơ", "Ớ", "Ờ", "Ở", "Ợ", "Ô", "Ố", "Ồ", "Ổ", "Ộ", "P", "Q", "R", "S", "T", "U", "Ú", "Ù", "Ủ", "Ụ", "Ư", "Ứ", "Ừ", "Ử", "Ự", "V", "W", "X", "Y", "Z"];

exports.charCompare = function (a, b, index) {
    if (index == a.length) return -1;
    if (index == b.length) return 1;
    //toUpperCase: isn't case sensitive
    var aChar = ALPHABETS.indexOf(a.toUpperCase().charAt(index));
    var bChar = ALPHABETS.indexOf(b.toUpperCase().charAt(index));
    if (aChar != bChar) return aChar - bChar;
    else return _this.charCompare(a, b, index + 1);
}

exports.sortUnicode = function (arr) {
    arr.sort(function (a, b) {
        return _this.charCompare(a, b, 0);
    });
    return arr;
}

exports.sortArray = function (array) {
    return array.sort(function (a, b) {
        var nameA = a.toLowerCase(),
            nameB = b.toLowerCase();
        if (nameA < nameB)
            //sort string ascending
            return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
    });
}