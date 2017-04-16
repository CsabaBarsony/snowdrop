const app = require('../app.js')
const store = require('../store.js')
const Sugar = require('../cmp/sugar_react/sugar.js')
const Ingrid = require('../cmp/ingrid/ingrid.js')
const Pie = require('../cmp/pie/pie.js')
const events = require('../events.js')
const Statechart = require('scion-core').Statechart
const React = require('react')
const ReactDOM = require('react-dom')
const Iris = require('../cmp/iris/iris.js')
const Ingredient = require('../food.js').Ingredient
const Serving = require('../food.js').Serving
const update = require('immutability-helper')

class Calculator extends React.Component{
    constructor() {
        super()

        this.state = {
            ingredients: [],
            loading: false,
            editing: false
        }
    }

    render() {
        return (
            <div>
                <Sugar
                    foodSelect={this.onFoodSelect.bind(this)}
                    foodLoad={this.onFoodLoad.bind(this)} />
                <Iris
                    ingredients={this.state.ingredients}
                    loading={this.state.loading}
                    editing={this.state.editing}
                    edit={this.onEditIngredient.bind(this)}
                    remove={this.onRemoveIngredient.bind(this)} />
            </div>)
    }

    onFoodSelect() {
        this.setState({
            foodSearchEnabled: false,
            loading: true
        })
    }

    onFoodLoad(food) {
        this.setState({
            ingredients: [...this.state.ingredients, new Ingredient(food, 1, new Serving('g', 1, 1))],
            loading: false,
            editing: true
        })
    }

    onEditIngredient(amount, serving) {
        this.setState({
            editing: false,
            ingredients: update(this.state.ingredients, {[this.state.ingredients.length - 1]: {
                amount: {
                    $set: amount
                },
                serving: {
                    $set: serving
                }
            }})
        })
    }

    onRemoveIngredient(index) {
        this.setState({
            ingredients: update(this.state.ingredients, { $splice: [[index, 1]] })
        })
    }
}

/*const actions = {
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

const sc = new Statechart({ states: states }, { logStatesEnteredAndExited: false })

sc.start()

const sugar = new Sugar(document.getElementById('cont-sugar'), (event, data) => {
    sc.gen(event, data)
})

const ingrid = new Ingrid(document.getElementById('cont-ingrid'), (event, data) => {
    sc.gen(event, data)
})

const pie = new Pie(document.getElementById('cont-pie'))*/

ReactDOM.render(<Calculator />, document.getElementById('cont-calculator'))
