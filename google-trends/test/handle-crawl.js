/** Crawl by run : node src/handle-crawl.js */

const Main = require('../app/main');

async function main() {
    await Main.initDb();
    await Main.crawl();
}

main();