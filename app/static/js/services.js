
app.service('videoResizeService', function(){
	this.resizePlayer = function(){
		var videoContainer = angular.element(document.querySelector('#tv'))		
		var player = angular.element(document.querySelector('#player'))
		var playerWidth  = videoContainer[0].clientWidth
		var playerHeight = videoContainer[0].clientWidth*9/16
		
		player.css('width', playerWidth)
		player.css('height', playerHeight);
	}
})

app.service('jqueryServices', function(){
	
	var libraryTab = angular.element(document.querySelector('#library-tab'))		
	var resultsTab = angular.element(document.querySelector('#results-tab'))		
	
	this.libraryTabActive = function(){
		libraryTab.css('border-bottom', '5px solid #47b0e2');
		resultsTab.css('border-bottom', '5px solid white');
	}
	
	this.resultsTabActive = function(){
		libraryTab.css('border-bottom', '5px solid white');
		resultsTab.css('border-bottom', '5px solid #47b0e2');
	}
	
	this.blur = function(){
		$("#query").blur();
		$(".search-button").blur();
	}
	
	
})