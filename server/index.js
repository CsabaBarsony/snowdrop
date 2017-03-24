'use strict';

const express = require('express');
const db = require('./db');
const portNumber = 3000;
const app = express();

app.use(express.static('public'));

app.get('/getFoodSuggestions/:text', function (req, res) {
    db.getFoodSuggestions(req.params.text, (success, foods) => {
        if(success) res.send(foods)
        else res.send(500)
    });
});

app.listen(portNumber, function () {
    console.log('App listening on port ' + portNumber + '...');
});
