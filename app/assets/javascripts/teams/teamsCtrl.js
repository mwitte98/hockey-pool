angular.module('hockeyPool')
.controller('TeamsCtrl', ['Teams', 'teams', function(Teams, teams) {
    var vm = this;
    vm.teams = teams;
    vm.isCreateForm = false;
    vm.isEditForm = [];
    for (var i = 0; i < vm.teams.length; i++) {
        vm.isEditForm[i] = false;
    }
    
    vm.createTeam = function() {
        if (!vm.name || vm.name === '' || !vm.nhlID || vm.nhlID === '') { return; }
        Teams.create({
            name: vm.name,
            nhlID: vm.nhlID
        })
        .then(function(team) {
            vm.teams.push(team);
            vm.isCreateForm = false;
        });
        vm.name = '';
        vm.nhlID = '';
    };
    
    vm.updateTeam = function(team, index) {
        if (!team.name || team.name === '' || !team.nhlID || team.nhlID === '') { return; }
        Teams.update(team.id, {
            name: team.name,
            nhlID: team.nhlID
        })
        .then(function(team) {
            vm.isEditForm[index] = false;
        });
    };
    
    vm.deleteTeam = function(teamId) {
        Teams.destroy(teamId)
        .then(function(team) {
            for (var i = 0; i < vm.teams.length; i++) {
                if (vm.teams[i].id && vm.teams[i].id === teamId) { 
                    vm.teams.splice(i, 1);
                    break;
                }
            }
        });
    };
}]);