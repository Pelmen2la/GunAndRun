angular.module('gunAndRunApp.controllers')
    .controller('MapController', ['$scope', '$http', 'Utils', function($scope, $http, Utils) {
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
                    maxNameLength = Math.trunc(40 / playersCount);
                var style = new ol.style.Style({
                    image: new ol.style.Icon({
                        src:  getPlayersFeatureIconSrc(features)
                    }),
                    text: new ol.style.Text({
                        text: getPlayersFeatureLabel(features),
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

        var FLAG_IMAGE_ID_POSTFIX = 'FlagIcon';

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
        function getPlayersFeatureLabel(features) {
            var maxNameLength = Math.trunc(40 / features.length);
            return features.map(function(feature) {
                return feature.playerData.name.substring(0, maxNameLength) + feature.playerData.hp;
            }).join(',');
        };
        function getPlayersFeatureIconSrc(features) {
            var countries = {};
            features.forEach(function(feature) {
                var countryName = getPlayerFeatureCountryName(feature);
                if(!getFlagIconImage(countryName)) {
                    var flagImg = Utils.createElementFromString('<img src="' + getFlagIconUrl(countryName) +
                        '" id="' + getCountryFlagIconId(countryName) + '"/>');
                    document.getElementById('FlagsContainer').appendChild(flagImg);
                }
                countries[countryName] = countries[countryName] ? 1 : countries[countryName] + 1;
            });
            return getCountriesFlagImageSrc(countries);
        };
        function getCountriesFlagImageSrc(countries) {
            var countriesArr = [];
            for(key in countries) {
                if(countries.hasOwnProperty(key)) {
                    countriesArr.push({
                        name: key,
                        count: countries[key]
                    });
                }
            }
            countriesArr = countriesArr.sort(function(a, b) { return a.count - b.count }).slice(0, 8);
            var countriesFlagImageId = getCountriesFlagIconId(countriesArr),
                image = document.getElementById(countriesFlagImageId) || createCountriesImage(countriesArr);
            return image.src;
        };
        function createCountriesImage(countriesArr) {
            var iconPathWidth = 32,
                iconHeight = 21,
                canvas = document.getElementById('HelperCanvas'),
                ctx = canvas.getContext('2d'),
                image = new Image();
            if(countriesArr.length > 3) {
                iconPathWidth = iconPathWidth * 3 / countriesArr.length;
            }
            canvas.height = iconHeight;
            canvas.width = iconPathWidth * countriesArr.length;
            for(var country, i = 0; country = countriesArr[i]; i++) {
                image.src = getFlagIconUrl(country.name);
                ctx.drawImage(image, i * iconPathWidth, 0, (i + 1) * iconPathWidth, iconHeight);
            };
            var src = canvas.toDataURL('image/png'),
                img = Utils.createElementFromString('<img src="' + src + '" id="' + getCountriesFlagIconId(countriesArr) +'"/>');
            document.getElementById('FlagsContainer').appendChild(img);
            return img;
        };
        function getCountriesFlagIconId(countriesArr) {
            return countriesArr.map(function(country) {
                    return removeWhitespaces(country.name);
                }).join('') + FLAG_IMAGE_ID_POSTFIX;
        };
        function getCountryFlagIconId(countryName) {
            return removeWhitespaces(countryName) + FLAG_IMAGE_ID_POSTFIX;
        };
        function removeWhitespaces(s) {
            return s.replace(' ', '');
        };
        function getFlagIconImage(countryName) {
            return document.getElementById(getCountryFlagIconId(countryName));
        };
        function getPlayerFeatureCountryName(feature) {
            return feature.playerData.country.name.common;
        };
        function getFlagIconUrl(countryName) {
            return '/resources/icons/flags/small/' + countryName + '.png'
        };
    }]);