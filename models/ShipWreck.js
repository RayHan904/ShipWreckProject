const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShipWreckSchema = new Schema({
  recrd: {
    type: String,
    required: false
  },
  vesslterms: {
    type: String,
    required: false
  },
  feature_type: {
    type: String,
    required: true
  },
  chart: {
    type: String,
    required: true
  },
  latdec: {
    type: mongoose.Decimal128,
    required: true,
  },
  londec: {
    type: mongoose.Decimal128,
    required: true,
  },
  gp_quality: {
    type: String,
    required: false
  },
  depth: {
    type: Number,
    required: true
  },
  sounding_type: {
    type: String,
    required: false
  },
  history: {
    type: String,
    required: false,
  },
  quasou: {
    type: String,
    required: false,
  },
  watlev: {
    type: String,
    required: true,
  },
  coordinates: {
    type: Array,
    required: false,
  },
});

module.exports = ShipWreck = mongoose.model("shipwreck", ShipWreckSchema);
