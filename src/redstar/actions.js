const actions = {
    increment: counter => {
        return {
            type: 'INCREMENT_COUNTER',
            counter: ++counter
        }
    }
}

module.exports = actions
