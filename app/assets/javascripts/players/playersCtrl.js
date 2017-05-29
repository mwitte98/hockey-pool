angular.module('hockeyPool')
.controller('PlayersCtrl', ['Players', 'team', function(Players, team) {
    var vm = this;
    vm.team = team;
    vm.players = team.players;
    vm.isCreateForm = false;
    vm.createFormErrors = [];
    vm.isEditForm = [];
    vm.editFormErrors = [];
    for (var i = 0; i < vm.players.length; i++) {
        vm.isEditForm[i] = false;
        vm.editFormErrors.push([]);
    }

    vm.createPlayer = function() {
        vm.createFormErrors = [];
        if (!vm.firstName || vm.firstName === '') {
            vm.createFormErrors.push('Invalid first name');
        }
        if (!vm.lastName || vm.lastName === '') {
            vm.createFormErrors.push('Invalid last name');
        }
        if (!vm.position || vm.position === '') {
            vm.createFormErrors.push('Invalid position');
        }
        if (vm.createFormErrors.length > 0) return;

        Players.create(vm.team.id, {
            first_name: vm.firstName,
            last_name: vm.lastName,
            position: vm.position,
            goals: 0,
            assists: 0,
            gwg: 0,
            shg: 0,
            wins: 0,
            otl: 0,
            shutouts: 0,
            otg: 0,
            points: 0
        })
        .then(function(player) {
            vm.players.push(player);
            vm.isCreateForm = false;
        });
        vm.firstName = '';
        vm.lastName = '';
        vm.position = '';
    };

    vm.updatePlayer = function(player, index) {
        vm.editFormErrors[index] = [];
        if (player.first_name === '') {
            vm.editFormErrors[index].push('Invalid first name');
        }
        if (player.last_name === '') {
            vm.editFormErrors[index].push('Invalid last name');
        }
        if (player.position === '') {
            vm.editFormErrors[index].push('Invalid position');
        }
        if (player.goals === null || player.goals === '' ||
            player.assists === null || player.assists === '' ||
            player.gwg === null || player.gwg === '' ||
            player.shg === null || player.shg === '' ||
            player.otg === null || player.otg === '' ||
            player.wins === null || player.wins === '' ||
            player.otl === null || player.otl === '' ||
            player.shutouts === null || player.shutouts === '') {
                vm.editFormErrors[index].push('Invalid stat');
            }

        if (vm.editFormErrors[index].length > 0) return;

        Players.update(player.id, {
            first_name: player.first_name,
            last_name: player.last_name,
            position: player.position,
            goals: player.goals,
            assists: player.assists,
            gwg: player.gwg,
            shg: player.shg,
            otg: player.otg,
            wins: player.wins,
            otl: player.otl,
            shutouts: player.shutouts,
            points: (player.goals * 2) + player.assists + player.gwg + (player.shg * 3) + (player.otg * 2) + (player.wins * 2) + player.otl + (player.shutouts * 4)
        })
        .then(function(team) {
            vm.isEditForm[index] = false;
        });
    };

    vm.deletePlayer = function(playerId) {
        Players.destroy(playerId)
        .then(function(player) {
            for (var i = 0; i < vm.players.length; i++) {
                if (vm.players[i].id && vm.players[i].id === playerId) {
                    vm.players.splice(i, 1);
                    break;
                }
            }
        });
    };
}]);
