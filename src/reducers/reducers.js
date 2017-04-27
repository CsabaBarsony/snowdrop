const { combineReducers } = require('redux')
const todos = require('./todos.js')
const visibilityFilter = require('./visibility_filter.js')

const todoApp = combineReducers({
    todos,
    visibilityFilter
})

module.exports = todoApp
