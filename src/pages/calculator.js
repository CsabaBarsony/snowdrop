const Sugar = require('../cmp/sugar/sugar.js')
const Ingrid = require('../cmp/ingrid/ingrid.js')
const Pie = require('../cmp/pie/pie.js')
const Suggestion = require('../cmp/sugar/suggestion.js')
const store = require('../store.js')
const PubSub = require('pubsub-js')
const events = require('../events.js')
const bella = require('../bella.js')

new Sugar(document.getElementById('cont-sugar'), (text, callback) => {
    store.getSuggestions(text, callback)
})

new Ingrid(document.getElementById('cont-ingrid'))

new Pie(document.getElementById('cont-pie'))
