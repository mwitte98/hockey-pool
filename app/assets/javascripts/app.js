angular.module('hockeyPool', ['ui.router', 'templates', 'Devise', 'ngCookies'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $stateProvider
    .state('root', {
        abstract: true,
        url: '/',
        templateUrl: 'index.html'
    })
    .state('root.homepage', {
        url: '',
        templateUrl: 'homepage/_index.html'
    })
    .state('root.playerstats', {
        url: 'playerstats',
        templateUrl: 'playerstats/_index.html'
    })
    .state('root.login', {
        url: 'login',
        templateUrl: 'auth/_login.html',
        controller: 'AuthCtrl',
        controllerAs: 'authCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
            if ($cookies.get('user')) {
                $state.go('root.homepage');
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
                $state.go('root.homepage');
            }
        }]
    })
    .state('root.admin', {
        abstract: true,
        url: 'admin/',
        template: '<ui-view></ui-view>',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
            if (!$cookies.get('user')) {
                $state.go('root.homepage');
            }
        }]
    })
    .state('root.admin.teams', {
        url: 'teams',
        templateUrl: 'teams/_index.html',
        resolve: {
            teams: ['Teams', function(Teams) {
                return Teams.getAll();
            }]
        },
        controller: 'TeamsCtrl',
        controllerAs: 'teamsCtrl'
    })
    .state('root.admin.players', {
        url: 'players/:teamId',
        templateUrl: 'players/_index.html',
        resolve: {
            team: ['$stateParams', 'Teams', function($stateParams, Teams) {
                return Teams.get($stateParams.teamId);
            }]
        },
        controller: 'PlayersCtrl',
        controllerAs: 'playersCtrl'
    })
    .state('root.admin.entries', {
        url: 'entries',
        templateUrl: 'entries/_index.html',
        resolve: {
            teams: ['Teams', function(Teams) {
                return Teams.getAll();
            }],
            entries: ['Entries', function(Entries) {
                return Entries.getAll();
            }]
        },
        controller: 'EntriesCtrl',
        controllerAs: 'entriesCtrl'
    });
    
    $urlRouterProvider.otherwise('/');
    
    $locationProvider.html5Mode(true);
}]);