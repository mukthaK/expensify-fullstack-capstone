const User = require('./models/user');
const Friend = require('./models/friend');
const Bill = require('./models/bill');
//const Milestones = require('./models/milestones');
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
    //    console.log('* [example 1.1] sending test email');
    //    console.log(email, loggedinUser, password);
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
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// ---------------USER ENDPOINTS------------------------------------
// creating a new user **
app.post('/users/create', (req, res) => {
    //take the  username and the password from the ajax api call
    //let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    //exclude extra spaces from the username and password
    //username = username.trim();
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
                //username,
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
    //    console.log("friend create payload ", email, password, loggedinUser);

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
                //                console.log("friend generated ", item)
                sendEmail(item.email, loggedinUser, password);

                return res.json(item);
            }
        });
});

// GET to check friend exists **
app.get('/friend/:email', function (req, res) {
    //    console.log("email id server side" + req.params.email);
    User
        .find({
            "email": req.params.email
        })
        .then(function (friend) {
            //            console.log("friend ", friend);
            return res.json(friend);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Get Friend failed'
            });
        });
});

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
// accessing all of a user's friends list **
app.get('/getfriends/:loggedinUser', function (req, res) {
    // Get all the friends from the database
    Friend
        .find()
        .then(function (friends) {
            //            console.log(friends);
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

//GET---------------------**
// accessing all the bills to be paid
app.get('/bill/:loggedinUser', function (req, res) {
    // Get all the friends from the database
    Bill
        .find({
            "$or": [
                {
                    "paidTo": req.params.loggedinUser
                },
                {
                    "paidBy": req.params.loggedinUser
                }
            ]
        })
        //sort to be done
        //        .sort({
        //            "paidBy": 1
        //        })
        .then(function (bills) {
            //            console.log(bills);
            return res.json(bills);

        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error- error while getting bills to be paid'
            });
        });
});

////GET---------------------**
//// accessing all the bills owed
//app.get('/billowed/:loggedinUser', function (req, res) {
//    // Get all the friends from the database
//    Bill
//        .find({
//            "paidBy": req.params.loggedinUser
//        })
//        //sort to be done
//        .sort({
//            "paidTo": 1
//        })
//        .then(function (bills) {
//            console.log(bills);
//            return res.json(bills);
//            // Creates friendOutput array
//            //            let billsOutput = [];
//            //            bills.map(function (bill) {
//            // if there is a friend matching existing user...
//            //            if (friend.loggedinUser == req.params.loggedinUser || //friend.email == req.params.loggedinUser) {
//            // ... added to the habit output array
//            //                billsOutput.push(bill);
//            //}
//            //            });
//            //            res.json({
//            //                billsOutput
//            //            });
//        })
//        .catch(function (err) {
//            console.error(err);
//            res.status(500).json({
//                message: 'Internal server error- error while getting bills owed'
//            });
//        });
//});



//POST----------
// Creating Bill **
app.post('/bill/create', (req, res) => {
    //let loggedinUser = req.body.loggedinUser;
    let description = req.body.description;
    let amount = req.body.amount;
    let paidBy = req.body.paidBy;
    let paidTo = req.body.paidTo;
    //let date = new Date();
    //    console.log(description, amount, paidBy, paidTo);
    Bill.create({
        description,
        amount,
        paidBy,
        paidTo,
        date: new Date()
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to add bill' + err
            });
        }
        if (item) {
            //            console.log(item);
            return res.json(item);
        }
    });
});

// PUT --------------------------------------
// Update bill value after settleup
app.put('/bill/settleup', function (req, res) {
    let loggedinUser = req.body.loggedinUser;
    let user = req.body.user;
    //    console.log(loggedinUser, user);
    Bill
        .update({
            $or: [{
                    "paidTo": req.body.loggedinUser,
                    "paidBy": user
        },
                {
                    "paidTo": user,
                    "paidBy": req.body.loggedinUser
              }]
        }, {
            $set: {
                "amount": 0
            }
        }, {
            multi: true
        }).exec().then(function (settledBill) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Bill settle up failed'
            });
        });
});


// UPDATE
// Update user password
app.put('/update-password/:loggedinUser', function (req, res) {
    let password = req.body.pw;
    password = password.trim();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error on genSalt'
            });
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error on hash'
                });
            }

            User
                .update({
                    "email": req.params.loggedinUser
                }, {
                    $set: {
                        password: hash
                    }
                })
                .then((user) => {
                    return res.json(user);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({
                        message: 'Password was not modified'
                    });
                });
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
