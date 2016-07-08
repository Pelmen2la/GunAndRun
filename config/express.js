'use strict';

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.use('/bower_components', express.static(path.join(__dirname, '..', 'bower_components')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
};