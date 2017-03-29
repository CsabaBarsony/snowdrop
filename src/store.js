const Food = require('./food.js').Food
const Suggestion = require('./food.js').Suggestion
const Nutrients = require('./food.js').Nutrients
const Serving = require('./food.js').Serving
const bella = require('./bella.js')

const store = {
    getSuggestions: function(text, callback) {
        bella.ajax.get('/getSuggestions/' + text, (success, suggestions) => {
            if(success){
                callback(suggestions.map(data => {
                    const food = new Food(
                        data.id,
                        data.name,
                        data.description,
                        data.nutrients,
                        data.servings
                    )

                    return new Suggestion(data.name, food)
                }))
            }
            else console.error('Store ajax error')
        })
    },
    getFood: function(id, callback) {
        bella.ajax.get('/getFood/' + id, (success, foodData) => {
            if(success) {
                const nutrients = {}
                const servings = [
                    new Serving('g', 1, 1)
                ]

                foodData.nutrients.forEach(nutrient => {
                    switch (nutrient.nutrient_definition_id) {
                        case '203':
                            nutrients.protein = nutrient.value
                            break
                        case '204':
                            nutrients.fat = nutrient.value
                            break
                        case '205':
                            nutrients.ch = nutrient.value
                            break
                    }
                })

                foodData.servings.forEach(serving => {
                    servings.push(new Serving(serving.name, serving.amount, serving.gram))
                })

                callback(new Food(
                    foodData.id,
                    foodData.name,
                    foodData.description,
                    new Nutrients(nutrients.ch, nutrients.fat, nutrients.protein),
                    servings
                ))
            }
            else console.error('Store ajax error')
        })
    }
}

module.exports = store
