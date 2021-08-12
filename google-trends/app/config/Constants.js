class Constants {
    static get DB_CONSTANTS() {
        return {
            LIMIT: 10,
        };
    }

    static get CRON_TIME() {
        return {
            CRAWL: '0 45 9 * * *',
            FILTER: '0 50 9 * * *',
            NOTIFY: '0 0 9-18 * * *'
        }
    }

    static get TimeZone_Vietnamese() {
        return "Asia/Ho_Chi_Minh";
    }
}

Object.freeze(Constants);
module.exports = Constants;