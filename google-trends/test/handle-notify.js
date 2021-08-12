/** Notify by run : node src/handle-notify.js */

const Main = require('../app/main');

async function main() {
    await Main.initDb();
    await Main.notify();
}

main();