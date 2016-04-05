angular.module('hockeyPool')
.controller('NavCtrl', ['$scope', 'Auth', function($scope, Auth) {
    var vm = this;
    vm.signedIn = Auth.isAuthenticated;
}]);