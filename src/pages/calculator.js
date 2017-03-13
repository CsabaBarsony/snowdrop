const Sugar = require('../cmp/sugar/sugar.js')
const Ingrid = require('../cmp/ingrid/ingrid.js')
const Suggestion = require('../cmp/sugar/suggestion.js')
const PubSub = require('pubsub-js');
const store = require('../store.js')

new Sugar(document.getElementById('cont-sugar'), (text, callback) => {
    store.getFoods(text, foods => {
        callback(foods.map(food => {
            return new Suggestion(food.name, food)
        }))
    })
})

new Ingrid(document.getElementById('cont-ingrid'))
