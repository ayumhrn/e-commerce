const chaiHttp = require('chai-http');
const chai = require('chai');
const cart = require('../../models/cart')
const server = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

var token, productId, cartId;

describe('CREATE, GET, UPDATE CART', function () {

    beforeEach(function (done) {
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

    beforeEach(function(done) {

        chai.request(server)
            .post('/product/create') 
            .send({
                productName: 'T-shirt polos',
                price: '120000',
                stock: '50',
                descripition: 'size S, M, L',
                category: 'anak'
            })
            .set('Authorization', token)
            .end(function(err, res) {
                productId = res.body.result._id
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('CREATE CART SHOULD SHOW OK', function (done) {

        chai.request(server)
            .post('/cart/add')
            .send({
                product_id: productId,
                quantity: '10'
            })
            .set('Authorization', token)
            .end(function (err, res) {
                cartId = res.body.result._id
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('GET CART SHOULD SHOW OK', function () {

        chai.request(server)
            .get('/cart/get-all')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
            })
    })

    it('UPDATE CART SHOULD SHOW OK', function () {

        chai.request(server)
            .put(`/cart/${cartId}`)
            .set('Authorization', token)
            .send({
                quantity: '5'
            })
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
            })
    })

    it("UPDATE CART QUANTITY > STOCK SHOULD SHOW ERROR", function (done) {
        chai.request(server)
            .put(`/cart/${cartId}`)
            .send({
                quantity: '100'
            })
            .set('authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(422)
                expect(res).to.be.an('object')
                done()
            })
    })

})

describe('DELETE CART', function() {

    it('DELETE CART SHOULD SHOW OK', function (done) {

        chai.request(server)
            .delete(`/cart/${cartId}`)
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

})
