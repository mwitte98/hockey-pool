angular.module('hockeyPool')
.controller('PlayerStatsCtrl', ['teams', function(teams) {
    var vm = this;
    vm.teams = teams;
    
    vm.teams.forEach(function(team) {
        team.goalies = [];
        team.players.forEach(function(player) {
            if (player.position === 'Goalie') { 
                team.goalies.push(player);
            }
        });
    });
}]);