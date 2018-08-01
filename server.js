const User = require('./models/user');
const Habit = require('./models/habit');
const Notes = require('./models/notes');
const Milestones = require('./models/milestones');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const moment = require('moment');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
// Enables debug - we can see what queries are being sent to mongodb
//mongoose.set('debug', true);

mongoose.Promise = global.Promise;

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server = undefined;

function runServer(urlToUse) {
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                console.log(`Listening on localhost:${config.PORT}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}


// ---------------USER ENDPOINTS-------------------------------------
// creating a new user
app.post('/users/create', (req, res) => {
    //take the  username and the password from the ajax api call
    let username = req.body.username;
    let password = req.body.password;

    //exclude extra spaces from the username and password
    username = username.trim();
    password = password.trim();

    //create an encryption key
    bcrypt.genSalt(10, (err, salt) => {
        //if creating the key returns an error...
        if (err) {
            //display it
            return res.status(500).json({
                message: 'Encryption key creation error'
            });
        }

        //using the encryption key above generate an encrypted pasword
        bcrypt.hash(password, salt, (err, hash) => {
            //if creating the encrypted pasword returns an error..
            if (err) {
                //display it
                return res.status(500).json({
                    message: 'Encryption password error'
                });
            }

            //using the mongoose DB schema, connect to the database and create the new user
            User.create({
                username,
                password: hash,
            }, (err, item) => {
                //if creating a new user in the DB returns an error..
                if (err) {
                    //display it
                    return res.status(500).json({
                        message: 'New user creation Error'
                    });
                }
                //if creating a new user in the DB is succefull
                if (item) {
                    //display the new user
                    console.log(`User \`${username}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});

// Loging in a user
app.post('/users/login', function (req, res) {
    //take the username and the password from the ajax api call
    const username = req.body.username;
    const password = req.body.password;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    User.findOne({
        username: username
    }, function (err, items) {
        //if the there is an error connecting to the DB
        if (err) {
            //display it
            return res.status(500).json({
                message: "Error connecting to the DB"
            });
        }
        // if there are no users with that username
        if (!items) {
            //display it
            return res.status(401).json({
                message: "User Not found!"
            });
        }
        //if the username is found
        else {
            //try to validate the password
            items.validatePassword(password, function (err, isValid) {
                //if the connection to the DB to validate the password is not working
                if (err) {
                    //display error
                    console.log('Could not connect to the DB to validate the password.');
                }
                //if the password is not valid
                if (!isValid) {
                    //display error
                    return res.status(401).json({
                        message: "Password Invalid"
                    });
                }
                //if the password is valid
                else {
                    //return the logged in user
                    console.log(`User \`${username}\` logged in.`);
                    return res.json(items);
                }
            });
        };
    });
});

// -------------------HABIT ENDPOINTS----------------------------
// POST -----------------------------------------
// creating a new Entry
app.post('/habit/create', (req, res) => {
    let habitName = req.body.habitName;
    let weekday = req.body.weekday;
    let time = req.body.time;
    let loggedinUser = req.body.loggedinUser;

    Habit.create({
        habitName,
        weekday,
        time,
        loggedinUser,
        checkin: 0
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (item) {
            console.log("itemID for the habit generation", item._id)
            Notes.create({
                notesContent: 'Type here...',
                habitName,
                habitID: item._id,
                loggedinUser
            }, (err, item) => {
                if (err) {
                    console.log('Error Creating Notes while creating Habit');
                }
                if (item) {
                    console.log(item);
                }
            });
            return res.json(item);
        }
    });
});

