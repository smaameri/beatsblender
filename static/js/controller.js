
	app.controller('MainController', function($scope, $q, YoutubeFactory){
		
		var videoViews = [];
		
		$scope.query = 'Eminem';
		
		init();				

    function init() {
      $scope.library = YoutubeFactory.getLibrary();
      $scope.results = YoutubeFactory.getResults();
    };
							
		$scope.add = function(id, title){
				  YoutubeFactory.addToLibrary(id, title);
			  }
		
		$scope.videoOrderBy = '';
		
		$scope.orderFunction = function(filter){
			console.log(filter);
			$scope.videoOrderBy = filter;
			return $scope.videoOrderBy;
		}
		
		$scope.search = function(){
			getVideo($scope.query);
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
	