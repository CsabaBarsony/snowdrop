const Food = require('./food.js').Food
const Suggestion = require('./food.js').Suggestion
const Nutrients = require('./food.js').Nutrients
const Serving = require('./food.js').Serving
const bella = require('./bella.js')

const store = {
    getSuggestions: function(text, callback) {
        bella.ajax.get('/getSuggestions/' + text, (success, suggestions) => {
            if(success){
                callback(suggestions.map(suggestionData => {
                    return new Suggestion(
                        suggestionData.text,
                        suggestionData.id,
                        suggestionData.name
                    )
                }))
            }
            else console.error('Store ajax error')
        })
    },
    getFood: function(id, callback) {
        bella.ajax.get('/getFood/' + id, (success, foodData) => {
            if(success) {
                const servings = [
                    new Serving('g', 1, 1)
                ]

                foodData.servings.forEach(serving => {
                    servings.push(new Serving(serving.name, serving.amount, serving.gram))
                })

                callback(new Food(
                    foodData.id,
                    foodData.name,
                    foodData.description,
                    new Nutrients(
                        foodData.nutrients.ch,
                        foodData.nutrients.fat,
                        foodData.nutrients.protein,
                        foodData.nutrients.energy,
                        foodData.nutrients.mg,
                        foodData.nutrients.ca
                    ),
                    servings
                ))
            }
            else console.error('Store ajax error')
        })
    }
}

module.exports = store
