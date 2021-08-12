const Main = require('../app/main');
const MongoDb = require('../app/db/MongoDb')

async function main() {
    await Main.initDb();
    // await Main.crawl();
    let obj = {a: 1};
    MongoDb.trends_daily$find(obj);
}

main();