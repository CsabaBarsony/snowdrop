const { connect } = require('react-redux')
//const actions = require('../../actions.js')
const CounterIndicator = require('./counterIndicator.jsx')

const mapStateToProps = state => {
    return {
        counter: state.counter
    }
}

/*const mapDispatchToProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(actions.todo.toggle(id))
        }
    }
}*/

const Display = connect(
    mapStateToProps
)(CounterIndicator)

module.exports = Display
