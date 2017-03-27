/* global describe, xdescribe, it, xit, expect, beforeEach, afterEach, spyOn */

const Pie = require('./pie.js')
const PubSub = require('pubsub-js')
const events = require('../../events.js')
const Ingredient = require('../../food.js').Ingredient
const Food = require('../../food.js').Food
const Nutrients = require('../../food.js').Nutrients
const Serving = require('../../food.js').Serving
const Macros = require('./macros.js')

const avocado = new Food('1', 'avocado', '', new Nutrients(10, 20, 10), [])
const broccoli = new Food('2', 'broccoli', '', new Nutrients(10, 20, 10), [])
const cheese = new Food('3', 'cheese', '', new Nutrients(10, 20, 10), [])

const ingredients = [
    new Ingredient(avocado, 10, new Serving('g', 1, 1)),
    new Ingredient(broccoli, 10, new Serving('g', 1, 1)),
    new Ingredient(cheese, 10, new Serving('g', 1, 1))
]

xdescribe('Pie', () => {
    let pie

    beforeEach(done => {
        pie = new Pie(document.createElement('div'))
        PubSub.subscribe(events.INGREDIENTS_CHANGE, () => { done() })
        PubSub.publish(events.INGREDIENTS_CHANGE, ingredients)
    })

    it('should', done => {
        expect(pie.model).toEqual({ display: true, macros: macrosResult })
        done()
    })
})

describe('Pie', () => {
    it('calculateMacros should calculate macros', () => {
        expect(Pie.calculateMacros(ingredients)).toEqual(new Macros(25, 50, 25))
    })
})
