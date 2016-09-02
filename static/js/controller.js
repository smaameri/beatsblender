
	app.controller('MainController', function($scope, $q, YoutubeFactory){
		
		var videoViews = [];
		
		$scope.libCaller, $scope.inLibrary, $scope.libraryStock = false;
		
		$scope.resultsAvailable, $scope.filterReverse, videoInLibrary = false;
		
		$scope.query = 'Eminem';
				
		$scope.videoOrderBy = '';
		
						
		change = function(){
			videoInLibrary = true;
		}
			
		init();				
		
    function init() {
      $scope.library = YoutubeFactory.getLibrary();
      $scope.results = YoutubeFactory.getResults();
    };
							
		$scope.search = function(query){
			$scope.results.length=0;
			$scope.videoDetails=false;
			YoutubeFactory.getVideo(query);
			$scope.resultsAvailable=true;
			$scope.searchType = 'Search results';
		}
		
		$scope.relatedVideosSearch = function(video){
		}
		
						
		$scope.add = function(resultsVideo){
				if(resultsVideo.inLibrary == false){
						YoutubeFactory.addToLibrary(resultsVideo);
						resultsVideo.inLibrary = true;
				  }				
					$scope.libraryStock = true;
			}
			
			$scope.remove = function(libraryVideo){
				YoutubeFactory.removeFromLibrary(libraryVideo);
				YoutubeFactory.setVideoInLibraryStatus(libraryVideo);
				if($scope.library.length==0){$scope.libraryStock=false}				
			}
					
			$scope.orderFunction = function(filter, filterReverse){
				if(filterReverse == true){
					$scope.filterReverse = false;
				}
				else($scope.filterReverse=true);
				$scope.videoOrderBy = filter;
			}
			
			$scope.showVideoDetails = function(video){
				$scope.videoDetails=true;
				$scope.detail=video;
				$scope.results.length=0;
				YoutubeFactory.getVideo(video.id);
				$scope.resultsAvailable=true;
				$scope.searchType = 'Related Videos';
								
				
			}
				
	})
	