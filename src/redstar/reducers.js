const { combineReducers } = require('redux')

const counter = (state = [], action) => {
    switch (action.type) {
        case 'INCREMENT_COUNTER':
            return action.counter
        default:
            return state
    }
}

const todoApp = combineReducers({
    counter
})

module.exports = todoApp
