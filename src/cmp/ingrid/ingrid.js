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
        this.model.ingredients.push(new Ingredient(food, 0, Unit.G, 0))
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

    const templateStringOld = `
            <ul class="cmp ingrid">
            {{#each ingredients}}
                <li data-index="{{@index}}">
                {{#if (editing @index)}}
                    <span>{{food.name}}</span>
                    <input type="text" value="{{amount}}" />
                    <select>
                    {{#each ../units}}
                        <option value="{{this}}">{{this}}</option>
                    {{/each}}    
                    </select>
                    <button class="save">save</button>
                    <button class="cancel">cancel</button>
                {{else}}
                    <span>{{food.name}}</span>
                    <span>{{amount}}</span>
                    <span>{{unit}}</span>
                    <button class="remove">remove</button>                
                {{/if}}
                </li>
            {{/each}}
            </ul>`

    Handlebars.registerHelper('editing', index => {
        return index === this.model.editingIngredientIndex
    })

    const template = Handlebars.compile(templateString)
    this.container.innerHTML = template(this.model)

    this.container.querySelectorAll('.save').forEach(b => { b.addEventListener('click', this.save.bind(this)) })
    this.container.querySelectorAll('.cancel').forEach(b => { b.addEventListener('click', this.cancel.bind(this)) })
    this.container.querySelectorAll('.remove').forEach(b => { b.addEventListener('click', this.remove.bind(this)) })
}

Ingrid.prototype.save = function(e) {
    const item = e.target.parentNode.parentNode
    const ingredient = this.model.ingredients[item.dataset.index]

    ingredient.amount = item.children[1].children[0].value
    ingredient.unit = item.children[2].children[0].value
    this.model.editingIngredientIndex = -1
    this.render()
    PubSub.publish(events.INGREDIENTS_CHANGE, this.model.ingredients)
}

Ingrid.prototype.cancel = function(e) {
    this.model.ingredients.splice(e.target.parentNode.dataset.index, 1)
    this.render()
}

Ingrid.prototype.remove = function(e) {
    this.model.ingredients.splice(e.target.parentNode.dataset.index, 1)
    this.render()
    PubSub.publish(events.INGREDIENTS_CHANGE, this.model.ingredients)
}

module.exports = Ingrid
