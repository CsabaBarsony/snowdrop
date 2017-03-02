const PubSub = require('pubsub-js')
const Handlebars = require('handlebars')

function Candy(container, store) {
    this.container = container
    this.store = store
    this.model = {
        message: 'init',
        loading: false
    }

    this.render()
}

Candy.prototype.render = function() {
    const templateString = `
        <div class="cmp-candy">
        {{#if loading}}
            <div class="loading">loading...</div>
        {{else}}
            <button>Click me!</button>
            <div class="message">{{message}}</div>
        {{/if}}
        </div>`

    const template = Handlebars.compile(templateString)
    this.container.innerHTML = template(this.model)

    const button = this.container.querySelector('button')
    button && button.addEventListener('click', this.getMessage.bind(this))
}

Candy.prototype.getMessage = function() {
    this.model.loading = true
    this.render()

    this.store.getMessage(message => {
        PubSub.publish('message ready', message)
        this.model.loading = false
        this.model.message = message
        this.render()
    })
}

module.exports = Candy
