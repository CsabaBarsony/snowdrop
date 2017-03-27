'use strict';

const express = require('express');
const db = require('./db');
const portNumber = 3000;
const app = express();

app.use(express.static('public'));

app.get('/getSuggestions/:text', (req, res) => {
    db.getSuggestions(req.params.text, (success, foods) => {
        if(success) res.send(foods)
        else res.sendStatus(500)
    });
});

app.get('/getFood/:id', (req, res) => {
    db.getFood(req.params.id, (success, food) => {
        if(success) res.send(food)
        else res.sendStatus(500)
    })
})

app.listen(portNumber, function () {
    console.log('App listening on port ' + portNumber + '...');
});
