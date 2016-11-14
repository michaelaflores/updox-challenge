angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
  });
}])

.controller('View1Ctrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
  // scope assignments
  $scope.createProvider = createProvider;
  $scope.deleteSelections = deleteSelections;
  $scope.selectProvider = selectProvider;
  $scope.selectedProviders = [];
  $scope.showDelete = false;
  $scope.sortBy = sortBy;

  // controller-scope vars
  var lastSort;
  var reverseSort = false;

  $http({ method: 'GET', url: '/data.json' }).success((data, status, headers, config) => {
    $scope.providers = data;
  });

  new Foundation.DropdownMenu(angular.element('#sort-dropdown'));

  $scope.$watch('selectedProviders', function(newValue, oldValue) {
    if ($scope.selectedProviders.length > 0) {
      $scope.showDelete = true;
    } else {
      $scope.showDelete = false;
    }
  }, true);

  // function declarations
  // Add a provider to the providers model
  function createProvider(form) {
    if (form === undefined) {
      return;
    }
    const blob = {};
    // TODO if this were real: probably create a filter to achieve the reordering we want
    const providersCopy = $scope.providers;
    blob.last_name = form.lastname;
    blob.first_name = form.firstname;
    blob.email_address = form.emailaddress;
    blob.specialty = form.specialtyname;
    blob.practice_name = form.practicename;

    // Reorder providers array
    $scope.providers = [blob];
    $scope.providers = $scope.providers.concat(providersCopy);
  }

  // Delete selected providers
  function deleteSelections() {
    let indexToRemove = -1;
    angular.forEach($scope.selectedProviders, function(index, value) {
      indexToRemove = $scope.selectedProviders.indexOf(index);
      if (indexToRemove > -1) {
        $scope.providers.splice(indexToRemove, 1);
        $scope.selectedProviders.splice(indexToRemove, 1);
      }
    });
  }

  // Alter UI to indicate selected providers, update selectedProviders model
  function selectProvider(index) {
    const $el = angular.element(`#provider-${  index}`);
    let indexToRemove = -1;
    const wasSelected = angular.element(`#provider-${  index}`).hasClass('provider-selected');
    if (!wasSelected) {
      $el.addClass('provider-selected');
      $scope.selectedProviders.push(index);
    } else {
      indexToRemove = $scope.selectedProviders.indexOf(index);
      if (indexToRemove > -1) {
        $scope.selectedProviders.splice(indexToRemove, 1);
      }
      $el.removeClass('provider-selected');
    }
  }

  function sortBy(field) {
    reverseSort = lastSort === field ? !reverseSort : false;
    $scope.providers = $filter('orderBy')($scope.providers, field, reverseSort);
    lastSort = field;
  }
}]);
