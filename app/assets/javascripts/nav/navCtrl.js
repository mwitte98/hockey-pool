angular.module('hockeyPool')
.controller('NavCtrl', ['$scope', 'Auth', '$cookies', function($scope, Auth, $cookies) {
    var vm = this;
    vm.signedIn = Auth.isAuthenticated;
    vm.logout = function() {
        $cookies.remove('user');
        vm.user = null;
    };
    
    var user = $cookies.get('user');
    if (user) {
        vm.user = user;
    }
    
    $scope.$on('devise:new-registration', function(e, user) {
        $cookies.putObject('user', user);
        vm.user = user;
    });
    
    $scope.$on('devise:login', function(e, user) {
        $cookies.putObject('user', user);
        vm.user = user;
    });
    
    $scope.$on('devise:logout', function(e, user) {
        $cookies.remove('user');
        vm.user = null;
    });
}]);