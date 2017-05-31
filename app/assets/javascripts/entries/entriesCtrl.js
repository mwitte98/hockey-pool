angular.module('hockeyPool')
.controller('EntriesCtrl', ['$scope', 'Entries', 'teams', 'entries', function($scope, Entries, teams, entries) {
    var vm = this;
    vm.teams = teams;
    vm.entries = entries;
    vm.isCreateForm = false;
    vm.createFormErrors = [];
    vm.isEditForm = [];
    vm.editFormErrors = [];
    for (var i = 0; i < vm.entries.length; i++) {
        vm.isEditForm[i] = false;
        vm.editFormErrors.push([]);
    }
    vm.playersSelected = [];
    for (var j = 0; j < vm.teams.length; j++) {
        vm.playersSelected[j] = '';
    }
    vm.numPositions = {
        'Center': 0,
        'Winger': 0,
        'Defenseman': 0,
        'Goalie': 0
    };

    $scope.$watchCollection(angular.bind(this, function() {
        return this.playersSelected;
    }), function() {
        vm.numPositions = {
            'Center': 0,
            'Winger': 0,
            'Defenseman': 0,
            'Goalie': 0
        };
        vm.playersSelected.forEach(function(player) {
            if (player) { vm.numPositions[player.position] += 1; }
        });
    });

    vm.createEntry = function() {
        vm.createFormErrors = [];
        if (!vm.name || vm.name === '') {
            vm.createFormErrors.push('Invalid entry name');
        }
        for (var a = 0; a < vm.teams.length; a++) {
            if (vm.playersSelected[a] === '') {
                vm.createFormErrors.push(vm.teams[a].name + ' does not have a valid player selected');
            }
        }

        if (vm.numPositions.Center < 4 ||
            vm.numPositions.Winger < 4 ||
            vm.numPositions.Defenseman < 5 ||
            vm.numPositions.Goalie !== 2) {
                vm.createFormErrors.push('Invalid number of players at each position');
            }

        if (vm.createFormErrors.length > 0) return;

        var playerIds = [];
        vm.playersSelected.forEach(function(player) {
            playerIds.push(player.id);
        });

        Entries.create(vm.name, playerIds)
        .then(function(entry) {
            vm.entries.push(entry);
            vm.isCreateForm = false;
            vm.name = '';
            for (var b = 0; b < vm.teams.length; b++) {
                vm.playersSelected[b] = '';
            }
        });
    };

    vm.updateEntry = function(entry, index) {
        vm.editFormErrors[index] = [];
        if (!entry.name || entry.name === '') {
            vm.editFormErrors[index].push('Invalid entry name');
        }
        for (var a = 0; a < vm.teams.length; a++) {
          var player = entry.players[a];
            if (player === null || player === '') {
                vm.editFormErrors[index].push(vm.teams[a].name + ' does not have a valid player selected');
            }
        }

        var numPositions = {
            'Center': 0,
            'Winger': 0,
            'Defenseman': 0,
            'Goalie': 0
        };
        var playerIds = [];
        entry.players.forEach(function(player) {
            numPositions[player.position] += 1;
            playerIds.push(player.id);
        });
        if (numPositions.Center < 4 ||
            numPositions.Winger < 4 ||
            numPositions.Defenseman < 5 ||
            numPositions.Goalie !== 2) {
                vm.editFormErrors[index].push('Invalid number of players at each position');
            }

        if (vm.editFormErrors[index].length > 0) return;

        Entries.update(entry.id, entry.name, playerIds)
        .then(function(team) {
            vm.isEditForm[index] = false;
        });
    };

    vm.deleteEntry = function(entryId) {
        Entries.destroy(entryId)
        .then(function(entry) {
            for (var i = 0; i < vm.entries.length; i++) {
                if (vm.entries[i].id && vm.entries[i].id === entryId) {
                    vm.entries.splice(i, 1);
                    break;
                }
            }
        });
    };

    vm.update_player_stats = function() {
        Entries.update_player_stats();
    };
}]);
