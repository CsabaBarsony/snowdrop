const app = require('../app.js')
const Sugar = require('../cmp/sugar/sugar.js')
const Ingrid = require('../cmp/ingrid/ingrid.js')
const Pie = require('../cmp/pie/pie.js')
const events = require('../events.js')
const Statechart = require('scion-core').Statechart

const states = [
    {
        id: 'empty',
        transitions: [
            {
                event: 'select',
                target: 'loading'
            }
        ]
    },
    {
        id: 'loading',
        onEntry: event => {
            ingrid.addIngredient(event.data)
        },
        transitions: [
            {
                event: 'load',
                target: 'filled'
            }
        ]
    },
    {
        id: 'filled',
        onEntry: event => {

        },
        transitions: [
            {
                event: 'clear',
                target: 'empty'
            },
            {
                event: 'select',
                target: 'loading'
            }
        ]
    }
]

const sc = new Statechart({ states: states }, { logStatesEnteredAndExited: true })
sc.start()

const sugar = new Sugar(document.getElementById('cont-sugar'), event => {
    sc.gen(event.name, event.data)
})

const ingrid = new Ingrid(document.getElementById('cont-ingrid'))

const pie = new Pie(document.getElementById('cont-pie'))
