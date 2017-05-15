const React = require('react')
const PropTypes = require('prop-types')

const CounterIndicator = ({ counter }) => {
    return (
        <span>
            {counter}
        </span>
    )
}

CounterIndicator.propTypes = {
    counter: PropTypes.number.isRequired
}

module.exports = CounterIndicator
