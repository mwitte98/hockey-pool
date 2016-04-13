angular.module('hockeyPool', ['ui.router', 'templates', 'Devise', 'ngCookies'])
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
        onEnter: ['$state', '$cookies', function($state, $cookies) {
            if ($cookies.get('user')) {
                $state.go('root.entries');
            }
        }]
    })
    .state('root.register', {
        url: 'register',
        templateUrl: 'auth/_register.html',
        controller: 'AuthCtrl',
        controllerAs: 'authCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
            if ($cookies.get('user')) {
                $state.go('root.entries');
            }
        }]
    })
    .state('root.teams', {
        url: 'nhlteams',
        templateUrl: 'teams/_index.html',
        resolve: {
            teams: ['Teams', function(Teams) {
                return Teams.getAll();
            }]
        },
        controller: 'TeamsCtrl',
        controllerAs: 'teamsCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
            if (!$cookies.get('user')) {
                $state.go('root.entries');
            }
        }]
    })
    .state('root.players', {
        url: 'nhlplayers/:teamId',
        templateUrl: 'players/_index.html',
        resolve: {
            team: ['$stateParams', 'Teams', function($stateParams, Teams) {
                return Teams.get($stateParams.teamId);
            }],
            players: ['$stateParams', 'Players', function($stateParams, Players) {
                return Players.getAll($stateParams.teamId);
            }]
        },
        controller: 'PlayersCtrl',
        controllerAs: 'playersCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
            if (!$cookies.get('user')) {
                $state.go('root.entries');
            }
        }]
    });
    
    $urlRouterProvider.otherwise('/');
    
    $locationProvider.html5Mode(true);
}]);