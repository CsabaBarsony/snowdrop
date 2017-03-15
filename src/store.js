const Food = require('./food.js').Food
const Nutrient = require('./food.js').Nutrient
const Macros = require('./food.js').Macros
const NutrientType = require('./food.js').NutrientType

const foodData = [{"id":"1","name":"cheese","nutrients":[{"type":"protein","amount":22.87},{"type":"fat","amount":33.31},{"type":"carbohydrate","amount":3.09}],"description":"","portion":null},{"id":"2","name":"cheese, edam","nutrients":[{"type":"protein","amount":24.99},{"type":"fat","amount":27.8},{"type":"carbohydrate","amount":1.43}],"description":"","portion":null},{"id":"3","name":"cheese, mozzarella","nutrients":[{"type":"protein","amount":21.6},{"type":"fat","amount":24.64},{"type":"carbohydrate","amount":2.47}],"description":"","portion":null},{"id":"4","name":"cheese, parmesan","nutrients":[{"type":"protein","amount":35.75},{"type":"fat","amount":25.83},{"type":"carbohydrate","amount":3.22}],"description":"","portion":null},{"id":"5","name":"fish, herring","nutrients":[{"type":"protein","amount":16.39},{"type":"fat","amount":13.88},{"type":"carbohydrate","amount":0}],"description":"","portion":null},{"id":"6","name":"fish, mackerel","nutrients":[{"type":"protein","amount":18.6},{"type":"fat","amount":13.89},{"type":"carbohydrate","amount":0}],"description":"","portion":null},{"id":"7","name":"fish, tuna","nutrients":[{"type":"protein","amount":23.33},{"type":"fat","amount":4.9},{"type":"carbohydrate","amount":0}],"description":"","portion":null},{"id":"9","name":"cocoa butter oil","nutrients":[{"type":"protein","amount":0},{"type":"fat","amount":100},{"type":"carbohydrate","amount":0}],"description":"","portion":null},{"id":"10","name":"sunflower oil","nutrients":[{"type":"protein","amount":0},{"type":"fat","amount":100},{"type":"carbohydrate","amount":0}],"description":"","portion":null},{"id":"11","name":"fat, duck","nutrients":[{"type":"protein","amount":0},{"type":"fat","amount":99.8},{"type":"carbohydrate","amount":0}],"description":"","portion":null},{"id":"12","name":"fat, goose","nutrients":[{"type":"protein","amount":0},{"type":"fat","amount":99.8},{"type":"carbohydrate","amount":0}],"description":"","portion":null},{"id":"13","name":"margarine","nutrients":[{"type":"protein","amount":0.16},{"type":"fat","amount":80.71},{"type":"carbohydrate","amount":0.7}],"description":"","portion":null}];

const store = {
    /**
     * @param {String} text
     * @param {function(Food[])} callback
     */
    getFoods: function(text, callback) {
        /** @type {Food[]} */
        const foods = [];

        foodData.forEach(food => {
            const macros = new Macros(
                new Nutrient(NutrientType.CARBOHYDRATE, food.nutrients[2].amount),
                new Nutrient(NutrientType.FAT, food.nutrients[1].amount),
                new Nutrient(NutrientType.PROTEIN, food.nutrients[0].amount)
            )

            if(new RegExp('^' + text, 'gi').test(food.name)) foods.push(new Food(food.id, food.name, macros));
        });

        setTimeout(() => {
            callback(foods)
        }, 100)
    }
}

module.exports = store
