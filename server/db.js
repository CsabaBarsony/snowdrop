'use strict';

const mysql = require('mysql');

const nutrientDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nutrient'
});

module.exports = {
    getFoodSuggestions: (text, callback) => {
        nutrientDB.query('select * from `enabled_food` where enabled_food.name like ?', [text + '%'], (error, rows) => {
            if(!error) {
                callback(true, rows.map(row => {
                    return row
                }))
            }
            else{
                callback(false)
            }
        })
    },

    getFood: (id, callback) => {
        // TODO
    }
};
