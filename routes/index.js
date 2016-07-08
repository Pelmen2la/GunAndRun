'use strict';

module.exports = function (app) {
    require("./main")(app);
    require("./web")(app);
    require("./resources")(app);
};