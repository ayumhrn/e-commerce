const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../../app');
const product = require('../../models/product')
const expect = chai.expect;
const fs = require('fs');

chai.use(chaiHttp);

var token, productId, 
    file = '/home/ayumhrn/Glint-task/MP_2/e_commerce2/public/images/profile.png'
, wrongfile = '/home/ayumhrn/Glint-task/MP_2/e_commerce2/app.js'

describe('UPLOAD FOTO', function() {
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
                pict: '',
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

    it('UPLOAD FOTO SHOULD SHOW OK', function (done) {

        chai.request(server)
            .post(`/upload/${productId}`)
            .attach('image', fs.readFileSync(`${file}`), 'profile.png')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })
})