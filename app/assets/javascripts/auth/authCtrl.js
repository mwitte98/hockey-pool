angular.module('hockeyPool')
.controller('AuthCtrl', ['$state', 'Auth', function($state, Auth) {
    var vm = this;
    
    vm.login = function() {
        Auth.login(vm.user).then(function() {
            $state.go('root.homepage');
        });
    };
    
    vm.register = function() {
        if (vm.user.password !== vm.user.confirm) {
            console.log('Password and confirm password not equal');
        }
        Auth.register(vm.user).then(function() {
            $state.go('root.homepage');
        });
    };
}]);