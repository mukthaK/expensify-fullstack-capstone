"use strict";

const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    description: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: false
    },
    paidBy: {
        type: String,
        required: false
    },
    paidTo: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
