app.controller('MainController', function($scope, $window, $document, YoutubeFactory, YoutubePlayer){
		
	function init(){
		$scope.library = YoutubeFactory.getLibrary();
		$scope.results = YoutubeFactory.getResults();
		$scope.detail  = YoutubeFactory.getDetail();
		$scope.libraryStock = YoutubeFactory.getLibraryStock();
		YoutubePlayer.youtubeAPIInit();
		//resizePlayer();
	}	
	
	init()
				
	$scope.search = function(query){
		YoutubeFactory.getAllVideos(query, 10, 'results', true)
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
		if($scope.library.length == 0)
			$scope.libraryStock = false;
	}
	
	$scope.play = function(video, list){
		YoutubePlayer.loadVideo(video, list);
		$scope.detail = video;
		console.log(video)
	}
	
	console.log('$window.innerWidth');
	console.log($window.innerWidth);
	
	angular.element($window).bind('resize', function(){
		YoutubePlayer.resizePlayer();
	})
	

  youtubePlayer.createPlayer = function (videoId){
		return new YT.Player('player', {
        height: '',
        width: '',
        videoId: videoId,
        events: {
          'onReady': YoutubePlayer.onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
  };
	
  function onPlayerStateChange(event){
    if (event.data == YT.PlayerState.PLAYING) {
			console.log('playing');
    } else if (event.data == YT.PlayerState.PAUSED) {
			console.log('paused');
    } else if (event.data == YT.PlayerState.ENDED) {
			console.log('ended');
      fac.nextVideo()
			$scope.detail = store.detail;
			$scope.$apply()
    }			
  }
})
