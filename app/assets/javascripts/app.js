angular.module('hockeyPool', ['ui.router', 'templates', 'Devise'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $stateProvider
    .state('root', {
        abstract: true,
        url: '/',
        templateUrl: 'index.html'
    })
    .state('root.entries', {
        url: '',
        templateUrl: 'entries/_entries.html'
    })
    .state('root.login', {
        url: 'login',
        templateUrl: 'auth/_login.html',
        controller: 'AuthCtrl',
        controllerAs: 'authCtrl',
        onEnter: ['$state', 'Auth', function($state, Auth) {
            if (Auth.isAuthenticated()) {
                $state.go('root.entries');
            }
        }]
    })
    .state('root.register', {
        url: 'register',
        templateUrl: 'auth/_register.html',
        controller: 'AuthCtrl',
        controllerAs: 'authCtrl',
        onEnter: ['$state', 'Auth', function($state, Auth) {
            if (Auth.isAuthenticated()) {
                $state.go('root.entries');
            }
        }]
    });
    
    $urlRouterProvider.otherwise('/');
    
    $locationProvider.html5Mode(true);
}]);