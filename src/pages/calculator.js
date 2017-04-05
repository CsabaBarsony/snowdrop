const app = require('../app.js')
const Sugar = require('../cmp/sugar/sugar.js')
const Ingrid = require('../cmp/ingrid/ingrid.js')
const Pie = require('../cmp/pie/pie.js')
const events = require('../events.js')
const Statechart = require('scion-core').Statechart

const actions = {
    input: {
        onEntry: () => {
            sugar.setAccess(true)
        }
    },
    empty: {
        onEntry: () => {
            pie.ingredientsChanged([])
        }
    },
    loading: {
        onEntry: event => {
            ingrid.selectFood(event.data)
        }
    },
    filled: {
        onEntry: event => {
            pie.ingredientsChanged(event.data)
        }
    }
}

const states = [
    {
        id: 'input',
        onEntry: actions.input.onEntry,
        transitions: [
            {
                event: 'select',
                target: 'loading'
            }
        ],
        states: [
            {
                id: 'empty',
                onEntry: actions.empty.onEntry
            },
            {
                id: 'filled',
                onEntry: actions.filled.onEntry,
                transitions: [
                    {
                        event: 'clear',
                        target: 'empty'
                    },
                    {
                        event: 'ready',
                        target: 'filled'
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
                event: 'ready',
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
