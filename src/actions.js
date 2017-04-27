const actions = {
    todo: {
        add: text => {
            return {
                type: 'ADD_TODO',
                id: nextTodoId++,
                text
            }
        },
        toggle: id => {
            return {
                type: 'TOGGLE_TODO',
                id
            }
        },
        setVisibility: filter => {
            return {
                type: 'SET_VISIBILITY_FILTER',
                filter
            }
        }
    }
}

module.exports = actions
