'use strict';

var jsonfile = require('jsonfile'),
    countryListDataPath = appRoot + '\\node_modules\\world-countries\\dist\\countries.json';

module.exports = function(app) {
    app.get('/country_list/', function(req, res, next) {
        jsonfile.readFile(countryListDataPath, function(err, obj) {
            if(!err) {
                res.json({
                    success: true,
                    countryList: obj
                })
            } else {
                res.json({
                    success: false
                });
            }
        })

    });
};