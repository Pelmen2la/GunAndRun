angular.module('gunAndRunApp.services').service('Utils', function() {
    this.createElementFromString = function(html) {
        if(!this.container) {
            this.container = document.createElement('div');
        }
        this.container.innerHTML = html;
        return this.container.firstChild;
    };
});
