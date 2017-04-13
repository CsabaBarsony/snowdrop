const React = require('react')

class Iris extends React.Component{
    constructor() {
        super()

        this.state = {
            editingIngredientIndex: 0
        }
    }

    render() {
        const displayServing = serving => {
            return (serving.amount !== 1 ? serving.amount : '') + serving.name
        }

        const displayAmount = (amount, serving) => {
            return amount + ' ' +
                (serving.amount !== 1 ? serving.amount + ' ' : '') +
                serving.name +
                (serving.name !== 'g' ? ' (' + (serving.gram * amount) + 'g)' : '')
        }

        const rows = this.props.ingredients.map((ingredient, index) => {
            if(index === this.state.editingIngredientIndex) {
                const options = ingredient.food.servings.map((serving, index) => {
                    return <option key={index} value={index}>{displayServing(serving)}</option>
                })

                return (
                    <tr key={index} data-index={index}>
                        <td>
                            <span>{ingredient.food.name}</span>
                        </td>
                        <td>
                            <input type="number" defaultValue={ingredient.amount} autoFocus />
                            <select>{options}</select>
                        </td>
                        <td className="editing">
                            <button className="save" data-index={index} onClick={this.onSave.bind(this)}>save</button>
                            <button className="cancel" onClick={this.cancel.bind(this)}>cancel</button>
                        </td>
                    </tr>)
            }
            else {
                return (
                    <tr key={index} data-index={index}>
                        <td>
                            <span>{ingredient.food.name}</span>
                        </td>
                        <td>
                            <span>{displayAmount(ingredient.amount, ingredient.serving.amount)}</span>
                        </td>
                        <td>
                            <button className="remove">remove</button>
                        </td>
                    </tr>)
            }
        })

        const ingredientList = (<table className="cmp ingrid">
            <tbody>{rows}</tbody>
        </table>)

        return this.props.loading ? <div>loading...</div> : ingredientList
    }

    onSave(e) {
        const amount = parseInt(e.target.parentNode.parentNode.querySelector('input').value)
        const servingIndex = parseInt(e.target.parentNode.parentNode.querySelector('select').value)
        const ingredient = this.props.ingredients[this.state.editingIngredientIndex]
        const serving = ingredient.food.servings[servingIndex]
        
        this.props.editIngredient(this.state.editingIngredientIndex, amount, serving)
        this.setState({ editingIngredientIndex: -1 })
    }

    cancel(e) {
        var x = 0
    }
}

module.exports = Iris
