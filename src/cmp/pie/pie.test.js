/* global describe, xdescribe, it, xit, expect, beforeEach, afterEach, spyOn */

const Pie = require('./pie.js')
const PubSub = require('pubsub-js')
const events = require('../../events.js')
const Ingredient = require('../../food.js').Ingredient
const Food = require('../../food.js').Food
const Macros = require('../../food.js').Macros
const Nutrient = require('../../food.js').Nutrient
const NutrientType = require('../../food.js').NutrientType
const Unit = require('../../food.js').Unit

const macros = new Macros(
    new Nutrient(NutrientType.CARBOHYDRATE, 10),
    new Nutrient(NutrientType.FAT, 20),
    new Nutrient(NutrientType.PROTEIN, 10)
)

const macrosResult = new Macros(
    new Nutrient(NutrientType.CARBOHYDRATE, 25),
    new Nutrient(NutrientType.FAT, 50),
    new Nutrient(NutrientType.PROTEIN, 25)
)

const ingredients = [
    new Ingredient(new Food('1', 'avocado', macros), 100, Unit.G),
    new Ingredient(new Food('1', 'broccoli', macros), 100, Unit.G)
]

describe('Pie', () => {
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
        expect(Pie.calculateMacros(ingredients)).toEqual(macrosResult)
    })
})
