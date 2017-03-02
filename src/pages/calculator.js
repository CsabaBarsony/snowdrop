const Candy = require('../cmp/candy/candy.js')
const PubSub = require('pubsub-js');
const store = require('../store.js')

new Candy(document.getElementById('cont-candy'), store)

PubSub.subscribe('message ready', function(message, data) {
    console.log(data)
})
