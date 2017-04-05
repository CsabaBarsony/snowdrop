const app = require('../app.js')
const Sugar = require('../cmp/sugar/sugar.js')
const Ingrid = require('../cmp/ingrid/ingrid.js')
const Pie = require('../cmp/pie/pie.js')
const events = require('../events.js')
const Statechart = require('scion-core').Statechart

const sugar = new Sugar(document.getElementById('cont-sugar'), (event, data) => {
    sc.gen(event, data)
})

const ingrid = new Ingrid(document.getElementById('cont-ingrid'), (event, data) => {
    sc.gen(event, data)
})

const pie = new Pie(document.getElementById('cont-pie'))

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
        onEntry: e => {
            ingrid.selectFood(e.data)
        }
    },
    filled: {
        onEntry: e => {
            pie.ingredientsChanged(e.data)
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
