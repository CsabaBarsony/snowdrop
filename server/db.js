'use strict';

const mysql = require('mysql');

const nutrientDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nutrient'
});

module.exports = {
    getSuggestions: (text, callback) => {
        nutrientDB.query(
            `SELECT *
            FROM enabled_food
            WHERE enabled_food.name
            LIKE ?`,
            [text + '%'], (error, rows) => {
            if(!error) {
                callback(true, rows.map(row => {
                    return row
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
                `SELECT id, name, description
                FROM enabled_food
                WHERE id = ?`,
                [id],
                (error, rows) => {
                    if(!error) resolve(rows)
                    else reject(error)
                }
            )
        })

        const nutrientPromise = new Promise((resolve, reject) => {
            nutrientDB.query(
                `SELECT nutrient.nutrient_definition_id, nutrient.value
                FROM enabled_food
                JOIN nutrient
                ON nutrient.food_id = enabled_food.food_id
                WHERE enabled_food.id = ?`,
                [id],
                (error, rows) => {
                    if(!error) resolve(rows)
                    else reject(error)
                }
            )
        })

        const portionPromise = new Promise((resolve, reject) => {
            nutrientDB.query(
                `SELECT weight.description AS name, weight.amount, weight.gram
                FROM weight
                JOIN food
                ON weight.food_id = food.id
                JOIN enabled_food
                ON enabled_food.food_id = food.id
                WHERE enabled_food.id = ?`,
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
