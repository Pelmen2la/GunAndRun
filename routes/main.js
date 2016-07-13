'use strict';

var playersModule = require('app/players');

module.exports = function(app) {
    app.post('/login/', function(req, res, next) {
        res.json(playersModule.tryAddPlayer({
            name: req.body.name,
            country: req.body.country
        }));
    });

    app.get('/game/info', function(req, res, next) {
        res.json(playersModule.tryGetGameInfo(req.query.playerName, req.query.key));
    });
};