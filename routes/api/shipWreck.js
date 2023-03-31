const express = require('express')
const router = express.Router()

// Import Person schema
const Person = require('../../models/ShipWreck')

//@type     -   GET
//@route    -   /api/profile
//@desc     -   Just for testing
//@access   -   PUBLIC
router.get('/', (req, res) => res.send('Profile related routes'))


//@type     -   GET
//@route    -   /api/profile/get
//@desc     -   Get all people record
//@access   -   PUBLIC
router.get('/get', async (req, res) => {
    
    // without cursor.
    const people = await Person.find({});
    try {
        res.send(people);
    } catch (error) {
        res.status(500).send(error);
    }

    // with cursor
    // const cursor = await Person.find()
    // cursor.forEach(function(myDoc) {
    //     console.log( myDoc ); 
    // })
})

//@type     -   GET
//@route    -   /api/profile/get/:username
//@desc     -   Get a person record
//@access   -   PUBLIC
router.get('/get/:username', (req, res) => {
    Person
        .findOne({username: req.params.username})
        .then(person => res.send(person))
        .catch(err => console.log(err))
})

//@type     -   POST
//@route    -   /api/profile/add
//@desc     -   Insert a person record
//@access   -   PUBLIC
router.post('/add', (req, res) => {
    // check to keep usernames unique
    Person
        .findOne({username: req.body.username})
        .then(person => {
            if (person) {
                return res
                        .status(400)
                        .send('Username already exists')    
            } else {
                const newPerson = Person({
                    name: req.body.name,
                    username: req.body.username,
                    password: req.body.password
                })

                newPerson
                    .save()
                    .then(person => res.send(person))
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})

//@type     -   PUT
//@route    -   /api/profile/update-pwd/:username
//@desc     -   Update a record on the basis of username
//@access   -   PUBLIC
router.put('/update-pwd/:username', (req, res) => {
    Person.updateOne(
        {username: req.params.username},
        { $set: { password: req.body.password }})
        .exec()
        .then(() => {
            res.status(201).send('Password Updated.')
        })
        .catch((err) => { console.log(err);
        })
})

//@type     -   DELETE
//@route    -   /api/profile/delete/:username
//@desc     -   Delete a record on the basis of username
//@access   -   PUBLIC
router.delete('/delete/:username', (req, res) => {
    Person.deleteOne({username: req.params.username})
        .exec()
        .then(() => {
            res.status(201).send('Person Deleted.')
        })
        .catch((err) => { console.log(err);
        })
})

module.exports = router