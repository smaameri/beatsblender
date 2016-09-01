
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
			$scope.results.length=0;
			YoutubeFactory.getVideo($scope.query);
			$scope.resultsAvailable=true;
			angular.element( document.querySelector('#results-column')).val('border-show');		
		}
		
		
					
	})
	