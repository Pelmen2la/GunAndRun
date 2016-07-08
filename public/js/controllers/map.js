angular.module('gunAndRunApp.controllers')
    .controller('MapController', ['$scope',
        function($scope) {
            var Map = function(containerName) {
                this.vectorSource = new ol.source.Vector({});
                this.vectorLayer = new ol.layer.Vector({
                    source: this.vectorSource
                });
                this.rasterLayer = new ol.layer.Tile({
                    source: new ol.source.OSM()
                });

                this.map = new ol.Map({
                    layers: [this.rasterLayer, this.vectorLayer],
                    target: document.getElementById(containerName),
                    view: new ol.View({
                        center: [0, 0],
                        zoom: 3,
                        minZoom: 3
                    })
                });
            };

            $scope.mainMap = new Map("MainMap");
        }]);