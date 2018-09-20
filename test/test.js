// Test cases for end points
const {
    app,
    runServer,
    closeServer
} = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
const User = require('./models/user');
const Friend = require('./models/friend');
const Bill = require('./models/bill');
//var entry = require('../models/entry.js');
//var habit = require('../models/habit');
//var notes = require('../models/notes');
//var milestones = require('../models/milestones');
var should = chai.should();

chai.use(chaiHttp);

// --------------- Test User Endpoints ---------------

describe('User API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('Running server'))
            .catch(err => console.log({
                err
            }));
    });

    beforeEach(function () {
        return seedUserData();
    });

    // Test create a new user
    it('should create a new user', function () {
        return chai.request(app)
            .post('/users/create')
            .send({
                email: "test@gmail.com",
                password: "testPassword"
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.include.keys('email', 'password');
                res.body.email.should.equal(newUser.email);
                res.body.password.should.not.equal(newUser.password);
                res.body._id.should.not.be.null;
            });
    });

    // Change user password
    it('should update user password', function () {
        //const updateUser = generateUser();
        const updatePw = "testPassword";

        return chai.request(app)
            .put(`/update-password/:loggedinUser`)
            .send(updatePw)
            .then(function (res) {
                res.should.have.status(200);
                return User.findById(updateUser.id);
            })
            .then(function (user) {
                user.password.should.not.be.null;
                user.password.should.not.equal(updatePw);
            })
    });


    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
});


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
