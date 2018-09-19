// Test cases for end points
const {
    app,
    runServer,
    closeServer
} = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
const Friend = require('./models/friend');
const Bill = require('./models/bill');
//var entry = require('../models/entry.js');
//var habit = require('../models/habit');
//var notes = require('../models/notes');
//var milestones = require('../models/milestones');
var should = chai.should();

chai.use(chaiHttp);

// Friend endpoints check - test cases
describe('Friend API', function () {
    it('should add a friend on POST', function () {
        chai.request(app)
            .post('/friend/add')
            .send({
                loggedinUser: "test@gmail.com",
                email: "demo@gmail.com"
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

    it('Should Get All friends of loggedin user', function () {
        chai.request(app)
            .get('/getfriends/:loggedinUser')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });
});


// Bill endpoints check - test cases
describe('Bill API', function () {
    it('should add a bill on POST', function () {
        chai.request(app)
            .post('/bill/create')
            .send({
                description: "Rent",
                amount: "500",
                paidBy: "test@gmail.com",
                paidTo: "demo@gmail.com",
                date: new Date()
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
    it('Should Get All bills', function () {
        chai.request(app)
            .get('/bill/:loggedinUser')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });

    it('Should settleup a bill', function () {
        chai.request(app)
            .put('/bill/settleup')
            .then(function (res) {
                res.should.have.status(201);
                done();
            })
            .catch(err => console.log({
                err
            }));
    });
});
