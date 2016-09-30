var app = angular.module('mainApp', ['ui.router','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider

// HOME STATES AND NESTED VIEWS ========================================
.state('index', {
  url: '/index',
  templateUrl: 'static/partials/main.htm',
	controller : 'MainController'
})

.state('searchBar', {
    url: '/search',
    views: {
        // the main template will be placed here (relatively named)
        '': { templateUrl: 'static/partials/main2.htm',
			 				controller : 'MainController'},
        // the child views will be defined here (absolutely named)
        'search@searchBar': { templateUrl: 'static/partials/search.htm' },
      // the child views will be defined here (absolutely named)
      'landing@searchBar': { templateUrl: 'static/partials/landing.htm' },
			
    }
	})

.state('home', {
    url: '/',
    views: {
        // the main template will be placed here (relatively named)
        '': { templateUrl: 'static/partials/main.htm',
			 				controller : 'MainController'},

        // the child views will be defined here (absolutely named)
        'search@home': { templateUrl: 'static/partials/search.htm' },
      
        // the child views will be defined here (absolutely named)
        'details@home': { templateUrl: 'static/partials/details.htm' },
      
			  // the child views will be defined here (absolutely named)
        'sort@home'   : { templateUrl: 'static/partials/sort.htm' },
			  
				// the child views will be defined here (absolutely named)
        'results@home': { templateUrl: 'static/partials/results.htm' },
			  
				// the child views will be defined here (absolutely named)
        'library@home': { templateUrl: 'static/partials/library.htm' },
    }
	});
	

        
});

app.run(function () {
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

