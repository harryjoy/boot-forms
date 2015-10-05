(function() {
  'use strict';
  /**
   * <w-court ng-model="item" is-details="true" click-action="someActionToCallOnClick" />
   * Directive for item details.
   * @author harsh.r
   */
  angular.module('wooterApp').directive('wCourt', ['TimesArray', function (TimesArray) {
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
        $scope.bookSlot = function(time) {
          if (time.booked) { return; }
          time.selected = !time.selected;
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
