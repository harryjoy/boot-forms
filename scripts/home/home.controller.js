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
  HomeController.$inject = ['$scope', '$window', 'FileServ'];
  function HomeController($scope, $window, FileServ) {
    var origCoord = { latitude: 45, longitude: -73 };
    var vm = this;
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
      control: {},
      markerControl: {},
      center: origCoord,
      zoom: 8,
      markers: [],
      options: {
        streetViewControl: false,
        panControl: false,
        maxZoom: 20,
        minZoom: 3,
        // draggable: false
      },
      clusterOptions: {
        gridSize: 60,
        ignoreHidden: false,
        minimumClusterSize: 2
      },
      events: {
        zoom_changed: updateItemList,
        dragend: updateItemList
      }
    };

    vm.toggleAgeGroupSelection = function(selection) {
      vm.searchObj.selectAgeGroup = (selection === 1);
      vm.searchObj.selectAgeRange = (selection === 2);
    };

    $scope.$watch('home.filteredItems', function() {
      if (vm.filteredItems) {
        vm.map.markers.forEach(function(marker) {
          var match = false;
          vm.filteredItems.forEach(function(item) {
            if (item.id === marker.id) { match = true; }
          });
          marker.options.visible = match;
        });
        refreshMap();
      }
    }, true);

    init();

    function init() {
      FileServ.readFile('assets/conf/input.json').then(function(data){
        vm.items = data.items;
        vm.city = data.city;
        angular.forEach(data.items, function(item) {
          vm.map.markers.push({
            latitude: item.latlng[0],
            longitude: item.latlng[1],
            title: item.name,
            id: item.id,
            options: {
              visible: true,
              draggable: false
            }
          });
        });
      });
    }

    function refreshMap() {
      var map = vm.map.control.getGMap();
      var bounds = new $window.google.maps.LatLngBounds();
      vm.map.markers.forEach(function(marker) {
        if (marker.options.visible) {
          bounds.extend(getMarkerPosition(marker));
        }
      });
      map.fitBounds(bounds);
    }

    function getMarkerPosition(marker) {
      return {
        lat: function() { return marker.latitude; },
        lng: function() { return marker.longitude; }
      };
    }

    function updateItemList() {
      if (vm.map.control.getGMap) {
        var bounds = vm.map.control.getGMap().getBounds();
        var visibleMarkers = $window._.filter(vm.map.markers, function(marker) {
          return bounds.contains(getMarkerPosition(marker));
        });
        vm.filteredItems = $window._.filter(vm.items, function(item) {
          var isVisible = false;
          $window._.forEach(visibleMarkers, function(marker) {
            if (marker.id === item.id) { isVisible = true; }
          });
          return isVisible;
        });
      }
    }
  }
})();
