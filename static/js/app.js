var app = angular.module('mainApp', ['ui.router','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider) {
    
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
	
	.state('index', {
	    url: '/',
	
	    views: {
	        '': { templateUrl: 'static/partials/main.htm',
				 				controller : 'MainController', 
							resolve:{
					       videos: function(YoutubeFactory){
									 return fac.getCookieLibrary();
					       }
							}
						},

	        'search@index': { templateUrl: 'static/partials/search.htm' },
	        'results@index': { templateUrl: 'static/partials/results.htm' },
	        'library@index': { templateUrl: 'static/partials/library.htm' },
	        'details@index': { templateUrl: 'static/partials/details.htm' },
						
						
	    },
		});

});

app.run(function() {
	
});

