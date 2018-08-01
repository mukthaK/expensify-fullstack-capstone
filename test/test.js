// Test cases for end points
const {
    app,
    runServer,
    closeServer
} = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
//var entry = require('../models/entry.js');
var habit = require('../models/habit');
var notes = require('../models/notes');
var milestones = require('../models/milestones');
var should = chai.should();

chai.use(chaiHttp);

// HABIT endpoints check - test cases
describe('habit API', function () {
    it('should add a habit on POST', function () {
        chai.request(app)
            .post('/habit/create')
            .send({
                habitName: "running",
                weekday: "tuesday",
                time: "morning",
                loggedinUser: "test@gmail.com",
                checkin: 0
            })
            .then(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should Get All Users habits', function () {
        chai.request(app)
            .get('/get-habit/:loggedinUser')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should Update a habit', function () {
        chai.request(app)
            .put('/update-habit/5b11d3da6c25be0e6b554553')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should Update habit checkin', function () {
        chai.request(app)
            .put('/habit/checkin')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should Delete a habit', function () {
        chai.request(app)
            .delete('/habit/5b11d3da6c25be0e6b554553')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });
});


// NOTES endpoints check - test cases
describe('notes API', function () {

    it('Should Get All habits notes', function () {
        chai.request(app)
            .get('/get-notes/5b11d3da6c25be0e6b554553')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should Update a note', function () {
        chai.request(app)
            .put('/notes/save')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });
});

// MILESTONES endpoints check - test cases
describe('milestone API', function () {
    it('should add a milestone on POST', function () {
        chai.request(app)
            .post('/milestones/add')
            .send({
                milestonesContent: "run 2 miles",
                checked: false,
                habitName: "running",
                habitID: "5b11d3da6c25be0e6b554553",
                loggedinUser: "test@gmail.com"
            })
            .then(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should Get All milestones of a habit', function () {
        chai.request(app)
            .get('/get-milestones/:habitId')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should Update a milestone', function () {
        chai.request(app)
            .put('/milestone/check')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should Delete a milestone', function () {
        chai.request(app)
            .delete('/milestone/:milestoneID')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });
});
