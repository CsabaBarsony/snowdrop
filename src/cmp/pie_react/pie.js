const Macros = require('./macros.js')
const React = require('react')

class Pie extends React.Component {
    componentDidMount() {
        this.updateCanvas();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.updateCanvas();
        }
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        const { canvas } = this.refs

        if(canvas) {
            var ctx = canvas.getContext('2d')
            var centerX = 100
            var centerY = 100
            var angleZeroX = 200
            var angleZeroY = 100
            var radius = 100
            var angleFat = parseFloat(canvas.dataset.fat) / 50
            var angleProtein = parseFloat(canvas.dataset.protein) / 50

            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
            ctx.fillStyle = '#588C7E'
            ctx.fill()
            ctx.closePath()

            ctx.fillStyle = '#F2E394'
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(angleZeroX, angleZeroY)
            ctx.arc(centerX, centerY, radius, 0, angleFat * Math.PI)
            ctx.closePath()
            ctx.fill()

            ctx.fillStyle = '#D96459'
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, angleFat * Math.PI, (angleFat + angleProtein) * Math.PI)
            ctx.fill()
            ctx.closePath()
        }
    }

    render() {
        const macros = calculateMacros(this.props.ingredients)

        const pie = (
            <div className="cmp pie">
                <canvas
                    ref="canvas"
                    width="200"
                    height="200"
                    data-ch={macros.ch}
                    data-fat={macros.fat}
                    data-protein={macros.protein}>
                </canvas>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="nutrient_marker b-color1"></div>
                            </td>
                            <td>carbohydrate: </td>
                            <td>{macros.ch}%</td>
                        </tr>
                        <tr>
                            <td>
                                <div className="nutrient_marker b-color2"></div>
                            </td>
                            <td>fat: </td>
                            <td>{macros.fat}%</td>
                        </tr>
                        <tr>
                            <td>
                                <div className="nutrient_marker b-color4"></div>
                            </td>
                            <td>protein: </td>
                            <td>{macros.protein}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>)

        return this.props.ingredients.length > 0 ? pie : null
    }
}

function calculateMacros(ingredients) {
    let sumCh = 0
    let sumFat = 0
    let sumProtein = 0

    ingredients.forEach((ingredient) => {
        sumCh += ingredient.amount * ingredient.serving.gram * ingredient.food.nutrients.ch.amount
        sumFat += ingredient.amount * ingredient.serving.gram * ingredient.food.nutrients.fat.amount
        sumProtein += ingredient.amount * ingredient.serving.gram * ingredient.food.nutrients.protein.amount
    })

    const sumMacros = sumCh + sumFat + sumProtein

    // Multiplication and division is used for the decimal round precision.
    const ch = Math.round(sumCh / sumMacros * 1000) / 10
    const fat = Math.round(sumFat / sumMacros * 1000) / 10
    const protein = Math.round(sumProtein / sumMacros * 1000) / 10

    return new Macros(ch, fat, protein)
}

module.exports = Pie
