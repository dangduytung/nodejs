
// Import modules
const start = require('./start')
const sendMessage = require('./send-message')
const Reminder = require('./reminder')

// const message = {chat : {id : 1}, text : "aaa"}
// start(message);

let reminder = new Reminder('abc');
reminder.setDate('2020/01/02');

let str = "{\"name\":\"abc\",\"date\":\"2020/01/02\"}";
let re = Object.setPrototypeOf(JSON.parse(str), Reminder.prototype);

// start({chat : {id : 1}, text : JSON.stringify(reminder)})

console.log(re.getDate())