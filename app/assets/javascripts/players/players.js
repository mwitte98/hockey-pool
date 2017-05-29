angular.module('hockeyPool')
.factory('Players', ['$http', function($http){

    return {
        get: get,
        getAll: getAll,
        create: create,
        update: update,
        destroy: destroy
    };

    // players#show
    function get(id) {
        return $http.get('/api/players/' + id)
        .then(function(res) {
            return res.data;
        });
    }

    // players#index
    function getAll(teamId) {
        return $http.get('/api/teams/' + teamId + '/players')
        .then(function(res) {
            return res.data;
        });
    }

    // players#create
    function create(teamId, player) {
        return $http.post('/api/teams/' + teamId + '/players', player)
        .then(function(res) {
            return res.data;
        });
    }

    // players#update
    function update(playerId, player) {
        return $http.put('/api/players/' + playerId, player)
        .then(function(res) {
            return res.data;
        });
    }

    // players#destroy
    function destroy(playerId) {
        return $http.delete('/api/players/' + playerId)
        .then(function(res) {
            return res.data;
        });
    }
}]);
