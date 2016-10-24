app.controller('MainController', function(
	$scope, $window, $document, $location, $anchorScroll,
	YoutubeFactory,	YoutubePlayer, jqueryServices, videoResizeService
){
	
	
	function init(){
		$scope.library = YoutubeFactory.getLibrary();
		$scope.results = YoutubeFactory.getResults();
		$scope.detail  = YoutubeFactory.getDetail();
		$scope.libraryStock = YoutubeFactory.getLibraryStock();
		YoutubePlayer.youtubeAPIInit();
		
		$scope.showLibrary = true;
		$scope.resultsInit = false;
		
	}
				
	init()
					
	$scope.search = function(query){
		
		jqueryServices.blur()
		YoutubeFactory.getAllVideos(query, 10, 'results', true)
		$scope.showLibrary = false;
		$scope.resultsInit = true;
		$scope.updateTab();
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
	}
	
	$scope.toggleLibrary = function(tab){
		if(tab == 'library')
			$scope.showLibrary = true;
		else if(tab == 'results' && $scope.resultsInit == true)
			$scope.showLibrary = false;
		$scope.updateTab();
	}
		
	angular.element($window).bind('resize', function(){
		videoResizeService.resizePlayer();
	})
		
	$scope.updateTab = function(){
		if($scope.resultsInit){
			if($scope.showLibrary == true)
				jqueryServices.libraryTabActive()
			else
				jqueryServices.resultsTabActive()
		}
	}

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
