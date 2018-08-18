"use strict";

const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    loggedinUser: {
        type: String,
        required: false
    },
    friend: {
        type: String,
        required: false
    }
});

const Friend = mongoose.model('friend', friendSchema);

module.exports = Friend;
