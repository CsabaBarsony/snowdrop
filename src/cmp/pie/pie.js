const Handlebars = require('handlebars')
const PubSub = require('pubsub-js')
const events = require('../../events.js')
const Macros = require('../../food.js').Macros
const Nutrient = require('../../food.js').Nutrient
const NutrientType = require('../../food.js').NutrientType

function Pie(container) {
    this.container = container
    this.model = {
        display: false,
        macros: null
    }

    PubSub.subscribe(events.INGREDIENTS_CHANGE, (e, ingredients) => {
        if(ingredients.length) {
            const macros = Pie.calculateMacros(ingredients)

            this.model = {
                display: true,
                macros: {
                    ch: macros.ch.amount,
                    fat: macros.fat.amount,
                    protein: macros.protein.amount
                }
            }
        }
        else {
            this.model = {
                display: false,
                macros: null
            }
        }

        this.render()
    })
}

Pie.prototype.render = function() {
    const templateString = `
    {{#if display}}
        <div>
            <div>ch: {{macros.ch}}</div>
            <div>fat: {{macros.fat}}</div>
            <div>protein: {{macros.protein}}</div>
        </div>
    {{/if}}`

    const template = Handlebars.compile(templateString)
    this.container.innerHTML = template(this.model)
}

Pie.calculateMacros = function(ingredients) {
    function convertToGram(ingredient) {
        // TODO
        return ingredient
    }

    let sumCh = 0
    let sumFat = 0
    let sumProtein = 0

    ingredients.forEach((ingredient) => {
        ingredient = convertToGram(ingredient)
        sumCh += ingredient.food.macros.ch.amount * ingredient.amount
        sumFat += ingredient.food.macros.fat.amount * ingredient.amount
        sumProtein += ingredient.food.macros.protein.amount * ingredient.amount
    })

    const sumMacros = sumCh + sumFat + sumProtein

    const ch = (sumCh / sumMacros * 100)
    const fat = (sumFat / sumMacros * 100)
    const protein = (sumProtein / sumMacros * 100)

    return new Macros(
        new Nutrient(NutrientType.CARBOHYDRATE, ch),
        new Nutrient(NutrientType.FAT, fat),
        new Nutrient(NutrientType.PROTEIN, protein)
    )
}

module.exports = Pie