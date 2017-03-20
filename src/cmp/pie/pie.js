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
        this.model = {
            display: ingredients.length > 0,
            macros: Pie.calculateMacros(ingredients)
        }

        this.render()
        this.drawPie()
    })
}

Pie.prototype.render = function() {
    const templateString = `
    {{#if display}}
        <div class="cmp pie">
            <canvas width="200" height="200"></canvas>
            <table>
                <tr>
                    <td>
                        <div class="nutrient_marker b-color1"></div>
                    </td>
                    <td>carbohydrate: </td>
                    <td>{{macros.ch.amount}}%</td>
                </tr>
                <tr>
                    <td>
                        <div class="nutrient_marker b-color2"></div>
                    </td>
                    <td>fat: </td>
                    <td>{{macros.fat.amount}}%</td>
                </tr>
                <tr>
                    <td>
                        <div class="nutrient_marker b-color4"></div>
                    </td>
                    <td>protein: </td>
                    <td>{{macros.protein.amount}}%</td>
                </tr>
            </table>
        </div>
    {{/if}}`

    const template = Handlebars.compile(templateString)
    this.container.innerHTML = template(this.model)
}

Pie.prototype.drawPie = function() {
    const canvas = this.container.querySelector('canvas')
    if(canvas) {
        var ctx = canvas.getContext('2d')
        var centerX = 100
        var centerY = 100
        var angleZeroX = 200
        var angleZeroY = 100
        var radius = 100
        var angleFat = this.model.macros.fat.amount / 50
        var angleProtein = this.model.macros.protein.amount / 50

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = '#588C7E'
        ctx.fill()
        ctx.closePath()

        ctx.fillStyle = '#F2E394'
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(angleZeroX, angleZeroY)
        ctx.arc(centerX, centerY, radius, 0, angleFat * Math.PI)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = '#D96459'
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, angleFat * Math.PI, (angleFat + angleProtein) * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
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

    const ch = Math.round(sumCh / sumMacros * 100)
    const fat = Math.round(sumFat / sumMacros * 100)
    const protein = Math.round(sumProtein / sumMacros * 100)

    return new Macros(
        new Nutrient(NutrientType.CARBOHYDRATE, ch),
        new Nutrient(NutrientType.FAT, fat),
        new Nutrient(NutrientType.PROTEIN, protein)
    )
}

module.exports = Pie
