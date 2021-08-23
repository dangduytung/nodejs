Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
};

Date.prototype.addMinutes = function (m) {
    this.setMinutes(this.getMinutes() + m);
    return this;
};

Number.prototype.formatMoneyVn = function () {
    return this.valueOf().toLocaleString() + " VND";
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.isEmpty = function () {
    // This doesn't work the same way as the isEmpty function used 
    // in the first example, it will return true for strings containing only whitespace
    return (this.length === 0 || !this.trim());
};

String.prototype.formatMoneyToNumber = function () {
    return this.replace(/[^0-9-,]/g, "");
};

String.prototype.replaceAll = function (search, replacement) {
    let regexp = search.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    // let regexp = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return this.replace(new RegExp(regexp, "g"), replacement);
};