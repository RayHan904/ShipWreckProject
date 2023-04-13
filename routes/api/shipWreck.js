const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectId;

const ShipWreck = require("../../models/ShipWreck");

router.get("/", (req, res) => res.send("ShipWreck related routes"));

/* -------------------------------------------------------- FRONT END FORMS ----------------------------------------------- */
router.get('/addForm', function (req, res) {
  res.render('addForm')
})

router.get('/showDataForm', function (req, res) {
  res.render('showDataForm')
})

router.get('/showOneForm', function (req, res) {
  res.render('showOneForm')
})

router.get('/updateForm', function (req, res) {
  res.render('updateForm')
})

router.get('/deleteForm', function (req, res) {
  res.render('deleteForm')
})



/* -------------------------------------------------------- SHOW DATA ----------------------------------------------- */
//Show all data based on number of instances per page. 
//Filtered(optionaly) by depth
router.get("/data", async (req, res) => {
  const page = parseInt(req.query.pages);
  const perPage = parseInt(req.query.perPage);
  const depth = req.query.depth ? { depth: req.query.depth } : {};

  const shipwrks = await ShipWreck.find(depth)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .then((shipwreck) => {
      if(!shipwreck) {
        res.status(400).send("Data not found")
      }
      else {
        shipwrks => res.render('showAll',
        {
            data: shipwrks
        })
        .catch(err => console.log(err))
      }
    })
});

//Show particular shipwreck based on it's _id in collection
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

/* -------------------------------------------------------- ADD DATA ----------------------------------------------- */
router.post("/add", (req, res) => {
  const newShipWreck = new ShipWreck(
    req.body
  );

  newShipWreck
    .save()
    .then(
     //Send Feedback Message at Home Page
      res.render('index',
        {
          data: "Registered Successfully"
        })
    )
    .catch((err) => console.log(err));
});

/* -------------------------------------------------------- UPDATE DATA ----------------------------------------------- */
router.post("/update", (req, res) => {
  x = new ObjectId(req.body._id);
  ShipWreck.findOne({ _id: x })
    .then(shipwreck => {
      if (!shipwreck) {
        res.status(400).send("Data not found")
      }
      else {
        ShipWreck.updateOne(
          { _id: x },
          {
            $set: req.body
          }
        )
          .exec().then(

            //Send Feedback Message at Home Page
            res.status(201).render('index',
              {
                data: "Registered Successfully"
              })
          ).catch((err) => {
            console.log(err);
          });
      }
    });
  });

  

  module.exports = router;
