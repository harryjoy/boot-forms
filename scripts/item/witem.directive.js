(function() {
  'use strict';
  /**
   * <w-item ng-model="item" />
   * Directive for item details.
   * @author harsh.r
   */
  angular.module('wooterApp').directive('wItem', function () {
    return {
      templateUrl: 'scripts/item/witem.html',
      restrict: 'E',
      scope: {
        item: '=ngModel',
        isDetails: '=isDetails'
      }
    };
  });
})();
