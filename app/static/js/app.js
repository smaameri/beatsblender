var app = angular.module('mainApp', ['ui.router','ngCookies', 'ngTouch', 'satellizer']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
    
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
	        'login@index': { templateUrl: 'static/partials/login.htm',
														controller:'LoginController'},
					'results@index': { templateUrl: 'static/partials/results.htm' },
	        'library@index': { templateUrl: 'static/partials/library.htm' },
	        'details@index': { templateUrl: 'static/partials/details.htm' },
						
						
	    },
		})
		.state('test', {
			url:'/test',
			templateUrl:'static/partials/search.htm'
		})
		
    $locationProvider.html5Mode(true);
		
	  $authProvider.facebook({
	    clientId: '1162949303786742',
	    // by default, the redirect URI is http://localhost:5000
	    redirectUri: 'http://beatsblender-stage.herokuapp.com'
	    //redirectUri: 'http://localhost:5000/static/partials/login.htm'
			
	  });
	
	
		$authProvider.google({
		  url: '/auth/google',
	    clientId: '878995820450-f5217mer9onf5o6reltpku6ksbo301pd.apps.googleusercontent.com',
	    redirectUri: 'http://beatsblender-stage.herokuapp.com',
		  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
		  scope: ['profile', 'email'],
		  scopePrefix: 'openid',
		  scopeDelimiter: ' ',
		  requiredUrlParams: ['scope'],
		  optionalUrlParams: ['display'],
		  display: 'popup',
		  type: '2.0',
		});
	
		
	});


app.run(function ($rootScope, $state, $auth) {
  $rootScope.$on('$stateChangeStart',
    function (event, toState) {
      var requiredLogin = false;
      if (toState.data && toState.data.requiredLogin)
        requiredLogin = true;

      if (requiredLogin && !$auth.isAuthenticated()) {
        event.preventDefault();
        $state.go('login');
      }
    });
});

