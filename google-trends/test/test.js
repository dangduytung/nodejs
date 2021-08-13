require('dotenv').config()

// const Main = require('../app/main');
// const MongoDb = require('../app/db/MongoDb')
const MongoDb = require('../app/db/MongoDb_bak')


async function main() {
    // await Main.initDb();
    // // await Main.crawl();
    // let obj = {a: 1};
    // MongoDb.trends_daily$find(obj);

    await MongoDb.init();

    let ddmmyyyy = '09/08/2021';
    let finalData = await MongoDb.trends_daily_final$find({date : ddmmyyyy});
    console.log('finalData:' + JSON.stringify(finalData))
}

main();