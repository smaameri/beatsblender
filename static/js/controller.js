app.controller('MainController', function($scope, $window, $document, $location, $anchorScroll, YoutubeFactory, YoutubePlayer){
		
	function init(){
		$scope.library = YoutubeFactory.getLibrary();
		$scope.results = YoutubeFactory.getResults();
		$scope.detail  = YoutubeFactory.getDetail();
		$scope.libraryStock = YoutubeFactory.getLibraryStock();
		YoutubePlayer.youtubeAPIInit();
		$scope.resultsInit = false;
		//resizePlayer();
	}	
	
	init()
	
	var searchBar = angular.element(document.querySelector('#query'))
	
	$('input').click(function() {
		console.log('boo');
	});
		
	$scope.search = function(query){
		YoutubeFactory.getAllVideos(query, 10, 'results', true)
		$scope.showLibrary = false;
		$scope.resultsInit = true;
		$scope.updateTab();
		
		$location.hash('results-tab');
    $anchorScroll();
		
		$("#query").blur(); 
		
		
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
	
	$scope.showLibrary = true;
	
	$scope.toggleLibrary = function(){
			$scope.showLibrary = true;
			$scope.updateTab();
	}
	
	$scope.toggleResults = function(){
			$scope.showLibrary = false;
			$scope.updateTab();
			
	}
		
	angular.element($window).bind('resize', function(){
		YoutubePlayer.resizePlayer();
		youtubePlayer.tabButton()
	})
	
	$scope.go = function(){
		console.log('bee');
	}
	
	$scope.updateTab = function(){
		if($scope.resultsInit){
			var libraryTab = angular.element(document.querySelector('#library-tab'))		
			var resultsTab = angular.element(document.querySelector('#results-tab'))		
			if($scope.showLibrary == true){
				libraryTab.css('border-bottom', '5px solid #47b0e2');
				resultsTab.css('border-bottom', '5px solid white');
			}
			else{
				libraryTab.css('border-bottom', '5px solid white');
				resultsTab.css('border-bottom', '5px solid #47b0e2');
			}
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
