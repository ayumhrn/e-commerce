const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../../app');
const product = require('../../models/product')
const expect = chai.expect;

chai.use(chaiHttp);

var id;
var fakeId = '12323QR3';
var category = 'anak'

describe('Create product', function () {

    before(done => {
        chai.request(server)
            .post('/user/register')
            .send({
                username: 'merchant',
                name: 'Ayu Maharani',
                email: 'maharani.ayu98@gmail.com',
                password: '12345678',
                role: 'merchant'
            })
            .end(() => {
                product.deleteMany({},
                    {new: true})
                    .exec(() => {
                        done()
                    })
            })
    })

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


    it('CREATE PRODUCT SHOULD SHOW OK', function(done) {

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
                id = res.body.result._id
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('CREATE PRODUCT THAT REQUIRED FIELD IS EMPTY SHOULD SHOW ERROR', function(done) {

        chai.request(server)
            .post('/product/create') 
            .send({
                productName: '',
                price: '120000',
                stock: '50',
                descripition: 'size S, M, L',
                category: 'anak'
            })
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })
    })

    
})

describe('Show Product', function () {

    it('Show all product shoul be ok', function(done) {

        chai.request(server)
            .get('/product/get-all') 
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

   it('SHOW ONE PRODUCT BY ID SHOULD BE OK', function() {

        chai.request(server)
            .get(`/product/one/${id}`)
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
            })            

    }) 

    it('SHOW ONE PRODUCT BY WRONG ID SHOULD BE ERROR', function() {

        chai.request(server)
            .get(`/product/one/${fakeId}`)
            .end(function(err, res) {
                expect(res).to.have.status(404)
                expect(res).to.be.an('object')
            })            

    })

    it('SHOW ONE PRODUCT BY CATEGORY SHOULD BE OK', function(done) {

        chai.request(server)
            .get(`/product/${category}`)
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })            

    })

})

describe('UPDATE PRODUCT', function () {

    it('update product shoul be ok', function(done) {

        chai.request(server)
            .put(`/product/update/${id}`)
            .set('Authorization', token)
            .send({
                quantity: "4"
            })
            .end(function(err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })


})

describe('DELETE PRODUCT', function () {

    it('DELETE product shoul be ok', function(done) {

        chai.request(server)
            .delete(`/product/deleteone/${id}`)
            .set('Authorization', token)
            .end(function(err, res) {
                console.log(res.body)
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })


})


