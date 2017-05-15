const { connect } = require('react-redux')
const actions = require('../../actions.js')
const Incrementer = require('./incrementer.jsx')

const mapStateToProps = state => {
    return state
}

const mapDispatchToProps = dispatch => {
    return {
        onIncrementClick: counter => {
            dispatch(actions.increment(counter))
        }
    }
}

const Display = connect(
    mapStateToProps,
    mapDispatchToProps
)(Incrementer)

module.exports = Display
