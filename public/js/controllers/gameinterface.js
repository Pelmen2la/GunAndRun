angular.module('gunAndRunApp.controllers')
    .controller('GameInterfaceController', ['$scope', '$http', function($scope, $http) {
        $scope.$on('showBonusContainer', showBonusContainer);

        $scope.onWeaponItemClick = function(weapon) {
            $scope.$parent.playerData.selectedWeapon = weapon;
        };
        $scope.onBonusContainerClick = function() {
            $http({
                method: 'POST',
                url: '/game/catchBonusContainer/',
                data: {
                    playerName: $scope.playerData.name,
                    key: $scope.playerData.key
                }
            }).then(function(response) {
            });
            $('#BonusContainer').hide();
        };

        $scope.isActionVisible = function(action) {
            return Date.now() - action.date < 5 * 1000;
        };

        function showBonusContainer() {
            if(!$scope.bonustItemTimeIntervalId) {
                var bonusItemTimer = 0,
                    $bonusContainer = $('#BonusContainer');
                $bonusContainer.show();
                $scope.bonusItemVisible = true;

                $scope.bonustItemTimeIntervalId = window.setInterval(function() {
                    var position = window.innerWidth / 10 / 1000 * bonusItemTimer;
                    $bonusContainer.css('left', position - $bonusContainer.height());
                    $bonusContainer.css('top', window.innerHeight / 2 + 150 * Math.sin(position * Math.PI / 180));
                    if(bonusItemTimer > 10000) {
                        $bonusContainer.hide();
                        window.clearInterval($scope.bonustItemTimeIntervalId);
                        $scope.bonustItemTimeIntervalId = null;
                    } else {
                        bonusItemTimer += 10;
                    }
                }, 10);
            }
        };
    }]);