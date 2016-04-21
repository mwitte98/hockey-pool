angular.module('hockeyPool')
.controller('PlayerStatsCtrl', ['teams', function(teams) {
    var vm = this;
    vm.teams = teams;
    
    vm.teams.forEach(function(team) {
        team.players.forEach(function(player) {
            player.points = (player.goals * 2) + player.assists + player.gwg + (player.shg * 3) + (player.wins * 2) + player.otl + (player.shutouts * 4);
            if (player.position === 'Goalie') { team.hasGoalie = true; }
        });
    });
}]);