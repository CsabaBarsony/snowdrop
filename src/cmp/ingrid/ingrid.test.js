/* global describe, xdescribe, it, xit, expect, beforeEach, afterEach, spyOn */

const Ingrid = require('./ingrid.js')
const Ingredient = require('../../food.js').Ingredient
const Food = require('../../food.js').Food
const Macros = require('../../food.js').Macros
const Nutrient = require('../../food.js').Nutrient
const NutrientType = require('../../food.js').NutrientType
const Unit = require('../../food.js').Unit
const PubSub = require('pubsub-js')
const events = require('../../events.js')

describe('Ingrid', () => {
    const container = document.createElement('div')

    let ingridInstance

    beforeEach(done => {
        const macros = new Macros(
            new Nutrient(NutrientType.CARBOHYDRATE, 10),
            new Nutrient(NutrientType.FAT, 20),
            new Nutrient(NutrientType.PROTEIN, 10)
        )

        const avocado = new Food('1', 'avocado', macros)
        const broccoli = new Food('2', 'broccoli', macros)
        const cheese = new Food('3', 'cheese', macros)

        const ingredients = [
            new Ingredient(avocado, 100, Unit.G),
            new Ingredient(broccoli, 100, Unit.G)
        ]

        ingridInstance = new Ingrid(container)
        ingridInstance.model.ingredients = ingredients

        PubSub.subscribe(events.FOOD_SELECT, () => { done() })
        PubSub.publish(events.FOOD_SELECT, cheese)
    })

    it('remove should remove the first ingredient', done => {
        container.querySelector('.ingrid tr[data-index="2"] .save').click()
        container.querySelector('.ingrid tr[data-index="0"] .remove').click()
        expect(ingridInstance.model.ingredients.length).toBe(2)
        expect(ingridInstance.model.ingredients[0].food.name).toBe('broccoli')
        expect(ingridInstance.model.ingredients[1].food.name).toBe('cheese')
        done()
    })

    it('remove should remove the last ingredient', done => {
        container.querySelector('.ingrid tr[data-index="2"] .save').click()
        container.querySelector('.ingrid tr[data-index="2"] .remove').click()
        expect(ingridInstance.model.ingredients.length).toBe(2)
        expect(ingridInstance.model.ingredients[0].food.name).toBe('avocado')
        expect(ingridInstance.model.ingredients[1].food.name).toBe('broccoli')
        done()
    })
})
