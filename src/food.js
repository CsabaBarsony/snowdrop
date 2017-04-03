/**
 * @param {String} name
 * @param {Number} amount
 * @param {String} unit
 * @constructor
 */
function Nutrient(name, amount, unit) {
    this.name   = name
    this.amount = amount
    this.unit   = unit
}

/**
 * @param {Nutrient} ch
 * @param {Nutrient} fat
 * @param {Nutrient} protein
 * @param {Nutrient} energy
 * @param {Nutrient} mg
 * @param {Nutrient} ca
 * @constructor
 */
function Nutrients(ch, fat, protein, energy, mg, ca) {
    this.ch      = ch
    this.fat     = fat
    this.protein = protein
    this.energy  = energy
    this.mg      = mg
    this.ca      = ca
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

/**
 * @param {String} text
 * @param {String} id
 * @param {String} name
 * @constructor
 */
function Suggestion(text, id, name) {
    this.text = text
    this.id   = id
    this.name = name
}

const food = {
    Nutrients:  Nutrients,
    Food:       Food,
    Ingredient: Ingredient,
    Serving:    Serving,
    Suggestion: Suggestion
}

module.exports = food
