
	app.controller('MainController', function($scope, $q, YoutubeFactory, LibraryServices){
		
		var videoViews = [];
		
		$scope.libCaller, $scope.inLibrary, $scope.libraryStock = false;
		
		$scope.resultsAvailable, $scope.filterReverse, videoInLibrary = false;
						
		$scope.videoOrderBy = '';
		
						
		change = function(){
			videoInLibrary = true;
		}
			
		init();				
		
    function init() {
      $scope.library = LibraryServices.getLibrary();
      $scope.results = YoutubeFactory.getResults();
    };
							
		$scope.search = function(query){
			$scope.results.length=0;
			$scope.videoDetails=false;
			YoutubeFactory.getVideo(query);
			$scope.resultsAvailable=true;
			$scope.searchType = 'Search results';
		}		
						
		$scope.add = function(resultsVideo){
				if(resultsVideo.inLibrary == false){
						LibraryServices.addToLibrary(resultsVideo);
						resultsVideo.inLibrary = true;
						$scope.libraryStock = true;
				  }
					else(this.remove(resultsVideo));		
			}
			
			$scope.remove = function(libraryVideo){
				LibraryServices.removeFromLibrary(libraryVideo);
				LibraryServices.setVideoInLibraryStatus(libraryVideo);
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
	