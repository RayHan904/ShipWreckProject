const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShipWreckSchema = new Schema({
  //write model here
});

module.exports = ShipWreck = mongoose.model("shipwreck", ShipWreckSchema);
