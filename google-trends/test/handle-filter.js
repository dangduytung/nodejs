/** Filter by run : node src/handle-filter.js */

const Main = require('../app/main');

async function main() {
    await Main.initDb();
    await Main.filter();
}

main();