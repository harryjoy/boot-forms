(function() {
  'use strict';
  angular.module('wooterApp').filter('ItemFilter', ItemFilter);
  ItemFilter.$inject = ['$window'];
  function ItemFilter($window) {
    return function(dataArray, searchObj, propertyNames) {
      if (!dataArray) {
        return;
      } else if (!searchObj || !propertyNames) {
        return dataArray;
      } else {
        var term = searchObj.searchText.toLowerCase();
        return dataArray.filter(function(item) {
          var result = true;
          if (searchObj.selectedGender) {
            result = !(item.gender !== 'MF' && searchObj.selectedGender.value.indexOf(item.gender) === -1);
          }
          if (result) {
            if (searchObj.selectAgeRange) {
              if (searchObj.fromAge && searchObj.toAge) {
                result = (searchObj.fromAge <= item.age) && (item.age <= searchObj.toAge);
              }
            } else {
              if (searchObj.selectedAgeGroup) {
                var min = $window._.min(searchObj.selectedAgeGroup, function(ag) {
                  return getMinVal(ag.value);
                });
                var max = $window._.max(searchObj.selectedAgeGroup, function(ag) {
                  return getMaxVal(ag.value);
                });
                if (min.value && max.value){
                  var fromAge = getMinVal(min.value);
                  var toAge = getMaxVal(max.value);
                  result = (fromAge <= item.age) && (item.age <= toAge);
                }
              }  
            }
          }
          if (result && searchObj.selectedDistance) {
            result = !(searchObj.selectedDistance.value > item.distance);
          }
          if (result && term) {
            var termMatch = false;
            angular.forEach(propertyNames, function(name) {
              termMatch = termMatch || item[name].toLowerCase().indexOf(term) > -1;
            });
            result = result && termMatch;
          }
          return result;
        });
      }
    };

    function getMinVal(value) {
      if (value.indexOf('+') !== -1) { return 18; }
      if (value.indexOf('-') !== -1) {
        value = value.split('-')[0];
      }
      return parseInt(value, 10);
    }

    function getMaxVal(value) {
      if (value.indexOf('+') !== -1) { return Number.MAX_SAFE_INTEGER; }
      if (value.indexOf('-') !== -1) {
        value = value.split('-')[1];
      }
      return parseInt(value, 10);
    }
  }
})();