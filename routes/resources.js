'use strict';

var utils = require('app/utils'),
    fs = require('fs'),
    path = require('path'),
    appDir = path.dirname(require.main.filename),
    SMALL_FLASGS_ICONS_PATH = '/public/resources/icons/flags/small/'

module.exports = function(app) {
    app.get('/country_list/', function(req, res, next) {
        utils.getCountryList(function(countryList) {
            res.json({
                    success: true,
                    countryList: countryList
            });
        });
    });

    app.get('/resources/icons/flags/small/:fileName', function(req, res, next) {
        fs.stat(path.join(appDir, SMALL_FLASGS_ICONS_PATH, req.params.fileName), function(err, stat) {
            if(err == null) {
                next();
            } else {
                res.sendFile(path.join(appDir, SMALL_FLASGS_ICONS_PATH, 'Unknown.png'));
            }
        });
    });
};