angular.module('hockeyPool')
.factory('Entries', ['$http', function($http){

    return {
        get: get,
        getAll: getAll,
        create: create,
        update: update,
        destroy: destroy,
        update_player_stats: update_player_stats
    };

    // entries#show
    function get(id) {
        return $http.get('/api/entries/' + id)
        .then(function(res) {
            return res.data;
        });
    }

    // entries#index
    function getAll() {
        return $http.get('/api/entries')
        .then(function(res) {
            return res.data;
        });
    }

    // entries#create
    function create(name, playerIds) {
        var payload = { entry: { name: name }, player_ids: playerIds }
        return $http.post('/api/entries', payload)
        .then(function(res) {
            return res.data;
        });
    }

    // entries#update
    function update(entryId, name, playerIds) {
        var payload = { entry: { name: name }, player_ids: playerIds }
        return $http.put('/api/entries/' + entryId, payload)
        .then(function(res) {
            return res.data;
        });
    }

    // entries#destroy
    function destroy(entryId) {
        return $http.delete('/api/entries/' + entryId)
        .then(function(res) {
            return res.data;
        });
    }

    // entries#update_player_stats
    function update_player_stats() {
        return $http.get('/api/update_player_stats')
        .then(function(res) {
            return res.data;
        });
    }
}]);
