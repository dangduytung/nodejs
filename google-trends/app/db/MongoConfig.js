var MongoConfig = {
    MONGO_URL : process.env.MONGO_URL,
    MONGO_DB : process.env.MONGO_DB
}

/**
 * Dev
 */
// var MongoConfig = {
//     MONGO_URL : "mongodb://localhost:27017/",
//     MONGO_DB : 'DTest'
// }

module.exports = MongoConfig;