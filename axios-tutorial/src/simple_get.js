const axios = require('axios');

/** async/await */
async function makeGetRequest() {

  let res = await axios.get('http://webcode.me');

  let data = res.data;
  console.log(data);
}

makeGetRequest();

/** callbacks */

// const axios = require('axios');

// axios.get('http://webcode.me').then(resp => {

//     console.log(resp.data);
// });