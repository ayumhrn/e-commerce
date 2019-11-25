const chaiHttp = require('chai-http');
const chai = require('chai');
const cart = require('../../models/cart')
const server = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

var token 
var productId
var cartId;

describe('CREATE ORDER  AND HISTORY', function () {

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

    beforeEach(function(done) {

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

    it('CREATE ORDER SHOULD SHOW OK', function (done) {

        chai.request(server)
            .post('/order')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                expect(res.body.success).to.be.true
                expect(res.body.message).to.be.a('string')
                expect(res.body.result).to.be.an('object')
                done()
            })
    })

    it("GET HISTORY SHOLUD SHOW OK", function (done) {
        chai.request(server)
            .get('/order')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                expect(res.body.success).to.be.true
                expect(res.body.message).to.be.a('string')
                done()
            })
    })
})