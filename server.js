const User = require('./models/user');
const Friend = require('./models/friend');
//const Notes = require('./models/notes');
const Milestones = require('./models/milestones');
const bodyParser = require('body-parser');
const config = require('./configbuilder').config();
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

// gmail send api
function sendEmail(email, loggedinUser, password) {
    console.log('* [example 1.1] sending test email');
    console.log(email, loggedinUser, password);
    let htmlString = `<h3>Hello!.</h3>`;
    htmlString += `<p>You have been invited to join Expensify.</p>`;
    htmlString += `<p>Expensify helps you split expenses with friends. The app maintains a running total so that you can pay each other at once! </p>`;
    htmlString += `<p>Here is the link to join Expensify.</p>`;
    htmlString += `Log In to <a href="https://expensify-capstone.herokuapp.com/">Expensify</a>`;
//    htmlString += `<p>username: ${name}</p>`;
    htmlString += `<p>email: ${email}</p>`;
    htmlString += `<p>password: ${password}</p>`;

    var send = require('gmail-send')({
        //var send = require('../index.js')({
        user: 'expensify.info@gmail.com',
        // user: credentials.user,                  // Your GMail account used to send emails
        pass: config.PASSWORD_EMAIL,
        // pass: credentials.pass,                  // Application-specific password
        to: email,
        // to:   credentials.user,                  // Send to yourself
        // you also may set array of recipients:
        // [ 'user1@gmail.com', 'user2@gmail.com' ]
        // from:    credentials.user,            // from: by default equals to user
        // replyTo: credentials.user,            // replyTo: by default undefined
        // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
        subject: 'Invitation to join Expensify!',
        //text: 'gmail-send example 1', // Plain text
        html: htmlString // HTML
    });
    send({ // Overriding default parameters
        //        subject: 'attached ' + filepath, // Override value set as default
        //        files: [ filepath ],
    }, function (err, res) {
        console.log('* [example 1.1] send() callback returned: err:', err, '; res:', res);
    });



    //console.log(htmlString);
    // Require'ing module and setting default options

    //    var send = require('gmail-send')({
    //var send = require('../index.js')({
    //        user: 'expensify.info@gmail.com',
    // user: credentials.user,                  // Your GMail account used to send emails
    //        password: '',
    // pass: credentials.pass,                  // Application-specific password
    //        to: 'test@gmail.com',
    // to:   credentials.user,                  // Send to yourself
    // you also may set array of recipients:
    // [ 'user1@gmail.com', 'user2@gmail.com' ]
    // from:    credentials.user,            // from: by default equals to user
    // replyTo: credentials.user,            // replyTo: by default undefined
    // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
    //        subject: 'Invitation to join Expensify!',
    //        text: `Hello!` // Plain text
    //html: htmlString // HTML
    //    });
    //    var send = require('gmail-send')({
    //        //var send = require('../index.js')({
    //        user: 'expensify.info@gmail.com',
    //        // user: credentials.user,                  // Your GMail account used to send emails
    //        password: '',
    //        // pass: credentials.pass,                  // Application-specific password
    //        to: email,
    //        // to:   credentials.user,                  // Send to yourself
    //        // you also may set array of recipients:
    //        // [ 'user1@gmail.com', 'user2@gmail.com' ]
    //        // from:    credentials.user,            // from: by default equals to user
    //        // replyTo: credentials.user,            // replyTo: by default undefined
    //        // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
    //        subject: 'Invitation to join Expensify!',
    //        text: `Hello ${name}! You have been invited you to join Expensify - Split expenses with friends. The app maintains a running total so that you can pay each other at once!
    //        Here is the link to join Expensify.  <a href="https://expensify-capstone.herokuapp.com/">Log In to Expensify</a>
    //        username: ${name}
    //        email: ${email}
    //        password: ${password}` // Plain text
    //        //html: htmlString // HTML
    //    });


    // Override any default option and send email

    //    console.log('* [example 1.1] sending test email');
    //
    //    var filepath = './demo-attachment.txt';  // File to attach
    //
    //    send({ // Overriding default parameters
    //            subject: 'attached '+filepath,         // Override value set as default
    //            files: [ filepath ],
    //    }, function (err, res) {
    //        console.log('* [example 1.1] send() callback returned: err:', err, '; res:', res);
    //    });

    // Set additional file properties

    //    console.log('* [example 1.2] sending test email');
    //
    //    send({ // Overriding default parameters
    //        subject: 'attached '+filepath,              // Override value set as default
    //        files: [                                    // Array of files to attach
    //            {
    //                path: filepath,
    //                filename: 'filename-can-be-changed.txt' // You can override filename in the attachment if needed
    //            }
    //        ],
    //    }, function (err, res) {
    //        console.log('* [example 1.2] send() callback returned: err:', err, '; res:', res);
    //    });
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// ---------------USER ENDPOINTS-------------------------------------
// creating a new user **
app.post('/users/create', (req, res) => {
    //take the  username and the password from the ajax api call
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    //exclude extra spaces from the username and password
    username = username.trim();
    password = password.trim();
    email = email.trim();

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
                email,
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
    const email = req.body.email;
    const password = req.body.password;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    User.findOne({
        email: email
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
                    console.log(`User \`${email}\` logged in.`);
                    return res.json(items);
                }
            });
        };
    });
});

// -------------------Expensify ENDPOINTS---------------------------
// POST -----------------------------------------
// creating a new Entry friend ** ??
app.post('/friend/create', (req, res) => {
    //let username = req.body.name;
    let email = req.body.email;
    let password = makeid();
    let loggedinUser = req.body.loggedinUser;
    console.log("friend create payload ", email, password, loggedinUser);

    User
        .create({
            //username,
            email,
            password
        }, (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'cannot create user- new friend'
                });
            }
            if (item) {
                console.log("friend generated ", item)
                sendEmail(item.email, loggedinUser, password);
                //            Notes.create({
                //                notesContent: 'Type here...',
                //                habitName,
                //                habitID: item._id,
                //                loggedinUser
                //            }, (err, item) => {
                //                if (err) {
                //                    console.log('Error Creating Notes while creating Habit');
                //                }
                //                if (item) {
                //                    console.log(item);
                //                }
                //            });
                return res.json(item);
            }
        });
    //        .catch(function (err) {
    //            console.error(err);
    //            res.status(500).json({
    //                message: 'Friend could not be created!'
    //            });
    //        });
});

// GET to check friend exists **
app.get('/friend/:email', function (req, res) {
    console.log("email id server side" + req.params.email);
    User
        .find({
            "email": req.params.email
        })
        .then(function (friend) {
            console.log("friend ", friend);
            return res.json(friend);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Get Friend failed'
            });
        });
});

// GET ------------------------------------
// accessing all of a user's friends list **
app.get('/getfriends/:loggedinUser', function (req, res) {
    // Get all the friends from the database
    Friend
        .find()
        .then(function (friends) {
            console.log(friends);
            // Creates friendOutput array
            let friendsOutput = [];
            friends.map(function (friend) {
                // if there is a friend matching existing user...
                if (friend.loggedinUser == req.params.loggedinUser || friend.email == req.params.loggedinUser) {
                    // ... added to the habit output array
                    friendsOutput.push(friend);
                }
            });
            res.json({
                friendsOutput
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
// Adding entry for friend (list) **
app.post('/friend/add', (req, res) => {
    let loggedinUser = req.body.loggedinUser;
    let email = req.body.email;
    //let username = req.body.username;

    Friend.create({
        loggedinUser,
        email,
        // username
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to add friend'
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
