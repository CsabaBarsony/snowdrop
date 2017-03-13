const Handlebars = require('handlebars')
const PubSub = require('pubsub-js')
const events = require('../../events.js')
const Ingredient = require('../../food.js').Ingredient
const Unit = require('../../food.js').Unit

function Ingrid(container) {
    this.container = container
    this.model = {
        editingIngredientIndex: -1,
        ingredients: []
    }

    PubSub.subscribe(events.FOOD_SELECTED, (eventName, food) => {
        this.model.ingredients.push(new Ingredient(food, 0, Unit.G, 0))
        this.model.editingIngredientIndex = this.model.ingredients.length - 1
        this.render()
    })
}

Ingrid.prototype.render = function() {
    const templateString = `
        <ul>
        {{#each ingredients}}
            {{#if (editing @index)}}
                <strong>{{food.name}}</strong>
            {{else}}
                <li>{{food.name}}</li>
            {{/if}}
        {{/each}}
        </ul>
        `

    Handlebars.registerHelper('editing', index => {
        return index === this.model.editingIngredientIndex
    })

    const template = Handlebars.compile(templateString)
    this.container.innerHTML = template(this.model)
}

module.exports = Ingrid
