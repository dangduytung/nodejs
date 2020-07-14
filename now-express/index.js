const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

const port = 3000;

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add router in the Express app.
app.use("/", router);

// Listen on port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}
  Visit http://localhost:${port}`);
});

/** MOCK API */
router.get("/", (req, res) => {
  res.send("Welcome to a basic express App");
});

// get
router.get("/users", (req, res) => {
  res.json([
    { name: "William", location: "Abu Dhabi" },
    { name: "Chris", location: "Vegas" },
  ]);
});

// post
router.post("/user", (req, res) => {
  const { name, location } = req.body;
  res.send({ status: "User created", name, location });
});

/** LOGIN SAMPLE */

router.get("/index.html", (req, res) => {
  res.sendfile("index.html");
});

router.post("/login", function (req, res) {
  var user_name = req.body.user;
  var password = req.body.password;
  console.log("User name = " + user_name + ", password is " + password);
  res.end("yes");
});
