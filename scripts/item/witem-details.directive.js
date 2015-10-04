(function() {
  'use strict';
  /**
   * <w-item ng-model="item" />
   * Directive for item details.
   * @author harsh.r
   */
  angular.module('wooterApp').directive('wItemDetails', function () {
    return {
      templateUrl: 'scripts/item/witem-details.html',
      restrict: 'E',
      scope: {
        item: '=ngModel'
      }
    };
  });
})();
