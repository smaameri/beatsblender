var app = angular.module('mainApp', ['ui.router','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider) {
    
  $urlRouterProvider.otherwise('/');
  
  $stateProvider

	.state('index', {
		url: '/',
		templateUrl: 'static/partials/main.htm',
		controller : 'MainController',
		resolve:{
		  message: function(messageService){
		    return messageService.getMessage();
       },
       videos: function(youtube){
           return youtube.getVideos();
       }
		}
	})

});

app.run(function ($cookieStore, $state) {
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
		
});

