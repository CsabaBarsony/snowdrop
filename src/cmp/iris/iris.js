const React = require('react')

class Iris extends React.Component{
    constructor() {
        super()

        this.state = {
            loading: false,
            editingIngredientIndex: -1
        }
    }

    render() {
        const row = <tr></tr>

        const editingRow = <tr></tr>

        const ingredientList = (<table className="cmp ingrid">

        </table>)

        return this.state.loading ? <div>loading...</div> : ingredientList
    }

    save(e) {
        console.log(e.target)
    }
}

module.exports = Iris
