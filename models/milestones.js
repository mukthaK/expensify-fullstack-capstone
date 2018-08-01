"use strict";

const mongoose = require('mongoose');

const milestonesSchema = new mongoose.Schema({
    milestonesContent: {
        type: String,
        required: false
    },
    checked: {
        type: String,
        required: false
    },
    habitName: {
        type: String,
        required: false
    },
    habitID: {
        type: String,
        required: false
    },
    loggedinUser: {
        type: String,
        required: false
    }
});

const Milestones = mongoose.model('Milestones', milestonesSchema);

module.exports = Milestones;
