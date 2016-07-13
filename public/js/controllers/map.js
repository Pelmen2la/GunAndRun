angular.module('gunAndRunApp.controllers')
    .controller('MapController', ['$scope', function($scope) {
        $scope.raster = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        $scope.source = new ol.source.Vector({});
        $scope.clusterSource = new ol.source.Cluster({
            distance: 40,
            source: $scope.source
        });

        $scope.clusters = new ol.layer.Vector({
            source: $scope.clusterSource,
            style: function(feature) {
                var features = feature.get('features');
                style = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: '/resources/icons/flags/small/' + features[0].playerData.country.demonym + '.png'
                    }),
                    text: new ol.style.Text({
                        text: features[0].playerData.name,
                        offsetY: 20,
                        scale: 1.5
                    })
                });
                return style;
            }
        });

        $scope.map = new ol.Map({
            layers: [$scope.raster, $scope.clusters],
            target: 'MainMap',
            view: new ol.View({
                center: [0, 0],
                zoom: 2
            })
        });

        $scope.$parent.$watch('playersHash', function() {
            for(var key in $scope.$parent.playersHash) {
                if($scope.$parent.playersHash.hasOwnProperty(key)) {
                    var playerData = $scope.$parent.playersHash[key],
                        feature = $scope.source.getFeatureById(playerData.name);
                    if(feature) {
                        updateFeaturePosition(feature, playerData);
                    } else {
                        addPlayerFeature(playerData);
                    }
                }
            }
        });

        function addPlayerFeature(playerData) {
            var feature = new ol.Feature();
            feature.playerData = playerData;
            feature.setId(playerData.name);
            $scope.source.addFeature(feature);
            updateFeaturePosition(feature, playerData);
        }

        function updateFeaturePosition(feature, playerData) {
            feature.setGeometry(new ol.geom.Point(ol.proj.transform([playerData.lng, playerData.lat], 'EPSG:4326', 'EPSG:900913')));
        }
    }]);