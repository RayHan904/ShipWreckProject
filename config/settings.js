require("dotenv").config();

module.exports = {
  mongoDBUrl:
    "mongodb+srv://" + process.env.USER + ":" + process.env.PASSWORD + "@cluster0.qwj82f0.mongodb.net/sample_geospatial?retryWrites=true&w=majority",
  secret: "verySecretCode",
};
