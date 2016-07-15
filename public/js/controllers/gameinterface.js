angular.module('gunAndRunApp.controllers')
    .controller('GameInterfaceController', ['$scope', '$http', function($scope, $http) {
        $scope.onWeaponItemClick = function(weapon) {
            $scope.$parent.playerData.selectedWeapon = weapon;
        };
        $scope.isActionVisible = function(action) {
            return Date.now() - action.date < 5 * 1000;
        }
    }]);