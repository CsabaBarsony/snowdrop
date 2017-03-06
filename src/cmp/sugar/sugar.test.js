/* global describe, xdescribe, it, xit, expect, beforeEach, afterEach, spyOn */

const Sugar = require('./sugar.js')
const Suggestion = require('./suggestion.js')
const suggestions = [
    new Suggestion('c', 1),
    new Suggestion('c', 2),
    new Suggestion('c', 3)
]

let sugar

describe('Sugar entering input', () => {
    const onType = (text, callback) => {
        setTimeout(() => {
            callback(suggestions)
        }, 0)
    }

    sugar = new Sugar(document.createElement('div'), onType)
    sugar.focus()
    sugar.input({ target: { value: 'c' } })

    it('should be loading', () => {
        expect(sugar.model.loading).toBeTruthy()
    })
})

describe('Sugar after invoked onType', () => {
    beforeEach(done => {
        const onType = (text, callback) => {
            setTimeout(() => {
                callback(suggestions)
                done()
            }, 0)
        }

        sugar = new Sugar(document.createElement('div'), onType)

        sugar.focus()
        sugar.input({ target: { value: 'c' } })
    })

    it('should have suggestions', done => {
        expect(sugar.model.loading).not.toBeTruthy()
        expect(sugar.model.suggestions).toEqual(suggestions)
        done()
    })

    it('should select the first suggestion', done => {
        sugar.keydown({ key: 'ArrowDown' })

        expect(sugar.model.selectedIndex).toBe(0)
        done()
    })

    it('should select the second suggestion', done => {
        sugar.keydown({ key: 'ArrowDown' })
        sugar.keydown({ key: 'ArrowDown' })

        expect(sugar.model.selectedIndex).toBe(1)
        done()
    })

    it('should select the last suggestion', done => {
        sugar.keydown({ key: 'ArrowUp' })

        expect(sugar.model.selectedIndex).toBe(2)
        done()
    })
})
