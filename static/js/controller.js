app.controller('MainController', function($scope, YoutubeFactory, YoutubePlayer){
	
		
	function init(){
		$scope.library = YoutubeFactory.getLibrary();
		$scope.results = YoutubeFactory.getResults();
		$scope.detail  = YoutubeFactory.getDetail();
		$scope.libraryStock = YoutubeFactory.getLibraryStock();
		YoutubePlayer.youtubeAPIInit();		
	}	
	
	init()
	
	$scope.query='eminem';
			
	$scope.search = function(){
		$scope.library.results = 0;
		YoutubeFactory.getAllVideos($scope.query, 10, 'results', true)
	}
	
	$scope.add = function(resultsVideo){
			if(resultsVideo.inLibrary == false){
					YoutubeFactory.addToLibrary(resultsVideo);
	 			 	$scope.libraryStock=true;
			  }
				else(this.remove(resultsVideo));
		}
		
	$scope.remove = function(libraryVideo){
		YoutubeFactory.removeFromLibrary(libraryVideo);
	}
	
	$scope.play = function(video){
		YoutubePlayer.play(video.id);
		$scope.detail  = video;
	}

})
