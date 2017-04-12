angular.module('hockeyPool')
.controller('PlayersCtrl', ['Players', 'team', function(Players, team) {
    var vm = this;
    vm.team = team;
    vm.players = team.players;
    vm.isCreateForm = false;
    vm.isEditForm = [];
    for (var i = 0; i < vm.players.length; i++) {
        vm.isEditForm[i] = false;
    }
    
    vm.createPlayer = function() {
        if (!vm.firstName || vm.firstName === '' || 
            !vm.lastName || vm.lastName === '' || 
            !vm.position || vm.position === '') { return; }
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
        if (player.first_name === '' || 
            player.last_name === '' || 
            player.position === '' ||
            player.goals === '' ||
            player.assists === '' ||
            player.gwg === '' ||
            player.shg === '' ||
            player.otg === '' ||
            player.wins === '' ||
            player.otl === '' ||
            player.shutouts === '') { return; }
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