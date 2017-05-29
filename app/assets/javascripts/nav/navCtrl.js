angular.module('hockeyPool')
.controller('NavCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {
    var vm = this;

    Auth.signedIn().then(function(data) {
        vm.signedIn = data.logged_in;
        vm.user = vm.signedIn ? data.user : null;
    });

    vm.logout = function() {
        Auth.logout().then(function() {
            $state.go('root.homepage');
        });
        vm.user = null;
    };
}]);
