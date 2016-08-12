angular.module('gunAndRunApp.controllers')
    .controller('LoginController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
        $scope.loginErrors = {
            loginExists: 'loginExists'
        };

        $scope.tryToLogin = function() {
            $http({
                method: 'POST',
                url: '/login/',
                data: $scope.playerData
            }).then(function(response) {
                if(response.data.success) {
                    $scope.error = null;
                    $scope.$parent.playerData = response.data.playerData;
                    $scope.$parent.playerData.selectedWeapon = $scope.$parent.playerData.weaponList[0];
                    $cookies.putObject('playerData', response.data.playerData);
                } else {
                    $scope.activeError = $scope.loginErrors.loginExists;
                }
            });
        };
    }]);