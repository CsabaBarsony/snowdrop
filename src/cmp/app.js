const React = require('react')
const Footer = require('./footer.js')
const AddTodo = require('../cmp/containers/add_todo.js')
const VisibleTodoList = require('../cmp/containers/visible_todo_list.js')

const App = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
)

module.exports = App
