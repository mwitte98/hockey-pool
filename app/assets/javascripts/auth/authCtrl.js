angular.module('hockeyPool')
.controller('AuthCtrl', ['$state', '$window', 'Auth', function($state, $window, Auth) {
    var vm = this;
    vm.errors = [];

    vm.login = function() {
        Auth.login(vm.user).then(function() {
            vm.errors = [];
            $state.go('root.homepage');
            $window.location.reload();
        })
        .catch(function(res) {
            vm.errors = res.data.errors;
        })
    };

    vm.register = function() {
        if (vm.user.password !== vm.user.confirm) {
            vm.errors = ['Password and confirm password not equal'];
        } else {
            Auth.register(vm.user).then(function() {
                vm.errors = [];
                $state.go('root.homepage');
                $window.location.reload();
            })
            .catch(function(res) {
                vm.errors = res.data.errors;
            });
        }
    };
}]);
