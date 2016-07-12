'use strict';

var utils = require('app/utils');

module.exports = function(app) {
    app.get('/country_list/', function(req, res, next) {
        utils.getCountryList(function(countryList) {
            res.json({
                    success: true,
                    countryList: countryList
            });
        });
    });
};