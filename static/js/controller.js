app.controller('MainController', function($scope, YoutubeFactory, message, videos){
	
	function init(){
		$scope.results = YoutubeFactory.getResults();
	}	
	
	init()
		
	$scope.message = message;
	$scope.results = videos;
	
	console.log($scope.message);
	console.log($scope.results);	
	
	
	$scope.query='eminem';
	
	list = [];
	
		
	$scope.search = function(){
		YoutubeFactory.check2($scope.query, 10)
	}

})
