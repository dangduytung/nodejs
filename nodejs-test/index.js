const express = require('express')
const app = express()
const PORT = 8797

app.use('/', (req, res) => {
    res.json({"mess": "Hello World!"})
})

app.listen(PORT, () => {console.log("Server started on port : " + PORT)})

module.exports = app;
