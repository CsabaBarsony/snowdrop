const app = require('../app.js')
const Sugar = require('../cmp/sugar/sugar.js')
const Ingrid = require('../cmp/ingrid/ingrid.js')
const Pie = require('../cmp/pie/pie.js')
const events = require('../events.js')
const Statechart = require('scion-core').Statechart

const actions = {
    input: {

    },
    loading: {
        onEntry: event => {
            ingrid.selectFood(event.data)
        }
    }
}

const states = [
    {
        id: 'input',
        onEntry: actions.input.onEntry,
        states: [
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
                id: 'filled',
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
    },
    {
        id: 'loading',
        onEntry: actions.loading.onEntry,
        transitions: [
            {
                event: 'load',
                target: 'editing'
            }
        ]
    },
    {
        id: 'editing',
        transitions: [
            {
                event: 'save',
                target: 'filled'
            },
            {
                event: 'cancel',
                target: 'filled'
            },
            {
                event: 'clear',
                target: 'empty'
            }
        ]
    }
]

const sc = new Statechart({ states: states }, { logStatesEnteredAndExited: true })
sc.start()

const sugar = new Sugar(document.getElementById('cont-sugar'), event => {
    sc.gen(event.name, event.data)
})

const ingrid = new Ingrid(document.getElementById('cont-ingrid'), event => {
    sc.gen(event.name, event.data)
})

const pie = new Pie(document.getElementById('cont-pie'))
