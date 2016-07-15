angular.module('gunAndRunApp.controllers')
    .controller('MapController', ['$scope', '$http', function($scope, $http) {
        $scope.targetList = [];
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
                var features = feature.get('features'),
                    playersCount = features.length,
                    maxNameLength = Math.trunc(40 / playersCount),
                    namesLabel = feature.get('features').map(function(feature) {
                        return feature.playerData.name.substring(0, maxNameLength) + feature.playerData.hp;
                    }).join(',');
                var style = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: '/resources/icons/flags/small/' + features[0].playerData.country.demonym + '.png'
                    }),
                    text: new ol.style.Text({
                        text: namesLabel,
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
                        updateFeature(feature, playerData);
                    } else {
                        addPlayerFeature(playerData);
                    }
                }
            }
            $scope.source.refresh();
        });

        $scope.map.on('click', function(evt) {
            $scope.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                var features = feature.get('features');
                if(features.length == 1) {
                    shot(features[0].playerData);
                } else {
                    $scope.targetList = features.map(function(feature) {
                        return feature.playerData;
                    });
                }
            });
        });

        $scope.onTargetPopupClick = function(evt) {
            $scope.targetList = [];
        };

        function addPlayerFeature(playerData) {
            var feature = new ol.Feature();
            feature.setId(playerData.name);
            $scope.source.addFeature(feature);
            updateFeature(feature, playerData);
        };
        function updateFeature(feature, playerData) {
            feature.playerData = playerData;
            feature.setGeometry(new ol.geom.Point(ol.proj.transform([playerData.lng, playerData.lat], 'EPSG:4326', 'EPSG:900913')));
        };
        function shot(targetPlayerData) {
            $http({
                method: 'POST',
                url: '/game/shot/',
                data: {
                    targetPlayerName: targetPlayerData.name,
                    selectedWeaponName: $scope.playerData.selectedWeapon.name,
                    playerName: $scope.playerData.name,
                    key: $scope.playerData.key
                }
            }).then(function(response) {
                var playerData = response.data.playerData;
                if(playerData && playerData.key) {
                    var selectedWeapon = $scope.playerData.selectedWeapon || playerData.weaponList[0];
                    $scope.playerData = response.data.playerData;
                    $scope.playerData.selectedWeapon = selectedWeapon;
                }
                $scope.playersHash = response.data.playersHash || {};
            });
        };
    }]);