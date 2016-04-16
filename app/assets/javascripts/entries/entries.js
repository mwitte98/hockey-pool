angular.module('hockeyPool')
.factory('Entries', ['$http', function($http){
    
    return {
        get: get,
        getAll: getAll,
        create: create,
        update: update,
        destroy: destroy
    };
    
    // entries#show
    function get(id) {
        return $http.get('/entries/' + id)
        .then(function(res) {
            return res.data;
        });
    }
    
    // entries#index
    function getAll() {
        return $http.get('/entries')
        .then(function(res) {
            return res.data;
        });
    }
    
    // entries#create
    function create(entry) {
        return $http.post('/entries', entry)
        .then(function(res) {
            return res.data;
        });
    }
    
    // entries#update
    function update(entryId, entry) {
        return $http.put('/entries/' + entryId, entry)
        .then(function(res) {
            return res.data;
        });
    }
    
    // entries#destroy
    function destroy(entryId) {
        return $http.delete('/entries/' + entryId)
        .then(function(res) {
            return res.data;
        });
    }
}]);