// GET ------------------------------------
// accessing all of a user's entries
app.get('/get-habit/:loggedinUser', function (req, res) {
    // Get all the habits from the database
    Habit
        .find()
        .then(function (habits) {
            // Creates habitOutput array
            let habitsOutput = [];
            habits.map(function (habit) {
                // if there is a habit matching existing user...
                if (habit.loggedinUser == req.params.loggedinUser) {
                    // ... added to the habit output array
                    habitsOutput.push(habit);
                }
            });
            res.json({
                habitsOutput
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});

// PUT ------------------------------------
// accessing a habit content by habit id and updating
app.put('/update-habit/:habitId', function (req, res) {
    console.log("inside get habit server call");
    console.log("habit id server ", req.params.habitId);
    let toUpdate = {};
    let updateableFields = ['habitName', 'weekday', 'time'];
    updateableFields.forEach(function (field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Habit
        .findByIdAndUpdate(req.params.habitId, {
            $set: toUpdate
        }).exec().then(function (achievement) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Habit update failed'
            });
        });

});

// PUT --------------------------------------
// Update habit checkin value
app.put('/habit/checkin', function (req, res) {
    let habitId = req.body.habitId;
    //console.log(habitId);
    Habit
        .update({
            _id: habitId
        }, {
            $inc: {
                "checkin": 1
            }
        }).exec().then(function (milestone) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Habit checkin failed'
            });
        });
});

// DELETE ----------------------------------------
// deleting a Habit  by id
app.delete('/habit/:habitID', function (req, res) {
    Habit
        .findByIdAndRemove(req.params.habitID)
        .exec().then(function (item) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Delete Habit failed'
            });
        });
});

// ---------------NOTES ENDPOINTS-------------------------------------
// GET ------------------------------------
// accessing a note content by habit id
app.get('/get-notes/:habitId', function (req, res) {
    //    console.log("habit id server " + req.params.habitId);
    Notes
        .find({
            "habitID": req.params.habitId
        })
        .then(function (note) {
            console.log("note ", note);
            return res.json(note);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Get Notes failed'
            });
        });
});

// PUT-----------------------------------------------
// Saving entry for Notes
app.put('/notes/save', (req, res) => {
    let notesContent = req.body.notesContent;
    let notesID = req.body.notesID;
    let toUpdate = {};
    let updateableFields = ['notesContent'];
    updateableFields.forEach(function (field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Notes
        .findByIdAndUpdate(notesID, {
            $set: toUpdate
        }).exec().then(function (note) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Notes Save failed'
            });
        });
});

// ---------------MILESTONES ENDPOINTS-------------------------------------
// POST-----------------------------------------------
// Adding entry for Milestones
app.post('/milestones/add', (req, res) => {
    let milestonesContent = req.body.milestonesContent;
    let habitName = req.body.habitName;
    let loggedinUser = req.body.loggedinUser;
    let habitID = req.body.habitID;

    Milestones.create({
        milestonesContent,
        // Set the default checked value as false
        checked: false,
        habitName,
        habitID,
        loggedinUser
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to add milestones'
            });
        }
        if (item) {
            return res.json(item);
        }
    });
});

// GET ------------------------------------
// accessing a milestone items by habit id
app.get('/get-milestones/:habitId', function (req, res) {

    Milestones
        .find({
            "habitID": req.params.habitId
        })
        .then(function (milestone) {
            console.log("milestone ", milestone);
            return res.json(milestone);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Get milestones failed'
            });
        });
});

// PUT --------------------------------------
// Update milestone item for checked value
app.put('/milestone/check', function (req, res) {
    let milestoneID = req.body.milestoneID;
    let checkedValue = req.body.checked;
    //console.log(milestoneID, checkedValue);

    let toUpdate = {};
    let updateableFields = ['checked'];
    updateableFields.forEach(function (field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    //console.log(toUpdate);

    Milestones
        .findByIdAndUpdate(milestoneID, {
            $set: toUpdate
        }).exec().then(function (milestone) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Check milestones failed'
            });
        });
});

// DELETE ----------------------------------------
// deleting a milestone item by id
app.delete('/milestone/:milestoneID', function (req, res) {
    Milestones
        .findByIdAndRemove(req.params.milestoneID)
        .exec().then(function (item) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Milestone delete failed'
            });
        });
});


// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;
