/**
 * Service to handle file related tasks, like reading or writing from file.
 * @author harsh.r
 */
(function() {
  'use strict';
  angular.module('wooterApp.shared').service('FileServ', FileServ);
  FileServ.$inject = ['$http', '$q'];
  function FileServ($http, $q) {
    this.readFile = readFile;

    /**
     * Reading a file from disk. Make sure file is publically accessible.
     * @param  {String}   path     Url path of file.
     * @param  {Function} callback Callback to be executed with file contents.
     */
    function readFile(path, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();
      $http.get(path).success(function(data) {
        deferred.resolve(data);
        return cb();
      }).
      error(function(err) {
        deferred.reject(err);
        return cb(err);
      }.bind(this));
      return deferred.promise;
    }
  }
})();
