(function() {
  'use strict';
  /**
   * <w-court ng-model="item" is-details="true" click-action="someActionToCallOnClick" />
   * Directive for item details.
   * @author harsh.r
   */
  angular.module('wooterApp').directive('wCourt', ['TimesArray', '$window', function (TimesArray, $window) {
    return {
      templateUrl: 'scripts/courts/wcourt.html',
      restrict: 'E',
      scope: {
        item: '=ngModel',
        isDetails: '=',
        clickAction: '='
      },
      link: function($scope) {
        $scope.times = TimesArray;
        $scope.minDate = new Date();
        $scope.searchObj = {
          date: new Date()
        };
        $scope.$watch('searchObj.date', function() {
          $scope.times.forEach(function(t) {
            t.selected = false;
          });
        }, true);
        $scope.mouseMoveOnOuter = function(event) {
          if ($scope.x) {
            var deltaX = $scope.x - event.clientX;
            if (deltaX > 0) {
              $scope.direction = 'left';
            } else {
              $scope.direction = 'right';
            }
          }
          $scope.x = event.clientX;
        };
        $scope.bookSlot = function(time) {
          if (!$scope.booking) { return; }
          if (time.booked) { $scope.booking = false; return; }
          var start = $window._.find(TimesArray, function(t) {
            return time.value === t.start;
          });
          var end = $window._.find(TimesArray, function(t) {
            return time.value < t.start;
          });
          if ($scope.direction) {
            if ($scope.direction === 'left') {
              if (!time.selected) {
                if (!$scope.searchObj.end) {
                  $scope.searchObj.end = end;
                }
                $scope.searchObj.start = start;
                time.selected = true;
              } else {
                $scope.searchObj.end = end;
                time.selected = false;
                TimesArray[time.index + 1].selected = false;
              }
            } else {
              if (!time.selected) {
                if (!$scope.searchObj.start) {
                  $scope.searchObj.start = start;
                }
                $scope.searchObj.end = end;
                time.selected = true;
              } else {
                $scope.searchObj.start = start;
                time.selected = false;
                TimesArray[time.index - 1].selected = false;
              }
            }
          } else {
            time.selected = true;
          }
        };
        $scope.startBooking = function() {
          $scope.times.forEach(function(t) {
            t.selected = false;
          });
          $scope.booking = true;
        };
      }
    };
  }]).directive('disableAnimation', function($animate){
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs){
        $attrs.$observe('disableAnimation', function(value){
          $animate.enabled(!value, $element);
        });
      }
    };
  });
})();
