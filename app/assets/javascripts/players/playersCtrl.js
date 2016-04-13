angular.module('hockeyPool')
.controller('PlayersCtrl', ['Players', 'team', 'players', '$state', function(Players, team, players, $state) {
    var vm = this;
    vm.team = team;
    vm.players = players;
    vm.isCreateForm = false;
    vm.isEditForm = [];
    for (var i = 0; i < vm.players.length; i++) {
        vm.isEditForm[i] = false;
    }
    
    vm.createPlayer = function() {
        if (!vm.firstName || vm.firstName === '' || 
            !vm.lastName || vm.lastName === '' || 
            !vm.position || vm.position === '' || 
            !vm.nhlId || vm.nhlId === '' || 
            (vm.position === 'Goalie' && (!vm.hockeydbId || vm.hockeydbId === ''))) { return; }
        if (!vm.hockeydbId) { vm.hockeydbId = 0; }
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
            nhlID: vm.nhlId,
            hockeydbID: vm.hockeydbId
        })
        .then(function(player) {
            vm.players.push(player);
            vm.isCreateForm = false;
        });
        vm.firstName = '';
        vm.lastName = '';
        vm.position = '';
        vm.nhlId = '';
        vm.hockeydbId = '';
    };
    
    vm.updatePlayer = function(player, index) {
        if (player.first_name === '' || 
            player.last_name === '' || 
            player.position === '' ||
            player.goals === '' ||
            player.assists === '' ||
            player.gwg === '' ||
            player.shg === '' ||
            player.wins === '' ||
            player.otl === '' ||
            player.shutouts === '' || 
            player.nhlID === '' || 
            (player.position === 'Goalie' && player.hockeydbID === '')) { return; }
        Players.update(player.id, {
            first_name: player.first_name,
            last_name: player.last_name,
            position: player.position,
            goals: player.goals,
            assists: player.assists,
            gwg: player.gwg,
            shg: player.shg,
            wins: player.wins,
            otl: player.otl,
            shutouts: player.shutouts,
            nhlID: player.nhlID,
            hockeydbID: player.hockeydbID
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