angular.module('hockeyPool', ['ui.router', 'templates', 'ngAnimate', 'ui.bootstrap'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
    .state('root', {
        abstract: true,
        url: '/',
        templateUrl: 'index.html'
    })
    .state('root.homepage', {
        url: '',
        templateUrl: 'homepage/_index.html',
        resolve: {
            entries: ['Entries', function(Entries) {
                return Entries.getAll();
            }]
        },
        controller: 'HomepageCtrl',
        controllerAs: 'homeCtrl'
    })
    .state('root.playerstats', {
        url: 'playerstats',
        templateUrl: 'playerstats/_index.html',
        resolve: {
            teams: ['Teams', function(Teams) {
                return Teams.getAll();
            }]
        },
        controller: 'PlayerStatsCtrl',
        controllerAs: 'statsCtrl'
    })
    .state('root.login', {
        url: 'login',
        templateUrl: 'auth/_login.html',
        controller: 'AuthCtrl',
        controllerAs: 'authCtrl',
        onEnter: ['$state', 'Auth', function($state, Auth) {
            Auth.signedIn().then(function(data) {
                if (data.logged_in) {
                    $state.go('root.homepage');
                }
            });
        }]
    })
    .state('root.register', {
        url: 'register',
        templateUrl: 'auth/_register.html',
        controller: 'AuthCtrl',
        controllerAs: 'authCtrl',
        onEnter: ['$state', 'Auth', function($state, Auth) {
            Auth.signedIn().then(function(data) {
                if (data.logged_in) {
                    $state.go('root.homepage');
                }
            });
        }]
    })
    .state('root.admin', {
        abstract: true,
        url: 'admin/',
        template: '<ui-view></ui-view>',
        onEnter: ['$state', 'Auth', function($state, Auth) {
            Auth.signedIn().then(function(data) {
                if (!data.logged_in) {
                    $state.go('root.homepage');
                }
            });
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
