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

    var ResetZoomControl = new $window.L.control();
    ResetZoomControl.setPosition('topright');
    ResetZoomControl.onAdd = function (map) {
      var className = 'leaflet-custom-control leaflet-bar reset-zoom-control-leaflet';
      var container = $window.L.DomUtil.create('div', className);
      $window.L.DomUtil.create('i', 'fa fa-undo fa-fw', container);
      $window.L.DomEvent.addListener(container, 'click', function() {
        map.setZoom(map.getZoom() - 5);
      });
      return container;
    };
    ResetZoomControl.submit = function(e) {
      $window.L.DomEvent.preventDefault(e);
    };

    vm.map = {
      defaults: {
        maxZoom: 18,
        zoomControlPosition: 'topleft',
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
      layers: {
        baselayers: {
          googleRoadmap: {
            name: 'Streets',
            layerType: 'ROADMAP',
            type: 'google'
          },
          // googleTerrain: {
          //   name: 'Terrain',
          //   layerType: 'TERRAIN',
          //   type: 'google'
          // },
          googleSatelliete: {
            name: 'Satellite',
            layerType: 'SATELLITE',
            type: 'google'
          },
          // googleHybrid: {
          //   name: 'Hybrid',
          //   layerType: 'HYBRID',
          //   type: 'google'
          // }
        },
      },
      controls: {
        custom: [ $window.L.control.locate({ follow: true }), ResetZoomControl ]
      },
      markers: {}
    };

    vm.getDetails = function(item) {
      vm.selectedItem = item;
    };

    vm.clearFilters = function() {
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
            makeMarkerCenter(true);
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
          searchedBounds = makeMarkerCenter();
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

    function makeMarkerCenter(doBounds) {
      var searchedBounds = [];
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
      if (doBounds && searchedBounds.length > 0) {
        leafletData.getMap().then(function(map) {
          map.fitBounds(searchedBounds, {animate: true});
        });
      }
      return searchedBounds;
    }
  }

  angular.module('wooterApp').constant('TimesArray', [{
    name: '06:00 AM',
    value: 6,
    range: '06:00am - 06:30am',
    start: 6,
    end: 6.5,
    index: 0
  },{
    name: '06:30 AM',
    value: 6.5,
    range: '06:30am - 07:00am',
    start: 6.5,
    end: 7,
    index: 1
  },{
    name: '07:00 AM',
    value: 7,
    range: '07:00am - 07:30am',
    start: 7,
    end: 7.5,
    index: 2
  },{
    name: '07:30 AM',
    value: 7.5,
    range: '07:30am - 08:00am',
    start: 7.5,
    end: 8,
    index: 3
  },{
    name: '08:00 AM',
    value: 8,
    range: '08:00am - 08:30am',
    start: 8,
    end: 8.5,
    index: 4
  },{
    name: '08:30 AM',
    value: 8.5,
    range: '08:30am - 09:00am',
    start: 8.5,
    end: 9,
    index: 5
  },{
    name: '09:00 AM',
    value: 9,
    range: '09:00am - 09:30am',
    start: 9,
    end: 9.5,
    index: 6
  },{
    name: '09:30 AM',
    value: 9.5,
    range: '09:30am - 10:00am',
    start: 9.5,
    end: 10,
    index: 7
  },{
    name: '10:00 AM',
    value: 10,
    range: '10:00am - 10:30am',
    start: 10,
    end: 10.5,
    index: 8
  },{
    name: '10:30 AM',
    value: 10.5,
    range: '10:30am - 11:00am',
    start: 10.5,
    end: 11,
    index: 9
  },{
    name: '11:00 AM',
    value: 11,
    range: '11:00am - 11:30am',
    start: 11,
    end: 11.5,
    index: 10
  },{
    name: '11:30 AM',
    value: 11.5,
    range: '11:30am - 12:00pm',
    start: 11.5,
    end: 12,
    index: 11
  },{
    name: '12:00 PM',
    value: 12,
    range: '12:00pm - 12:30pm',
    start: 12,
    end: 12.5,
    index: 12
  },{
    name: '12:30 PM',
    value: 12.5,
    range: '12:30pm - 01:00pm',
    start: 12.5,
    end: 13,
    index: 13
  },{
    name: '01:00 PM',
    value: 13,
    range: '01:00pm - 01:30pm',
    start: 13,
    end: 13.5,
    index: 14
  },{
    name: '01:30 PM',
    value: 13.5,
    range: '01:30pm - 02:00pm',
    start: 13.5,
    end: 14,
    index: 15
  },{
    name: '02:00 PM',
    value: 14,
    range: '02:00pm - 02:30pm',
    start: 14,
    end: 14.5,
    index: 16
  },{
    name: '02:30 PM',
    value: 14.5,
    range: '02:30pm - 03:00pm',
    start: 14.5,
    end: 15,
    index: 17
  },{
    name: '03:00 PM',
    value: 15,
    range: '03:00pm - 03:30pm',
    start: 15,
    end: 15.5,
    index: 18
  },{
    name: '03:30 PM',
    value: 15.5,
    range: '03:30pm - 04:00pm',
    start: 15.5,
    end: 16,
    index: 19
  },{
    name: '04:00 PM',
    value: 16,
    range: '04:00pm - 04:30pm',
    start: 16,
    end: 16.5,
    index: 20
  },{
    name: '04:30 PM',
    value: 16.5,
    range: '04:30pm - 05:00pm',
    start: 16.5,
    end: 17,
    index: 21
  },{
    name: '05:00 PM',
    value: 17,
    range: '05:00pm - 05:30pm',
    start: 17,
    end: 17.5,
    index: 22
  },{
    name: '05:30 PM',
    value: 17.5,
    range: '05:30pm - 06:00pm',
    start: 17.5,
    end: 18,
    index: 23
  },{
    name: '06:00 PM',
    value: 18,
    range: '06:00pm - 06:30pm',
    start: 18,
    end: 18.5,
    index: 24
  },{
    name: '06:30 PM',
    value: 18.5,
    range: '06:30pm - 07:00pm',
    start: 18.5,
    end: 19,
    index: 25
  },{
    name: '07:00 PM',
    value: 19,
    range: '07:00pm - 07:30pm',
    start: 19,
    end: 19.5,
    index: 26
  },{
    name: '07:30 PM',
    value: 19.5,
    range: '07:30pm - 08:00pm',
    start: 19.5,
    end: 20,
    index: 27
  },{
    name: '08:00 PM',
    value: 20,
    range: '08:00pm - 08:30pm',
    start: 20,
    end: 20.5,
    index: 28
  },{
    name: '08:30 PM',
    value: 20.5,
    range: '08:30pm - 09:00pm',
    booked: true,
    start: 20.5,
    end: 21,
    index: 29
  },{
    name: '09:00 PM',
    value: 21,
    range: '09:00pm - 09:30pm',
    booked: true,
    start: 21,
    end: 21.5,
    index: 30
  },{
    name: '09:30 PM',
    value: 21.5,
    range: '09:30pm - 10:00pm',
    booked: true,
    start: 21.5,
    end: 22,
    index: 31
  },{
    name: '10:00 PM',
    value: 22,
    range: '10:00pm - 10:30pm',
    start: 22,
    end: 22.5,
    index: 32
  },{
    name: '10:30 PM',
    value: 22.5,
    range: '10:30pm - 11:00pm',
    start: 22.5,
    end: 23,
    index: 33
  },{
    name: '11:00 PM',
    value: 23,
    range: '11:00pm - 11:30pm',
    start: 23,
    end: 23.5,
    index: 34
  },{
    name: '11:30 PM',
    value: 23.5,
    range: '11:30pm - 00:00am',
    start: 23.5,
    end: 24,
    index: 35
  }]);
})();
