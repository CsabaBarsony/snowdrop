const React = require('react')
const { render } = require('react-dom')
const { Provider } = require('react-redux')
const { createStore } = require('redux')
const reducers = require('./reducers.js')
const App = require('./cmp/app.jsx')

let store = createStore(reducers, {
    counter: 0
})

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('main')
)
