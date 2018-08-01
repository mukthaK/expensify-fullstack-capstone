"use strict";

const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    habitName: {
        type: String,
        required: false
    },
    weekday: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: false
    },
    loggedinUser: {
        type: String,
        required: false
    },
    checkin: {
        type: Number,
        required: false
    }
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
