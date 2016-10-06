var app = angular.module('mainApp', ['ui.router','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider) {
    
  $urlRouterProvider.otherwise('/');
  
  $stateProvider

	.state('test', {
		url: '/test',
		templateUrl: 'static/partials/main.htm',
		controller : 'MainController',
		resolve:{
		  message: function(messageService){
		    return messageService.getMessage();
       },
       videos: function(youtube){
           return
					 //return youtube.getVideos('eminem', 20);
       }
		}
	})
	
	.state('index', {
	    url: '/',
	
	    views: {
	        // the main template will be placed here (relatively named)
	        '': { templateUrl: 'static/partials/main.htm',
				 				controller : 'MainController', 
							resolve:{
					       videos: function(YoutubeFactory){
									 return fac.getCookieLibrary();
										 //return youtube.getVideos('eminem', 20, 'library', false);
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

app.run(function ($cookieStore, $state) {
  //This code loads the IFrame Player API code asynchronously.
	
});

