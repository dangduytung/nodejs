const { GoogleSpreadsheet } = require('google-spreadsheet');


const creds = require('./triple-student-134523-13f7e9b0e642.json'); // the file saved above
// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1jS02_K0ORumZsP2KE66uFKWm0N57oYUpVhXj-RSkl7I');

// Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
// await doc.useServiceAccountAuth({
//   client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//   private_key: process.env.GOOGLE_PRIVATE_KEY,
// });

(async function() {
    await someAsyncFunction();
  }());

async function someAsyncFunction() {
    await doc.useServiceAccountAuth(creds, 'demontendote@gmail.com');

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);
    await doc.updateProperties({ title: 'renamed doc' });
    
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    console.log(sheet.title);
    console.log(sheet.rowCount);
    
}

