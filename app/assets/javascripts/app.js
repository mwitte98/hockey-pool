angular.module('hockeyPool', ['ui.router', 'templates'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $stateProvider
    .state('root', {
        url: '/',
        templateUrl: 'entries/_entries.html'
    });
    
    $urlRouterProvider.otherwise('/');
    
    $locationProvider.html5Mode(true);
}]);