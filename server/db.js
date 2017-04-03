'use strict';

const mysql = require('mysql');

const nutrientDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nutrient'
});

// values: usda, enabledFood
const dataSource = 'usda'

const queries = {
    usda: {
        getSuggestions: `SELECT id, long_description AS name
            FROM food
            WHERE long_description
            LIKE ?
            LIMIT 10`,
        getFood: `SELECT id, long_description AS name, short_description AS description
            FROM food
            WHERE id = ?`,
        getNutrients: `SELECT nutrient.nutrient_definition_id AS id, nutrient_definition.description AS name, nutrient.value AS amount, nutrient_definition.unit
            FROM food
            JOIN nutrient
            ON nutrient.food_id = food.id
            JOIN nutrient_definition
            ON nutrient.nutrient_definition_id = nutrient_definition.id
            WHERE food.id = ?`,
        getPortions: `SELECT weight.description AS name, weight.amount, weight.gram
            FROM weight
            JOIN food
            ON weight.food_id = food.id
            WHERE food.id = ?`
    },
    enabledFood: {
        getSuggestions: `SELECT id, name
            FROM enabled_food
            WHERE name
            LIKE ?
            LIMIT 10`,
        getFood: `SELECT id, name, description
            FROM enabled_food
            WHERE id = ?`,
        getNutrients: `SELECT nutrient.nutrient_definition_id, nutrient.value
            FROM enabled_food
            JOIN nutrient
            ON nutrient.food_id = enabled_food.food_id
            WHERE enabled_food.id = ?`,
        getPortions: `SELECT weight.description AS name, weight.amount, weight.gram
            FROM weight
            JOIN food
            ON weight.food_id = food.id
            JOIN enabled_food
            ON enabled_food.food_id = food.id
            WHERE enabled_food.id = ?`
    }
}

module.exports = {
    getSuggestions: (text, callback) => {
        nutrientDB.query(
            queries[dataSource].getSuggestions,
            [text + '%'], (error, rows) => {
                if(!error) {
                    callback(true, rows.map(row => {
                        return {
                            text: text,
                            id: row.id,
                            name: row.name
                        }
                    }))
                }
                else {
                    console.log(error)
                    callback(false)
                }
        })
    },

    getFood: (id, callback) => {
        const foodPromise = new Promise((resolve, reject) => {
            nutrientDB.query(
                queries[dataSource].getFood,
                [id],
                (error, rows) => {
                    if(!error) resolve(rows)
                    else reject(error)
                }
            )
        })

        const nutrientPromise = new Promise((resolve, reject) => {
            nutrientDB.query(
                queries[dataSource].getNutrients,
                [id],
                (error, rows) => {
                    const nutrients = {}

                    rows.forEach(row => {
                        const nutrient = {
                            amount: row.amount,
                            unit: row.unit
                        }

                        switch (row.id) {
                            case '203':
                                nutrient.name = 'protein'
                                nutrients.protein = nutrient
                                break
                            case '204':
                                nutrient.name = 'fat'
                                nutrients.fat = nutrient
                                break
                            case '205':
                                nutrient.name = 'ch'
                                nutrients.ch = nutrient
                                break
                            case '208':
                                nutrient.name = 'energy'
                                nutrients.energy = nutrient
                                break
                            case '301':
                                nutrient.name = 'ca'
                                nutrients.ca = nutrient
                                break
                            case '304':
                                nutrient.name = 'mg'
                                nutrients.mg = nutrient
                                break
                        }
                    })

                    if(!error) resolve(nutrients)
                    else reject(error)
                }
            )
        })

        const portionPromise = new Promise((resolve, reject) => {
            nutrientDB.query(
                queries[dataSource].getPortions,
                [id],
                (error, rows) => {
                    if(!error) resolve(rows)
                    else reject(error)
                }
            )
        })

        Promise.all([foodPromise, nutrientPromise, portionPromise]).then(values => {
            const food = values[0][0]

            callback(true, {
                id: food.id,
                name: food.name,
                description: food.description,
                nutrients: values[1],
                servings: values[2]
            })
        }).catch(reason => {
            callback(false, reason)
        })
    }
};
