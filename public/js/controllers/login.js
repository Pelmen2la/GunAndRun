angular.module('gunAndRunApp.controllers')
    .controller('LoginController', ['$scope', '$http', function($scope, $http) {
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
                    window.playerData = $scope.playerData;
                } else {
                    $scope.activeError = $scope.loginErrors.loginExists;
                }
            });
        };
    }]);