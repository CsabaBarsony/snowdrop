const React = require('react')

const Iris = React.createClass({
    getInitialState: function() {
        return {
            loading: false,
            editingIngredientIndex: -1
        }
    },
    render: function() {
        const row = <tr></tr>

        const editingRow = <tr></tr>

        const ingredientList = (<table className="cmp ingrid">

        </table>)

        return this.state.loading ? <div>loading...</div> : ingredientList
    },
    save: function(e) {
        console.log(e.target)
    }
})

module.exports = Iris
