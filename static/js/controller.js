
	app.controller('MainController', function($scope, $q, $cookieStore, YoutubeFactory){
		
		var videoViews = [];
		
		$scope.libCaller, $scope.inLibrary, $scope.libraryStock = false;
		
		$scope.resultsAvailable, $scope.filterReverse, videoInLibrary = false;
						
		$scope.videoOrderBy = '';
		
		$scope.query = 'Eminem';
		
		
		
		change = function(){
			videoInLibrary = true;
		}
			
		init();
		
		function hello(){
			console.log('hello');
		}
		
    function init() {
      $scope.library = YoutubeFactory.getLibrary();
      $scope.cookieLibrary = YoutubeFactory.getCookieLibrary();
      $scope.results = YoutubeFactory.getResults();
			YoutubeFactory.generateLibraryFromCookie();
    };
							
		$scope.search = function(query){
			$scope.results.length=0;
			YoutubeFactory.getVideo(query);
			$scope.resultsAvailable=true;
			$scope.searchType = 'Search results';
		}		
						
		$scope.add = function(resultsVideo){
				if(resultsVideo.inLibrary == false){
						YoutubeFactory.addToLibrary(resultsVideo);
						resultsVideo.inLibrary = true;
						$scope.libraryStock = true;
				  }
					else(this.remove(resultsVideo));
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
			
			$scope.showVideoDetails = function(video, libraryVideo){
				$scope.videoDetails=true;
				$scope.detail=video;
				if(libraryVideo){
					$scope.libraryPlaylist = true;
					$scope.results.length=0;
					YoutubeFactory.getVideo(video.id)
					$scope.searchType = 'Related Videos';
				}
				else{$scope.libraryPlaylist=false}
				YoutubeFactory.loadVideo(video.id, libraryVideo);
				$scope.resultsAvailable=true;
			}
			
				
	})
	