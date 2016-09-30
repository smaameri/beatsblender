
	app.controller('MainController', function($scope, $q, $cookieStore, $state, YoutubeFactory){
		
		var videoViews = [];
		
		$scope.libCaller, $scope.inLibrary;
		
		$scope.resultsAvailable, $scope.filterReverse, videoInLibrary = false;
						
		$scope.videoOrderBy = '';
		
		$scope.query = 'Eminem';
		
		$scope.libraryStock = (typeof $cookieStore.get('library') != "undefined" ? true : false)
		
		change = function(){
			videoInLibrary = true;
		}
			
		init();
		
    function init() {
      $scope.library = YoutubeFactory.getLibrary();			
      $scope.cookieLibrary = YoutubeFactory.getCookieLibrary();
      $scope.results = YoutubeFactory.getResults();
			YoutubeFactory.generateLibraryFromCookie();
      $scope.cookieVideo = YoutubeFactory.getCookieVideo();			
			
			if($scope.libraryStock==true){
				$scope.resultsAvailable = true
				$scope.videoDetails=true;
				$scope.detail=YoutubeFactory.getCookieVideo();
								
			}
	  };
							
		$scope.search = function(query){
			$scope.results.length=0;
			YoutubeFactory.getVideo(query);
			$scope.resultsAvailable=true;
			$scope.searchType = 'Search results';
			$state.go('home');
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
				if($scope.library.length==0){
					$scope.libraryStock=false;
					$cookieStore.remove('library');
				}				
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
				$scope.detail=YoutubeFactory.getDetail(video);
				if(libraryVideo){
					$scope.libraryPlaylist = true;
					$scope.results.length=0;
					YoutubeFactory.getVideo(video.id)
					$scope.searchType = 'Related Videos';
				}
				else{
					$scope.libraryPlaylist=false
					}
				YoutubeFactory.loadVideo(video.id, libraryVideo);
				$scope.resultsAvailable=true;
			}
			
				
	})
	