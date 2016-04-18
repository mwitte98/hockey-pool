angular.module('hockeyPool')
.controller('HomepageCtrl', ['entries', function(entries) {
    var vm = this;
    vm.entries = entries;
    vm.isOpen = [];
    vm.showingAll = false;
    
    vm.showAll = function(show) {
        for (var i = 0; i < vm.entries.length; i++) {
            vm.isOpen[i] = show;
        }
        vm.showingAll = show;
    };
    
    vm.showAll(false);
}]);