angular.module('hockeyPool')
.controller('TeamsCtrl', ['Teams', 'teams', function(Teams, teams) {
    var vm = this;
    vm.teams = teams;
    vm.isCreateForm = false;
    vm.createFormErrors = [];
    vm.isEditForm = [];
    vm.editFormErrors = [];
    for (var i = 0; i < vm.teams.length; i++) {
        vm.isEditForm[i] = false;
        vm.editFormErrors.push([]);
    }

    vm.createTeam = function() {
        vm.createFormErrors = [];
        if (!vm.name || vm.name === '') {
            vm.createFormErrors.push('Invalid team name');
        }
        if (!vm.abbr || vm.abbr === '') {
            vm.createFormErrors.push('Invalid abbreviation');
        }

        if (vm.createFormErrors.length > 0) return;

        Teams.create({
            name: vm.name,
            abbr: vm.abbr
        })
        .then(function(team) {
            vm.teams.push(team);
            vm.isCreateForm = false;
        });
        vm.name = '';
        vm.abbr = '';
    };

    vm.updateTeam = function(team, index) {
        vm.editFormErrors[index] = [];
        if (!team.name || team.name === '') {
            vm.editFormErrors[index].push('Invalid team name');
        }
        if (!team.abbr || team.abbr === '') {
            vm.editFormErrors[index].push('Invalid abbreviation');
        }

        if (vm.editFormErrors[index].length > 0) return;

        Teams.update(team.id, {
            name: team.name,
            abbr: team.abbr
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
