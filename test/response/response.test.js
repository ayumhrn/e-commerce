const chai = require('chai')
const expect = chai.expect

const { successResponse, errorResponse } = require('../../helpers/response')

describe('Response Helpers', function() {

    before(() => 
        sampleData = {
            username: 'foo',
            email: 'foo.mail.com'
        },
        errSample = new Error()
    )

    it('Success response show OK', function() {

        var response = successResponse('success', sampleData)
        expect(response.success).to.be.true
        expect(response.result).to.be.a('object')

    })

    it('Error response show OK', function() {

        var response = errorResponse('failed', errSample)
        expect(response.success).to.be.false
        expect(response.result).to.be.a('error')

    })

})