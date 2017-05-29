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

        Entries.create({
            name: vm.name,
            player1: vm.playersSelected[0].id,
            player2: vm.playersSelected[1].id,
            player3: vm.playersSelected[2].id,
            player4: vm.playersSelected[3].id,
            player5: vm.playersSelected[4].id,
            player6: vm.playersSelected[5].id,
            player7: vm.playersSelected[6].id,
            player8: vm.playersSelected[7].id,
            player9: vm.playersSelected[8].id,
            player10: vm.playersSelected[9].id,
            player11: vm.playersSelected[10].id,
            player12: vm.playersSelected[11].id,
            player13: vm.playersSelected[12].id,
            player14: vm.playersSelected[13].id,
            player15: vm.playersSelected[14].id,
            player16: vm.playersSelected[15].id
        })
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
            if (entry.players[a] === '') {
                vm.editFormErrors[index].push(vm.teams[a].name + ' does not have a valid player selected');
            }
        }

        numPositions = {
            'Center': 0,
            'Winger': 0,
            'Defenseman': 0,
            'Goalie': 0
        };
        entry.players.forEach(function(player) {
            if (player) { numPositions[player.position] += 1; }
        });
        if (numPositions.Center < 4 ||
            numPositions.Winger < 4 ||
            numPositions.Defenseman < 5 ||
            numPositions.Goalie !== 2) {
                vm.editFormErrors[index].push('Invalid number of players at each position');
            }

        if (vm.editFormErrors[index].length > 0) return;

        Entries.update(entry.id, {
            name: entry.name,
            player1: entry.players[0].id,
            player2: entry.players[1].id,
            player3: entry.players[2].id,
            player4: entry.players[3].id,
            player5: entry.players[4].id,
            player6: entry.players[5].id,
            player7: entry.players[6].id,
            player8: entry.players[7].id,
            player9: entry.players[8].id,
            player10: entry.players[9].id,
            player11: entry.players[10].id,
            player12: entry.players[11].id,
            player13: entry.players[12].id,
            player14: entry.players[13].id,
            player15: entry.players[14].id,
            player16: entry.players[15].id
        })
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
