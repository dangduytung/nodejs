"use strict";

const MongoClient = require('mongodb').MongoClient;

const log = require("winston-log-lite")(module);
const MongoConfig = require("./MongoConfig");

class MongoDb {
    constructor() {
        this.isConnected = false;
        log.info("MongoDb costructed");
    }

    async init() {
        return this.initialize(MongoConfig.MONGO_URL, MongoConfig.MONGO_DB);
    }

    async initialize(uri, database) {
        // log.info(`initialize uri: ${uri}`);
        log.info(`initialize database: ${database}`);
        this.uri = uri;
        this.client = await MongoClient.connect(this.uri, {
            // useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.db = this.client.db(database);

        this.trends_daily = this.db.collection('trends-daily');
        this.trends_daily_final = this.db.collection('trends-daily-final');
        this.trends_daily_notify = this.db.collection('trends-daily-notify');

        this.isConnected = true;

        log.info(`initialize connected to database: ${database}`);
    }

    getURI() {
        return this.uri;
    }

    /**
     * ===== trends-daily =====
     */
    async trends_daily$findOne(param) {
        return this.trends_daily.findOne(param, function (err, res) {
            if (err) throw err;
            log.info('findOne `trends_daily` result _id: ' + res._id);
        });
    }

    async trends_daily$find(param) {
        return this.trends_daily.find(param).toArray(function (err, res) {
            if (err) throw err;
            log.info('find `trends_daily` result length: ' + res.length);
        });
    }

    trends_daily$insertOne(param) {
        return this.trends_daily.insertOne(param, function (err, res) {
            if (err) throw err;
            log.info("insertOne `trends_daily` 1 document inserted");
        });
    }

    /**
     * ===== trends-daily-final =====
     */
    async trends_daily_final$findOne(param) {
        return this.trends_daily_final.findOne(param, function (err, res) {
            if (err) throw err;
            log.info('findOne `trends_daily_final` result _id: ' + res._id);
        });
    }

    async trends_daily_final$find(param, limit, sort) {
        if (limit == undefined || sort == undefined) {
            return this.trends_daily_final.find(param).toArray(function (err, res) {
                if (err) throw err;
                log.info('find `trends_daily_final` result length: ' + res.length);
                return res;
            });
        }
        return this.trends_daily_final.find(param).limit(limit).sort(sort).toArray(function (err, res) {
            if (err) throw err;
            log.info('find `trends_daily_final` result length: ' + res.length);
        });
    }

    trends_daily_final$insertMany(param) {
        return this.trends_daily_final.insertMany(param, function (err, res) {
            if (err) throw err;
            log.info("insertMany `trends_daily_final` " + res.insertedCount + " documents inserted");
        });
    }

    /**
     * ===== trends-daily-notify =====
     */
    async trends_daily_notify$findOne(param) {
        return this.trends_daily_notify.findOne(param, function (err, res) {
            if (err) throw err;
            log.info('findOne `trends_daily_notify` result _id: ' + res._id);
        });
    }

    trends_daily_notify$insertOne(param) {
        return this.trends_daily_notify.insertOne(param, function (err, res) {
            if (err) throw err;
            log.info("insertOne `trends_daily_notify` 1 document inserted");
        });
    }
}

module.exports = new MongoDb();