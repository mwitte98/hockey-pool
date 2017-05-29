angular.module('hockeyPool')
.factory('Auth', ['$http', function($http){

    return {
        register: register,
        login: login,
        logout: logout,
        signedIn: signedIn
    };

    // users#create
    function register(user) {
        return $http.post('/api/user', { user: user })
        .then(function(res) {
            return res.data;
        });
    }

    // auth#login
    function login(user) {
        return $http.post('/api/auth/login', user)
        .then(function(res) {
            return res.data;
        });
    }

    // auth#logout
    function logout() {
        return $http.post('/api/auth/logout')
        .then(function(res) {
            return res.data;
        });
    }

    // auth#signed_in
    function signedIn() {
        return $http.get('/api/auth/signed_in')
        .then(function(res) {
            return res.data;
        })
        .catch(function(res) {
            return res.data;
        })
    }
}]);
