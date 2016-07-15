'use strict';

var playersModule = require('app/players'),
    gameModule = require('app/game');

module.exports = function(app) {
    app.post('/login/', function(req, res, next) {
        res.json(playersModule.tryAddPlayer({
            name: req.body.name,
            country: req.body.country
        }));
    });

    app.post('/game/shot', function(req, res, next) {
        var data = req.body;
        res.json(gameModule.shot(data.playerName, data.key, data.targetPlayerName, data.selectedWeaponName));
    });

    app.get('/game/info', function(req, res, next) {
        res.json(gameModule.tryGetGameInfo(req.query.playerName, req.query.key));
    });
};