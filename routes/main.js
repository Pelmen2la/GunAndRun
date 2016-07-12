'use strict';

var playersModule = require('app/players');

module.exports = function(app) {
    app.post('/login/', function(req, res, next) {
        var name = req.body.name,
            country = req.body.country ? req.body.country.demonym : 'NoCountry';
        res.json(playersModule.tryAddPlayer(name, country));
    });
};