angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
  });
}])

.controller('View1Ctrl', [ '$scope', '$http', function ($scope, $http) {
  // scoped vars and functions
  $scope.createProvider = createProvider;
  $scope.provider = {};
  $http({ method: 'GET', url: '/data.json' }).success((data, status, headers, config) => {
    $scope.providers = data;
    console.log($scope.providers);
  });

  // function declarations
  function createProvider(form) {
    var blob = {};
    // TODO if this were real: probably create a filter to achieve the reordering we want
    var providersCopy = $scope.providers;
    blob.last_name = form.lastname;
    blob.first_name = form.firstname;
    blob.email_address = form.emailaddress;
    blob.specialty = form.specialtyname;
    blob.practice_name = form.practicename;

    // Reorder providers array
    $scope.providers = [blob];
    console.log($scope.providers);
    $scope.providers = $scope.providers.concat(providersCopy);
    console.log($scope.providers);
  }
}]);
