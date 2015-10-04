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
  angular.module('wooterApp').controller('HomeCtrl', HomeController);
  HomeController.$inject = ['$scope', '$window', 'FileServ', 'leafletEvents', 'leafletData'];
  function HomeController($scope, $window, FileServ, leafletEvents, leafletData) {
    var vm = this, bounds = [], defaultOpacity = 0.5;
    vm.searchObj = {
      selectedGender: {
        name: 'Both',
        value: 'MF'
      },
      searchText: '',
      selectAgeGroup: true,
      selectAgeRange: false
    };

    vm.ageGroups = [{
      name: 'Kids (1-11)',
      value: '1-11'
    },{
      name: 'Youth (12-18)',
      value: '12-18'
    },{
      name: 'Adults (18+)',
      value: '18+'
    }];

    vm.genders = [{
      name: 'Male',
      value: 'M'
    },{
      name: 'Female',
      value: 'F'
    },{
      name: 'Both',
      value: 'MF'
    }];

    vm.distances = [{
      name: '2.5 miles',
      value: 2.5
    },{
      name: '5 miles',
      value: 5
    },{
      name: '10 miles',
      value: 10
    },{
      name: '25 miles',
      value: 25
    },{
      name: '50+ miles',
      value: 50
    }];

    vm.map = {
      defaults: {
        maxZoom: 18,
        zoomControlPosition: 'topright',
        scrollWheelZoom: false
      },
      center: {
        lat: 40.768452,
        lng: -73.832764,
        zoom: 11
      },
      markers: {}
    };

    vm.toggleAgeGroupSelection = function(selection) {
      vm.searchObj.selectAgeGroup = (selection === 1);
      vm.searchObj.selectAgeRange = (selection === 2);
    };

    init();

    function init() {
      FileServ.readFile('assets/conf/input.json').then(function(data){
        vm.items = data.items;
        vm.city = data.city;
      });
      $scope.$on('leafletDirectiveMarker.click', function(event, obj){
        vm.filteredItems.forEach(function(item) {
          if (item.id === obj.model.id) {
            vm.selectedItem = item;
            return;
          }
        });
      });
      $scope.$watch('home.filteredItems', function() {
        if (vm.filteredItems) {
          vm.map.markers = {};
          bounds = [];
          angular.forEach(vm.filteredItems, function(item) {
            vm.map.markers[item.id] = {
              lat: item.latlng[0],
              lng: item.latlng[1],
              draggable: false,
              group: 'main',
              opacity: defaultOpacity,
              id: item.id
            };
            bounds.push(item.latlng);
          });
          leafletData.getMap().then(function(map) {
            map.fitBounds(bounds);
          });
        }
      }, true);
      $scope.$watch('home.selectedItem', function() {
        var searchedBounds = [];
        if (vm.selectedItem) {
          $window._.forOwn(vm.map.markers, function(marker, id){
            if (vm.selectedItem.id === id) {
              marker.opacity = 1.0;
              vm.map.center.lat = marker.lat;
              vm.map.center.lng = marker.lng;
              searchedBounds.push([marker.lat, marker.lng]);
            } else {
              marker.opacity = 0.2;
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
            map.fitBounds(searchedBounds);
          });
        }
      });
    }
  }
})();
