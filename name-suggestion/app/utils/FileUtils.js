const fs = require('fs');
const log = require("winston-log-lite")(module);

module.exports = {
    isExistFile: function (file) {
        try {
            return fs.existsSync(file);
        } catch (error) {
            log.error('isExistFile error: ' + error)
            return false;
        }
    },

    /**
     * Create directory of path if not exists
     * @param {string} dir 
     */
    validateDir: function (dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
    },

    /**
     * Read file data array in multiple lines
     * @param {*} file 
     * @returns 
     */
    readFileDataArray: function (file) {
        log.debug("readFileDataArray : " + file);
        if (!fs.existsSync(file)) {
            log.warn(`readFileDataArray file : ${file} not found`);
            return null;
        }
        let data = fs.readFileSync(file, "utf8");
        if (data.length == 0) return [];
        let dataFilter = [];
        // log.debug("readFileDataArray data : " + data);
        data = data.split(/\r\r|\n/);
        data.map(function (item) {
            dataFilter.push(item.trim());
        });
        return dataFilter;
    },

    //For open file few times
    writeFileSync: function (file, data) {
        log.debug("writeFileSync : " + file);
        fs.writeFileSync(file, data, function (err) {
            if (err) log.error(err);
            log.info(`writeFileSync write file : ${file} successfully`);
        });
    },

    writeFileAsync: function (file, data) {
        log.debug("writeFileAsync : " + file);
        fs.writeFile(file, data, function (err) {
            if (err) log.error(err);
            log.info(`writeFileAsync write file : ${file} successfully`);
        });
    },

    /**
     * https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node
     * For open file many times and continuously
     * use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
     * @param {string} file file file
     * @param {string} data is string
     */
    writeFileStream: function (file, data) {
        try {
            var stream = fs.createWriteStream(file, {
                flags: 'a'
            });
            stream.write(data);
            stream.end();
        } catch (error) {
            log.error('writeFileStream error: ' + error);
        }
    },

    /**
     * Write each item of array is new line
     * @param {*} file 
     * @param {*} datas 
     */
    writeFileArray: function (file, datas) {
        log.debug("writeFileArray : " + file);
        fs.writeFile(file, datas.join("\n"), err => {
            if (err) log.info(err);
            log.info(`Successfully write file : ${file}`);
        });
    },

    appendFileSync: function (file, data) {
        fs.appendFileSync(file, data, function (err) {
            if (err) log.error(err);
        });
    },

    appendFileAsync: function (file, data) {
        fs.appendFile(file, data, function (err) {
            if (err) log.error(err);
        });
    },
}