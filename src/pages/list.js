const React = require('react')
const { render } = require('react-dom')
const { Provider } = require('react-redux')
const { createStore } = require('redux')
const todoApp = require('../reducers/reducers.js')
const App = require('../cmp/app.js')

let store = createStore(todoApp, {
    todos: [{ id: 0, text: 'majom vagy', completed: false }],
    visibilityFilter: 'SHOW_ALL'
})

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('main')
)
