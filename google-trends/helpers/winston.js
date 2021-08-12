"use strict";

const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");
const { info } = require("console");

const env = process.env.NODE_ENV || "development";
const logDir = "logs";

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logAllDailyTransport = new transports.DailyRotateFile({
  filename: `${logDir}/log-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
});

const logErrorTransport = new transports.File({
  level: "error",
  // filename: path.join(__dirname, `../${logDir}/errors.log`),
  filename: `${logDir}/errors.log`
});

var getLabel = function (callingModule) {
  var parts = callingModule.filename.split("\\");
  return parts[parts.length - 2] + "/" + parts.pop();
};

const logger = function (callingModule) {
  return createLogger({
    // change level if in dev environment versus production
    level: env === "production" ? "info" : "debug",
    format: format.combine(
      format.label({
        // label: path.basename(require.main.filename),
        label: getLabel(callingModule),
      }),
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS",
      }),
      format.printf(
        (info) =>
          `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
      )
    ),
    transports: [
      new transports.Console({
        level: "debug",
        format: format.combine(
          format.colorize(),
          format.printf(
            (info) =>
              `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
          )
        ),
      }),

      logAllDailyTransport,
      logErrorTransport,
    ],
  });
};

module.exports = logger;
