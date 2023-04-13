const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectId;

const ShipWreck = require("../../models/ShipWreck");

router.get("/", (req, res) => res.send("ShipWreck related routes"));

router.get("/data", async (req, res) => {
  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.perPage);
  const depth = req.query.depth ? { depth: req.query.depth } : {};

  const shipwrk = await ShipWreck.find(depth)
    .skip((page - 1) * perPage)
    .limit(perPage);
  try {
    if (!shipwrk) {
      return res.status(404).send("Data not found");
    }
    res.send(shipwrk);
  } catch (err) {
    res.status(500).send(error);
  }
});

router.get("/data/:_id", (req, res) => {
  x = new ObjectId(req.params._id);
  ShipWreck.findOne({ _id: x })
    .then((data) => {
      if (!data) {
        return res.status(404).send("Data not found");
      }
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

router.post("/add", (req, res) => {
  const newShipWreck = new ShipWreck({
    feature_type: req.body.feature_type,
    chart: req.body.chart,
    latdec: req.body.latdec,
    londec: req.body.londec,
    depth: req.body.depth,
    watlev: req.body.watlev,
  });

  newShipWreck
    .save()
    .then((shipwrk) => res.send(shipwrk))
    .catch((err) => console.log(err));
});

router.put("/data/:_id", (req, res) => {
  x = new ObjectId(req.params._id);
  ShipWreck.updateOne(
    { _id: x },
    {
      $set: {
        feature_type: req.body.feature_type,
        chart: req.body.chart,
        latdec: req.body.latdec,
        londec: req.body.londec,
        depth: req.body.depth,
        watlev: req.body.watlev,
      },
    },
  )
    .exec()
    .then((data) => {
      if (data.matchedCount === 0) {
        return res.status(404).send("Data not found");
      } else {
        console.log(data);
        res.status(201).send("Shipwreck Deleted.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/data/:_id", (req, res) => {
  x = new ObjectId(req.params._id);
  ShipWreck.deleteOne({ _id: x })
    .exec()
    .then((data) => {
      if (data.deletedCount === 0) {
        return res.status(404).send("Data not found");
      } else {
        console.log(data);
        res.status(201).send("Shipwreck Deleted.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
