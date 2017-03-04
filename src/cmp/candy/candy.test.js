/* global describe, xdescribe, it, xit, expect, beforeEach, afterEach, spyOn */

const Candy = require('./candy.js')

describe('Candy on button click', function() {
    const store = { getMessage: function() {} }
    const candy = new Candy(document.createElement('div'), store)

    it('should be loading', function() {
        candy.buttonClick()
        expect(candy.model.loading).toBeTruthy()
    })
})

describe('Candy after button click', function() {
    let candy, store

    beforeEach(function(done) {
        store = {
            getMessage: function(callback) {
                callback('you are a monkey')
                done()
            }
        }
        candy = new Candy(document.createElement('div'), store)
        candy.buttonClick()
    })

    it('should not be loading and show message', function(done) {
        expect(candy.model.loading).toBeFalsy()
        expect(candy.model.message).toBe('you are a monkey')
        done()
    })
})
