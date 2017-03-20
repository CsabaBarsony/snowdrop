/* global describe, xdescribe, it, xit, expect, beforeEach, afterEach, spyOn */

const Ingrid = require('./ingrid.js')
const Ingredient = require('../../food.js').Ingredient
const Food = require('../../food.js').Food
const Macros = require('../../food.js').Macros
const Nutrient = require('../../food.js').Nutrient
const NutrientType = require('../../food.js').NutrientType
const Unit = require('../../food.js').Unit

describe('Ingrid', () => {
    let ingridInstance

    beforeEach(() => {
        const macros = new Macros(
            new Nutrient(NutrientType.CARBOHYDRATE, 10),
            new Nutrient(NutrientType.FAT, 20),
            new Nutrient(NutrientType.PROTEIN, 10)
        )

        const ingredients = [
            new Ingredient(new Food('1', 'avocado', macros), 100, Unit.G),
            new Ingredient(new Food('2', 'broccoli', macros), 100, Unit.G)
        ]

        ingridInstance = new Ingrid(document.createElement('div'))
        ingridInstance.model.ingredients = ingredients
    })

    it('remove should remove the first ingredient', () => {
        ingridInstance.remove(0)
        expect(ingridInstance.model.ingredients.length).toBe(1)
        expect(ingridInstance.model.ingredients[0].food.name).toBe('broccoli')
    })

    it('remove should remove the last ingredient', () => {
        ingridInstance.remove(1)
        expect(ingridInstance.model.ingredients.length).toBe(1)
        expect(ingridInstance.model.ingredients[0].food.name).toBe('avocado')
    })
})
