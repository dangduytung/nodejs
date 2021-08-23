module.exports = {
    getRndInteger: function (min, max) {
        if (min > max) {
            let tmp = min;
            min = max;
            max = tmp;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
        /* return ~~(Math.random() * (max - min + 1)) + min; */
    },

    formatMoneyUSD: function (number) {
        return number.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        }); //vn-VI, VND
    },

    formatMoneyVND: function (number) {
        return number.toLocaleString("vn-VI", {
            style: "currency",
            currency: "VND",
        }); //vn-VI, VND
    },

    isNumeric: function (str) {
        return /^\d+$/.test(str);
    },
}