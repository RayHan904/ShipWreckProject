const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
var path = require("path");
require("dotenv").config();

const port = process.env.PORT;

const app = express();

// middleware for bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
  }),
);
app.set("view engine", ".hbs");

// get settings
const settings = require("./config/settings");

// mongo db url
const db = settings.mongoDBUrl;

// attempt to connect with DB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.log(err));

// Get profile routes
const route = require("./routes/api/shipWreck");

app.get("/", (req, res) => {
  res.send("Project is Running");
});

// actual routes
// app.use("/api/auth", auth);
app.use("/api/shipwreck", route);

app.listen(port, () => console.log(`App running at port : ${port}`));
