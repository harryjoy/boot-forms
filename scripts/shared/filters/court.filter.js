(function() {
  'use strict';
  angular.module('wooterApp').filter('CourtFilter', CourtFilter);
  CourtFilter.$inject = ['$window'];
  function CourtFilter($window) {
    return function(dataArray, searchObj) {
      if (!dataArray) {
        return;
      } else if (!searchObj) {
        return dataArray;
      } else {
        return dataArray.filter(function(item) {
          var createdAt = $window.moment(item.createdAt);
          var result = true;
          if (searchObj.date) {
            var searchDate = $window.moment(searchObj.date);
            result = (createdAt.dayOfYear() === searchDate.dayOfYear()) && (createdAt.year() === searchDate.year());
          }
          if (result && searchObj.start && searchObj.end) {
            var startDate = $window.moment(new Date()), endDate = $window.moment(new Date());
            startDate = startDate.hour(parseInt(searchObj.start.value, 10));
            endDate = endDate.hour(parseInt(searchObj.end.value, 10));
            startDate = startDate.minute((startDate.hour() < searchObj.start.value) ? 30 : 0); 
            endDate = endDate.minute((endDate.hour() < searchObj.end.value) ? 30 : 59);
            result = (startDate.hour() <= createdAt.hour()) && (createdAt.hour() <= endDate.hour()) &&
              (startDate.minute() <= createdAt.minute()) && (createdAt.minute() <= endDate.minute());
          }
          return result;
        });
      }
    };
  }
})();