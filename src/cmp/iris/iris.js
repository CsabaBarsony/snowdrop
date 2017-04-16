const React = require('react')

class Iris extends React.Component{
    render() {
        const displayServing = serving => (serving.amount !== 1 ? serving.amount : '') + serving.name

        const displayAmount = (amount, serving) => amount + ' ' +
            (serving.amount !== 1 ? serving.amount + ' ' : '') +
            serving.name +
            (serving.name !== 'g' ? ' (' + (serving.gram * amount) + 'g)' : '')

        const rows = this.props.ingredients.map((ingredient, index) => {
            const editingRow = this.props.editing && index === this.props.ingredients.length - 1

            if(editingRow) {
                const options = ingredient.food.servings.map((serving, index) =>
                    <option key={index} value={index}>{displayServing(serving)}</option>
                )

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
                            <button className="cancel" onClick={this.remove.bind(this)}>cancel</button>
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
                            <span>{displayAmount(ingredient.amount, ingredient.serving)}</span>
                        </td>
                        <td>
                            <button onClick={this.remove.bind(this, index)}>remove</button>
                        </td>
                    </tr>)
            }
        })

        const ingredientList = (
            <table className="cmp ingrid">
                <tbody>{rows}</tbody>
            </table>)

        return this.props.loading ? <div>loading...</div> : ingredientList
    }

    onSave(e) {
        const amount = parseInt(e.target.parentNode.parentNode.querySelector('input').value)
        const servingIndex = parseInt(e.target.parentNode.parentNode.querySelector('select').value)
        const ingredient = this.props.ingredients[this.props.ingredients.length - 1]
        const serving = ingredient.food.servings[servingIndex]
        
        this.props.edit(amount, serving)
    }

    remove(index) {
        this.props.remove(index)
    }
}

module.exports = Iris
