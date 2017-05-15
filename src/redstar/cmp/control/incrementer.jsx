const React = require('react')
const PropTypes = require('prop-types')

const Incrementer = ({ counter, onIncrementClick }) => (
    <div>
        <button onClick={
            () => {
                onIncrementClick(counter++)
            }
        }
        >Increment</button>
    </div>
)

Incrementer.propTypes = {
    counter: PropTypes.number.isRequired,
    onIncrementClick: PropTypes.func.isRequired
}

module.exports = Incrementer
