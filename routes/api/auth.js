const express = require("express");
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
var ObjectId = require("mongodb").ObjectId;

// getting setting
const settings = require("../../config/settings");

const router = express.Router();

const Person = require("../../models/Person");
const ShipWreck = require("../../models/ShipWreck");

/* -------------------------------------------------------- REGISTER PAGE FORM ----------------------------------------------- */
//Render registerPage.hbs form
router.get("/registerPage", function (req, res) {
  res.render("registerPage");
});

/* -------------------------------------------------------- LOGIN PAGE FORM ----------------------------------------------- */
//Render loginPage.hbs form
router.get("/loginPage", function (req, res) {
  res.render("loginPage");
});

/* -------------------------------------------------------- REGISTER USER ----------------------------------------------- */
// Route to register a user. URL : /api/auth/register
router.post("/register", (req, res) => {
  // check if username is already in collection.
  Person.findOne({ username: req.body.username })
    .then((person) => {
      if (person) {
        res.status(400).send("Username already there.");
      } else {
        //create new object with data provided by the Client
        const person = Person({
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
        });
        // Encrypting the password using bcryptjs
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(person.password, salt, (err, hash) => {
            if (err) {
              return res.status(400).send("Not Registered, Contact Admin!");
            } else {
              // Hashed password assigned instead of regular one
              person.password = hash;
              // Add new person with hashed password to collection
              person
                .save()
                .then(
                  //Send Feedback Message
                  res.render("index", {
                    data: "Registered Successfully",
                  }),
                )
                .catch((err) => res.send(err.message));
            }
          });
        });
      }
    })
    .catch((err) => res.send(err));
});

/* -------------------------------------------------------- LOG IN USER ----------------------------------------------- */
// Route to login a user. URL : /api/auth/login
router.post("/login", (req, res) => {
  // Use data from submiting the form
  username = req.body.username;
  password = req.body.password;
  // Check if username is already in collection.
  Person.findOne({ username: req.body.username }).then((person) => {
    //USER EXISTS IN THE SYSTEM
    if (person) {
      // compare the password
      bcrypt
        .compare(password, person.password)
        .then((isCompared) => {
          //PASSWORD CORRECT
          if (isCompared) {
            //Generate JWT for that User
            const payload = {
              id: person.id,
              name: person.name,
              username: person.username,
            };
            //Sign() method used to create token. and send it back as response
            jsonwt.sign(
              payload,
              settings.secret,
              { expiresIn: 3600 },
              (err, token) => {
                //Send message
                res.render("index", {
                  data: "Log In Successful. Now you can Get an access to delete data. Click DELETE button ",
                  newtoken: token,
                });
                // console.log(err)
                // res.json({
                //     success: true,
                //     token: 'Bearer ' + token
                // })
              },
            );
          }
          //PASSWORD INCORRECT
          else {
            res.status(401).send("Password is not correct");
          }
        })
        .catch();
    }
    //USER DOES NOT EXISTS IN THE SYSTEM
    else {
      res.status(400).send("Username is not there.");
    }
  });
});
/* -------------------------------------------------------- PRIVATE ROUTE ----------------------------------------------- */
/* -------------------------------------------------------- DELETE DATA ----------------------------------------------- */
router.post("/delete", (req, res) => {
  x = new ObjectId(req.body._id);
  ShipWreck.deleteOne({ _id: x })
    .exec()
    .then((data) => {
      if (data.deletedCount === 0) {
        return res.status(404).render("index", {
            data: "Data Not Found",
          });
      } else {
        res.status(201).render("index", {
            data: "Deleted Successfully",
          }),
          console.log(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
