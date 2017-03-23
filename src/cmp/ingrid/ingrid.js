const Handlebars = require('handlebars')
const PubSub = require('pubsub-js')
const events = require('../../events.js')
const Ingredient = require('../../food.js').Ingredient
const Unit = require('../../food.js').Unit

function Ingrid(container) {
    this.container = container
    this.model = {
        editingIngredientIndex: -1,
        ingredients: [],
        units: Object.keys(Unit).map(key => { return Unit[key] })
    }

    PubSub.subscribe(events.FOOD_SELECT, (eventName, food) => {
        this.model.ingredients.push(new Ingredient(food, 100, Unit.G, 0))
        this.model.editingIngredientIndex = this.model.ingredients.length - 1
        this.render()
        const index = this.model.editingIngredientIndex
        if(index > -1){
            const input = this.container.querySelector('[data-index="' + index + '"] input')
            input.focus()
            input.select()
        }
    })
}

Ingrid.prototype.render = function() {
    const templateString = `
        <table class="cmp ingrid">
        {{#each ingredients}}
            <tr data-index="{{@index}}">
            {{#if (editing @index)}}
                <td class="food_name">
                    <span>{{food.name}}</span>
                </td>
                <td class="amount">
                    <input type="text" value="{{amount}}" />
                </td>
                <td>
                    <select>
                    {{#each ../units}}
                        <option value="{{this}}">{{this}}</option>
                    {{/each}}    
                    </select>
                </td>
                <td>
                    <button class="save" data-index="{{@index}}">save</button>
                </td>
                <td>
                    <button class="cancel">cancel</button>
                </td>
            {{else}}
                <td class="food_name">
                    <span>{{food.name}}</span>
                </td>
                <td></td>
                <td></td>
                <td class="amount">
                    <span>{{amount}}{{unit}}</span>
                </td>
                <td>
                    <button class="remove">remove</button>                
                </td>
            {{/if}}
            </tr>
        {{/each}}
        </table>`

    Handlebars.registerHelper('editing', index => {
        return index === this.model.editingIngredientIndex
    })

    const template = Handlebars.compile(templateString)
    this.container.innerHTML = template(this.model)

    this.container.querySelectorAll('.save').forEach(saveButton => {
        saveButton.addEventListener('click', () => {
            const index = parseInt(saveButton.parentNode.parentNode.dataset.index)
            const ingredient = this.model.ingredients[index]
            const item = this.container.querySelector('[data-index="' + index + '"]')

            ingredient.amount = parseInt(item.querySelector('input').value)
            ingredient.unit = item.querySelector('select').value
            this.model.editingIngredientIndex = -1
            this.render()
            PubSub.publish(events.INGREDIENTS_CHANGE, this.model.ingredients)
        })
    })

    this.container.querySelectorAll('.cancel').forEach(cancelButton => {
        cancelButton.addEventListener('click', () => {
            this.model.ingredients.splice(parseInt(cancelButton.parentNode.parentNode.dataset.index), 1)
            this.render()
        })
    })

    this.container.querySelectorAll('.remove').forEach(removeButton => {
        removeButton.addEventListener('click', () => {
            this.model.ingredients.splice(removeButton.parentNode.parentNode.dataset.index, 1)
            this.render()
            PubSub.publish(events.INGREDIENTS_CHANGE, this.model.ingredients)
        })
    })
}

module.exports = Ingrid
