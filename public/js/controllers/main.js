angular.module('gunAndRunApp.controllers', []);

angular.module('gunAndRunApp.controllers')
    .controller('MainController', ['$scope', '$http', '$cookies', 'StringResources', 'Utils',
        function($scope, $http, $cookies, StringResources, Utils) {
            $scope.stringResources = StringResources;
            $scope.utils = Utils;
            $scope.allowedLanguages = ['eng', 'rus'];
            $scope.appLanguage = 'eng';
            $scope.playerData = $cookies.getObject('playerData') || {};
            $scope.playersHash = [];

            loadCountryList();

            window.setInterval(function() {
                $http({
                    method: 'GET',
                    url: '/game/info/',
                    params: {
                        playerName: $scope.playerData.name,
                        key: $scope.playerData.key
                    }
                }).then(function(response) {
                    var playerData = response.data.playerData;
                    if(playerData && playerData.key) {
                        $cookies.putObject('playerData', response.data.playerData);
                        var selectedWeapon = $scope.playerData.selectedWeapon || playerData.weaponList[0];
                        $scope.playerData = response.data.playerData;
                        $scope.playerData.selectedWeapon = selectedWeapon;
                    } else if($scope.playerData && $scope.playerData.key) {
                        $scope.playerData = {};
                        $cookies.putObject('playerData', {});
                    }
                    $scope.playersHash = response.data.playersHash || {};
                });
            }, 1000);

            $scope.changeLanguage = function(language) {
                $scope.appLanguage = language;
            };
            $scope.getText = function(mnemonic) {
                return $scope.stringResources[$scope.appLanguage][mnemonic];
            };
            $scope.getCountryName = function(country) {
                if(!country) {
                    return ''
                }
                return $scope.appLanguage === 'eng' ? country.name.common : country.translations[$scope.appLanguage].common;
            };
            $scope.filterCountryList = function(filterText) {
                return function(country) {
                    return $scope.getCountryName(country).toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) === 0;
                };
            };

            function loadCountryList() {
                $http({
                    method: 'GET',
                    url: '/country_list/',
                    data: {
                        language: $scope.appLanguage
                    }
                }).then(function(response) {
                    if(response.data.success) {
                        $scope.countryList = response.data.countryList;
                    } else {
                        loadCountryList();
                    }
                });
            }
        }]);