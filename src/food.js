/**
 * @param {NutrientType} type
 * @param {Number}       amount
 * @constructor
 */
function Nutrient(type, amount) {
    this.type   = type
    this.amount = amount
}

/**
 * @param {Nutrient} ch
 * @param {Nutrient} fat
 * @param {Nutrient} protein
 * @constructor
 */
function Macros(ch, fat, protein) {
    this.ch      = ch
    this.fat     = fat
    this.protein = protein
}

/**
 * @param {String}     id
 * @param {String}     name
 * @param {Macros}     macros
 * @param {Nutrient[]} [nutrients]
 * @param {String}     [description]
 * @param {Portion}    [portion]
 * @constructor
 */
function Food(id, name, macros, nutrients = [], description = '', portion = null) {
    this.id          = id
    this.name        = name
    this.macros      = macros
    this.nutrients   = nutrients
    this.description = description
    this.portion     = portion
}

/**
 * @param {Food}   food
 * @param {Number} amount - Amount of units.
 * @param {Unit}   unit
 * @param {Number} [grams]
 * @constructor
 */
function Ingredient(food, amount, unit, grams = 0) {
    this.food   = food
    this.amount = amount
    this.unit   = unit
    this.grams  = grams
}

/**
 * @param {String}       title
 * @param {MealType}     mealType
 * @param {Ingredient[]} ingredients
 * @constructor
 */
function Meal(title, mealType, ingredients) {
    this.title       = title
    this.mealType    = mealType
    this.ingredients = ingredients
}

/**
 * @param {String} name
 * @param {Number} amount
 * @param {Number} grams
 * @constructor
 */
function Portion(name, amount, grams) {
    this.name   = name
    this.amount = amount
    this.grams  = grams
}

/**
 * @enum
 */
const NutrientType = {
    PROTEIN:      'protein',
    FAT:          'fat',
    CARBOHYDRATE: 'carbohydrate',
    ENERGY:       'energy',
    STARCH:       'starch',
    GLUCOSE:      'glucose',
    FRUCTOSE:     'fructose',
    WATER:        'water',
    ALCOHOL:      'alcohol',
    SUGAR:        'sugar'
}

/**
 * @enum
 */
const MealType = {
    BREAKFAST: 'breakfast',
    LUNCH:     'lunch',
    DINNER:    'dinner',
    SNACK:     'snack'
}

/**
 * @enum
 */
const Unit = {
    G:    'g',
    FL:   'fl',
    OZ:   'oz',
    TSP:  'tsp',
    TBSP: 'tbsp',
    CUP:  'cup'
}

const food = {
    Nutrient:     Nutrient,
    Macros:       Macros,
    Food:         Food,
    Ingredient:   Ingredient,
    Meal:         Meal,
    Portion:      Portion,
    NutrientType: NutrientType,
    MealType:     MealType,
    Unit:         Unit
}

module.exports = food
