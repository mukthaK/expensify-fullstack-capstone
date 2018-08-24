"use strict";

const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    loggedinUser: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    //    username: {
    //        type: String,
    //        required: false
    //    }
});

const Friend = mongoose.model('friend', friendSchema);

module.exports = Friend;
