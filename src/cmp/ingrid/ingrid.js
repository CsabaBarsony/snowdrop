const Handlebars = require('handlebars')
const PubSub = require('pubsub-js')
const events = require('../../events.js')
const Ingredient = require('../../food.js').Ingredient
const Serving = require('../../food.js').Serving
const store = require('../../store.js')

function Ingrid(container, publish) {
    this.container = container
    this.publish = publish
    this.model = {
        loading: false,
        editingIngredientIndex: -1,
        ingredients: []
    }
}

Ingrid.prototype.render = function() {
    const editingRow = `
        <tr data-index="{{@index}}">
            <td>
                <span>{{food.name}}</span>
            </td>
            <td>
                <input type="number" value="{{amount}}" />
                <select>
                {{#each food.servings}}
                    <option value="{{@index}}">{{displayServing this}}</option>
                {{/each}}    
                </select>
            </td>
            <td class="editing">
                <button class="save" data-index="{{@index}}">save</button>
                <button class="cancel">cancel</button>
            </td>
        </tr>`

    const row = `
        <tr data-index="{{@index}}">
            <td>
                <span>{{food.name}}</span>
            </td>
            <td>
                <span>{{displayAmount amount serving}}</span>
            </td>
            <td>
                <button class="remove">remove</button>                
            </td>
        </tr>`

    const table = `
        <table class="cmp ingrid">
        {{#each ingredients}}
            {{#if (editing @index)}}
                ${editingRow}
            {{else}}
                ${row}
            {{/if}}
        {{/each}}
        </table>`

    const templateString = `
        {{#if loading}}
            <div>loading...</div>
        {{else}}
            ${table}
        {{/if}}
    `

    Handlebars.registerHelper('editing', index => {
        return index === this.model.editingIngredientIndex
    })

    Handlebars.registerHelper('displayAmount', (amount, serving) => {
        return amount + ' ' +
            (serving.amount !== 1 ? serving.amount : '') +
            serving.name +
            (serving.name !== 'g' ? ' (' + (serving.gram * amount) + 'g)' : '')
    })

    Handlebars.registerHelper('displayServing', serving => {
        return (serving.amount !== 1 ? serving.amount : '') + serving.name
    })

    const template = Handlebars.compile(templateString)
    this.container.innerHTML = template(this.model)

    this.container.querySelectorAll('.save').forEach(saveButton => {
        saveButton.addEventListener('click', () => {
            const index = parseInt(saveButton.parentNode.parentNode.dataset.index)
            const ingredient = this.model.ingredients[index]
            const item = this.container.querySelector('[data-index="' + index + '"]')

            ingredient.amount = parseInt(item.querySelector('input').value)
            ingredient.serving = ingredient.food.servings[parseInt(item.querySelector('select').value)]
            this.model.editingIngredientIndex = -1
            this.render()
            this.publish({ name: 'ready', data: this.model.ingredients })
        })
    })

    this.container.querySelectorAll('.cancel').forEach(cancelButton => {
        cancelButton.addEventListener('click', () => {
            this.model.ingredients.splice(parseInt(cancelButton.parentNode.parentNode.dataset.index), 1)
            this.render()
            this.model.ingredients.length > 0 ? this.publish({ name: 'ready', data: this.model.ingredients }) : this.publish({ name: 'clear' })
        })
    })

    this.container.querySelectorAll('.remove').forEach(removeButton => {
        removeButton.addEventListener('click', () => {
            this.model.ingredients.splice(removeButton.parentNode.parentNode.dataset.index, 1)
            this.model.ingredients.length > 0 ? this.publish({ name: 'ready', data: this.model.ingredients }) : this.publish({ name: 'clear' })
            this.render()
        })
    })
}

Ingrid.prototype.selectFood = function(id) {
    this.model.loading = true
    this.render()

    store.getFood(id, food => {
        this.publish({ name: 'load', data: food })
        this.model.ingredients.push(new Ingredient(food, 1, new Serving('g', 1, 1)))
        this.model.editingIngredientIndex = this.model.ingredients.length - 1
        this.model.loading = false
        this.render()
        const index = this.model.editingIngredientIndex
        if(index > -1){
            const input = this.container.querySelector('[data-index="' + index + '"] input')
            input.focus()
            input.select()
        }
    })
}

module.exports = Ingrid
