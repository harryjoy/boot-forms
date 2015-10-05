/**
 * @ngdoc function
 * @name wooterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Main home page controller of the wooterApp.
 * @author harsh.r
 */
(function() {
  'use strict';
  angular.module('wooterApp').controller('CourtsCtrl', CourtsController);
  CourtsController.$inject = ['$scope', '$window', 'FileServ', 'leafletEvents', 'leafletData', 'TimesArray'];
  function CourtsController($scope, $window, FileServ, leafletEvents, leafletData, TimesArray) {
    var vm = this, bounds = [], defaultOpacity = 0.5;
    vm.searchObj = {};
    vm.minDate = new Date();
    vm.datePickerOpened = false;

    vm.times = TimesArray;

    vm.map = {
      defaults: {
        maxZoom: 18,
        zoomControlPosition: 'topright',
        scrollWheelZoom: false,
        zoomAnimationThreshold: 6,
        zoomAnimation: true,
        markerZoomAnimation: true
      },
      center: {
        lat: 40.768452,
        lng: -73.832764,
        zoom: 11
      },
      markers: {}
    };

    vm.getDetails = function(item) {
      vm.selectedItem = item;
    };

    vm.clearFilters = function(item) {
      vm.searchObj = {};
    };

    init();

    function init() {
      FileServ.readFile('assets/conf/input2.json').then(function(data) {
        data.items.forEach(function(item, index) {
          item.createdAt = new Date();
          item.createdAt.setHours(index*2 + 6);
          item.date = $window.moment(item.createdAt).format('DD-MM-YYYY HH:mm');
        });
        vm.items = data.items;
        vm.city = data.city;
      });
      $scope.$on('leafletDirectiveMarker.click', function(event, obj) {
        vm.filteredItems.forEach(function(item) {
          if (item.id === obj.model.id) {
            vm.selectedItem = item;
            return;
          }
        });
      });
      $scope.$watch('courts.filteredItems', function() {
        if (vm.filteredItems && !vm.selectedItem) {
          vm.map.markers = {};
          bounds = [];
          angular.forEach(vm.filteredItems, function(item) {
            vm.map.markers[item.id] = {
              lat: item.latlng[0],
              lng: item.latlng[1],
              draggable: false,
              group: 'main',
              opacity: defaultOpacity,
              id: item.id,
              icon: {
                type: 'extraMarker',
                icon: 'fa-flag-checkered',
                markerColor: 'blue',
                prefix: 'fa',
                shape: 'square'
              }
            };
            bounds.push(item.latlng);
          });
          if (bounds.length > 0) {
            leafletData.getMap().then(function(map) {
              map.fitBounds(bounds, {animate: true});
            });
          }
        }
      }, true);
      $scope.$watch('courts.selectedItem', function() {
        var searchedBounds = [];
        if (vm.selectedItem) {
          $window._.forOwn(vm.map.markers, function(marker, id){
            if (vm.selectedItem.id === id) {
              marker.opacity = 1.0;
              vm.map.center.lat = marker.lat;
              vm.map.center.lng = marker.lng;
              searchedBounds.push([marker.lat, marker.lng]);
            } else {
              marker.opacity = 0.4;
            }
          });
        } else {
          if (Object.getOwnPropertyNames(vm.map.markers).length > 0) {
            $window._.forOwn(vm.map.markers, function(marker) {
              searchedBounds.push([marker.lat, marker.lng]);
              marker.opacity = defaultOpacity;
            });
          }
        }
        if (searchedBounds.length > 0) {
          leafletData.getMap().then(function(map) {
            map.fitBounds(searchedBounds, {animate: true});
          });
        }
      });
      $scope.$watch('courts.searchObj.start', function() {
        if (vm.searchObj.start) {
          if (!vm.searchObj.date) {
            vm.searchObj.date = new Date();
          }
          if (!vm.searchObj.end || vm.searchObj.end.value <= vm.searchObj.start.value) {
            vm.searchObj.end = $window._.find(TimesArray, function(time) {
              return time.value > vm.searchObj.start.value;
            });
          }
        }
      });
      $scope.$watch('courts.searchObj.end', function() {
        if (vm.searchObj.end) {
          if (!vm.searchObj.date) {
            vm.searchObj.date = new Date();
          }
          if (!vm.searchObj.start || vm.searchObj.start.value >= vm.searchObj.end.value) {
            vm.searchObj.start = $window._.findLast(TimesArray, function(time) {
              return time.value < vm.searchObj.end.value;
            });
          }
        }
      });
    }
  }

  angular.module('wooterApp').constant('TimesArray', [{
    name: '06:00 AM',
    value: 6,
    range: '06:00am - 06:30am'
  },{
    name: '06:30 AM',
    value: 6.5,
    range: '06:30am - 07:00am'
  },{
    name: '07:00 AM',
    value: 7,
    range: '07:00am - 07:30am'
  },{
    name: '07:30 AM',
    value: 7.5,
    range: '07:30am - 08:00am'
  },{
    name: '08:00 AM',
    value: 8,
    range: '08:00am - 08:30am'
  },{
    name: '08:30 AM',
    value: 8.5,
    range: '08:30am - 09:00am'
  },{
    name: '09:00 AM',
    value: 9,
    range: '09:00am - 09:30am'
  },{
    name: '09:30 AM',
    value: 9.5,
    range: '09:30am - 10:00am'
  },{
    name: '10:00 AM',
    value: 10,
    range: '10:00am - 10:30am'
  },{
    name: '10:30 AM',
    value: 10.5,
    range: '10:30am - 11:00am'
  },{
    name: '11:00 AM',
    value: 11,
    range: '11:00am - 11:30am'
  },{
    name: '11:30 AM',
    value: 11,
    range: '11:30am - 12:00pm'
  },{
    name: '12:00 PM',
    value: 12,
    range: '12:00pm - 12:30pm'
  },{
    name: '12:30 PM',
    value: 12.5,
    range: '12:30pm - 01:00pm'
  },{
    name: '01:00 PM',
    value: 13,
    range: '01:00pm - 01:30pm'
  },{
    name: '01:30 PM',
    value: 13.5,
    range: '01:30pm - 02:00pm'
  },{
    name: '02:00 PM',
    value: 14,
    range: '02:00pm - 02:30pm'
  },{
    name: '02:30 PM',
    value: 14.5,
    range: '02:30pm - 03:00pm'
  },{
    name: '03:00 PM',
    value: 15,
    range: '03:00pm - 03:30pm'
  },{
    name: '03:30 PM',
    value: 15.5,
    range: '03:30pm - 04:00pm'
  },{
    name: '04:00 PM',
    value: 16,
    range: '04:00pm - 04:30pm'
  },{
    name: '04:30 PM',
    value: 16.5,
    range: '04:30pm - 05:00pm'
  },{
    name: '05:00 PM',
    value: 17,
    range: '05:00pm - 05:30pm'
  },{
    name: '05:30 PM',
    value: 17.5,
    range: '05:30pm - 06:00pm'
  },{
    name: '06:00 PM',
    value: 18,
    range: '06:00pm - 06:30pm'
  },{
    name: '06:30 PM',
    value: 18.5,
    range: '06:30pm - 07:00pm'
  },{
    name: '07:00 PM',
    value: 19,
    range: '07:00pm - 07:30pm'
  },{
    name: '07:30 PM',
    value: 19.5,
    range: '07:30pm - 08:00pm'
  },{
    name: '08:00 PM',
    value: 20,
    range: '08:00pm - 08:30pm'
  },{
    name: '08:30 PM',
    value: 20.5,
    range: '08:30pm - 09:00pm',
    booked: true
  },{
    name: '09:00 PM',
    value: 21,
    range: '09:00pm - 09:30pm',
    booked: true
  },{
    name: '09:30 PM',
    value: 21.5,
    range: '09:30pm - 10:00pm',
    booked: true
  },{
    name: '10:00 PM',
    value: 22,
    range: '10:00pm - 10:30pm'
  },{
    name: '10:30 PM',
    value: 22.5,
    range: '10:30pm - 11:00pm'
  },{
    name: '11:00 PM',
    value: 23,
    range: '11:00pm - 11:30pm'
  },{
    name: '11:30 PM',
    value: 23.5,
    range: '11:30pm - 00:00am'
  }]);
})();
