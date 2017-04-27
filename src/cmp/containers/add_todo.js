const actions = require('../../actions.js')
const { connect } = require('react-redux')

let AddTodo = ({ dispatch }) => {
    let input

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault()
                if (!input.value.trim()) {
                    return
                }
                dispatch(actions.todo.add(input.value))
                input.value = ''
            }}>
                <input ref={node => {
                    input = node
                }} />
                <button type="submit">
                    Add Todo
                </button>
            </form>
        </div>
    )
}

AddTodo = connect()(AddTodo)

module.exports = AddTodo
