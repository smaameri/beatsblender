
	app.controller('MainController', function($scope, $q, YoutubeFactory){
		
		var videoViews = [];
		
		$scope.libCaller = false;
		
		$scope.query = 'Eminem';
		
		$scope.inLibrary = false;
		
		$scope.libraryStock = false;
		
		$resultsAvailable = false;
		
		$scope.videoOrderBy = '';
		
		$scope.filterReverse = false;
				
		libs = false;
		
		change = function(){
			libs = true;
		}
		
		console.log(libs);
		
		init();				

    function init() {
      $scope.library = YoutubeFactory.getLibrary();
      $scope.results = YoutubeFactory.getResults();
    };
							
							
		$scope.add = function(id, title){
		libs = false;
		id.inLibrary=false;
			angular.forEach($scope.library, function(video){
				if(video.id.videoId == id.videoId){
					change();				
				}
			})
			if(libs == false){
					YoutubeFactory.addToLibrary(id, title);
					id.inLibrary = true;
					id.buttonStyle = '{background:blue}';
					
					
			  }
				console.log($scope.libCaller);
				
				$scope.libraryStock = true;
			}
			
			$scope.remove = function(id, title){
				angular.forEach($scope.library, function(video){
					if(video.id.videoId == id.videoId){
						index = $scope.library.indexOf(video)
						if (index > -1) {
						    $scope.library.splice(index, 1);
						}
					}
				})
				angular.forEach($scope.results, function(video){
					if(video.id.videoId == id.videoId){
						video.id.inLibrary = false;
					}
				})

			}
			
		
		$scope.orderFunction = function(filter, filterReverse){
			console.log($scope.filterReverse);
			if(filterReverse == true){
				$scope.filterReverse = false;
			}
			else($scope.filterReverse=true);
			$scope.videoOrderBy = filter;
			return $scope.videoOrderBy;
		}
		
		$scope.search = function(){
			getVideo($scope.query);
			$scope.resultsAvailable=true;
		}
		
		getVideo = function(query){
			YoutubeFactory.search(query).then(function(response1){
				angular.forEach(response1.data.items, function(video){
					getStatistics(video, response1);
				});
				$scope.results = response1.data.items
			}, function(error){
				$scope.results = "Unable to load results"
			});
			
			return results
		}
		
		getStatistics = function(video, response1){
			YoutubeFactory.views(video.id.videoId).then(function(response2){
				angular.forEach(response1.data.items, function(list){
					if(list.id.videoId == response2.data.items[0].id){
						list.views = response2.data.items[0].statistics.viewCount;
						list.likes = response2.data.items[0].statistics.likeCount;
					};
				})
			}, function(error){
				$scope.results = "Unable to load views"					
			});
		}
					
	})
	