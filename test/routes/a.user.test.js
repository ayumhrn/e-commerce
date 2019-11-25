var mongoose = require('mongoose');
var chaiHttp = require('chai-http');
var chai = require('chai');
var server = require('../../app');
var user = require('../../models/user')
var expect = chai.expect;
var request = require('supertest')(server)
let token;
let fakeToken = 'thisisfaketoken'
let resetToken;
chai.use(chaiHttp);

describe('Register', function () {

    before(done => {
        user.deleteMany({},
            { new: true })
            .exec(function (err) {
                if (err) throw err;
                done()
            })
    })

    it('Add user should be Ok', function(done) {

        chai.request(server)
            .post('/user/register') 
            .send({
                username: 'merchant',
                name: 'Ayu Maharani',
                email: 'maharani.ayu98@gmail.com',
                password: '12345678',
                role: 'merchant'
            })
            .end(function(err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('add user with exist email should be error', function(done) {

        chai.request(server)
            .post('/user/register')
            .send({
                username: 'merchant',
                name: 'Ayu Maharani',
                email: 'maharani.ayu98@gmail.com',
                password: '12345678',
                role: 'merchant'
            })
            .end(function(err, res) {
                expect(res).to.have.status(409)
                expect(res).to.be.an('object')
                done()
            })            

    })

    it('add user with exist username should be error', function(done) {

        chai.request(server)
            .post('/user/register')
            .send({
                username: 'merchant',
                name: 'Ayu Maharani',
                email: 'maharani.ayu98@gmail.com',
                password: '12345678',
                role: 'merchant'
            })
            .end(function(err, res) {
                expect(res).to.have.status(409)
                expect(res).to.be.an('object')
                done()
            })            

    })

    it('register user failed should be ok', function(done) {

        chai.request(server)
            .post('/user/register')
            .send()
            .end(function(err, res) {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })            

    })
})

describe('login', function() {

    it('login by username and password should be ok', function(done) {

        chai.request(server)
            .post('/user/login')
            .send({
                username: 'merchant',
                password: '12345678'
            })
            .end(function(err, res) {
                token = res.header.authorization
                expect(res).to.be.have.status(200)
                expect(res).to.be.an('object')
                done()   
            })
    })

    it('login by wrong username should be error', function(done) {

        chai.request(server)
            .post('/user/login')
            .send({
                username: 'ayu',
                password: '12345678'
            })
            .end(function(err, res) {
                expect(res).to.be.have.status(404)
                expect(res).to.be.an('object')
                done()
            })
    })   

    it('login by username and wrong password should be error', function(done) {

        chai.request(server)
            .post('/user/login')
            .send({
                username: 'merchant',
                password: '111111   '
            })
            .end(function(err, res) {
                expect(res).to.be.have.status(401)
                expect(res).to.be.an('object')
                done()
            })
    })   
})

describe('Show user', function () {

    before(function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                username: 'merchant',
                password: '12345678'
            })
            .end(function (err, res) {
                if (err) {
                    console.log(err)
                }
                token = res.header.authorization
                done();
            })
    })

    it('show all user should be ok', function (done) {

        chai.request(server)
            .get('/user/get-all')
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })

    })

    it("it should show own profile", function (done) {
        chai.request(server)
            .get('/user/id')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
                })
    })

})

describe('Update user', function () {


    it('Update user should be ok', function (done) {

        chai.request(server)
            .put('/user/id')
            .set('Authorization', token)
            .send({
                name: 'ayu'
            })
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })

    })



})

describe('DELETE', function () {

    it("DELETE BY TOKEN SHOULD SHOW OK", function (done) {
        chai.request(server)
            .delete('/user/id')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

})

describe('Reset-password', function() {

    it("it should send verification for reset password to email", function () {
        chai.request(server)
            .post('/user/reset-password')
            .send({
                email: 'maharani.ayu98@gmail.com'
            })
            .end(function (err, res) {
                resetToken = res.body.token
                console.log(token)
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
            })
    })

    it("send verification for reset password to unexist email should show error", function () {
        chai.request(server)
            .post('/user/reset-password')
            .send({
                email: 'ayu@gmail.com'
            })
            .end(function (err, res) {
                expect(res).to.have.status(404)
                expect(res).to.be.an('object')
            })
    })

})



after(function () {
    mongoose.connection.close();
})


