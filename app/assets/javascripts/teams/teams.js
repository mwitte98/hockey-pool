angular.module('hockeyPool')
.factory('Teams', ['$http', function($http){

    return {
        get: get,
        getAll: getAll,
        create: create,
        update: update,
        destroy: destroy
    };

    // teams#show
    function get(id) {
        return $http.get('/api/teams/' + id)
        .then(function(res) {
            return res.data;
        });
    }

    // teams#index
    function getAll() {
        return $http.get('/api/teams')
        .then(function(res) {
            return res.data;
        });
    }

    // teams#create
    function create(team) {
        return $http.post('/api/teams', team)
        .then(function(res) {
            return res.data;
        });
    }

    // teams#update
    function update(teamId, team) {
        return $http.put('/api/teams/' + teamId, { team: team })
        .then(function(res) {
            return res.data;
        });
    }

    // teams#destroy
    function destroy(teamId) {
        return $http.delete('/api/teams/' + teamId)
        .then(function(res) {
            return res.data;
        });
    }
}]);
