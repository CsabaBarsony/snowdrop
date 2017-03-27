/**
 * @param {Number} ch
 * @param {Number} fat
 * @param {Number} protein
 * @constructor
 */
function Nutrients(ch, fat, protein) {
    this.ch      = ch
    this.fat     = fat
    this.protein = protein
}

/**
 * @param {String}     id
 * @param {String}     name
 * @param {String}     description
 * @param {Nutrients}  nutrients
 * @param {Serving[]}  servings
 * @constructor
 */
function Food(id, name, description, nutrients, servings) {
    this.id          = id
    this.name        = name
    this.description = description
    this.nutrients   = nutrients
    this.servings    = servings
}

/**
 * @param {Food}    food
 * @param {Number}  amount
 * @param {Serving} serving
 * @constructor
 */
function Ingredient(food, amount, serving) {
    this.food    = food
    this.amount  = amount
    this.serving = serving
}

/**
 * @param {String} name
 * @param {Number} amount
 * @param {Number} gram
 * @constructor
 */
function Serving(name, amount, gram) {
    this.name   = name
    this.amount = amount
    this.gram   = gram
}

const food = {
    Nutrients:  Nutrients,
    Food:       Food,
    Ingredient: Ingredient,
    Serving:    Serving
}

module.exports = food
