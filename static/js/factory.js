app.factory("youtube", function($q, YoutubeFactory){
   return {
       getVideos: function(query, maxResults, list, reset){
       	 return fac.getAllVideos(query, maxResults, list, reset)
       }
   }
});

app.factory('YoutubePlayer', function($log, $window){
	
	youtubePlayer = {};
	
	var player = null;
	
  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '480',
    playerWidth: '640',
    state: 'stopped'
  };
	
	youtubePlayer.resizePlayer = function(){
		var videoContainer = angular.element(document.querySelector('#tv'))		
		var player = angular.element(document.querySelector('#player'))
		var playerWidth  = videoContainer[0].clientWidth
		var playerHeight = videoContainer[0].clientWidth*9/16
		
		player.css('width', playerWidth)
		player.css('height', playerHeight);
	}
	
	
	$window.onYouTubeIframeAPIReady = function(){
    $log.info('Youtube API is ready');
    youtube.ready = true;
		youtubePlayer.playerInit(store.init.id);
		console.log(store.library[0]);
		youtubePlayer.resizePlayer();
  }
	
	youtubePlayer.youtubeAPIInit = function(){
		var tag = document.createElement('script');
		tag.src = "http://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
	
	youtubePlayer.playerInit = function(videoId){
		player = youtubePlayer.createPlayer(videoId);
		return player
	}

  youtubePlayer.onPlayerReady = function(event) {
    //event.target.playVideo();
  }
	
	
	youtubePlayer.loadVideo = function(videoId, libraryVideo){
		libraryVideoPlaying = libraryVideo;
		console.log('player ready');
    nowPlaying = videoId;
      if (youtube.player){
		    youtube.player.loadVideoById(videoId);
      }
			else{
				youtube.player = fac.createPlayer(videoId);
			}
  }
	
	youtubePlayer.play = function(videoId){
		player.loadVideoById(videoId);
	}
	
	youtubePlayer.loadVideo = function(video, list){
		this.play(video.id);
		nowPlaying.id = video.id;
		nowPlaying.playlist = list;
		console.log(nowPlaying);
	}
	
	return youtubePlayer
})

app.factory('YoutubeFactory', function($http, $q, $cookieStore, $window, $log, YoutubeAPI, YoutubePlayer){
	
	fac = {}
	
	
	var results = []
	
	var library = []
	
	var youTubeData = []
	
	var libraryStock = false;
	
	store = {
		results:[],
		library:[],
		cookieLibrary:[],
		detail: null,
		init:{}
	}
	
	nowPlaying = {
		id:null,
		playlist:'library',
	}	

	 fac.nextVideo = function(){
		var nextVideoIndex;
		var playlist = store[nowPlaying.playlist]
		angular.forEach(playlist, function(video){
			if(nowPlaying.id == video.id){
				var index = playlist.indexOf(video)
				if(index < playlist.length - 1)
					nextVideoIndex = index + 1;
				else
					nextVideoIndex = 0
			}
		})
		nowPlaying.id = playlist[nextVideoIndex].id
		store.detail  = playlist[nextVideoIndex]
    YoutubePlayer.play(nowPlaying.id);
	}
	
	fac.loadVideo = function(videoId, libraryVideo){
		libraryVideoPlaying = libraryVideo;
		console.log('player ready');
    nowPlaying = videoId;
      if (youtube.player){
		    youtube.player.loadVideoById(videoId);
      }
			else{
				youtube.player = fac.createPlayer(videoId);
			}
  }
	
	fac.resetList = function(reset, list){
		if(reset)
		store[list].length = 0
	}
		
		fac.getAllVideos = function(query, maxResults, list, reset){
			this.resetList(reset, list)
			return YoutubeAPI.youtubeSearch(query, maxResults)
				.then(function(videos){
					angular.forEach(videos.data.items, function(video){
						store[list].push(fac.addData(video, list))
					})
					fac.getAllStats(store[list])
					return store[list]
				})
		}
		
			fac.getAllStats = function(videos){
				youtubeStatisticsPromises = []
				angular.forEach(videos, function(video){
					youtubeStatisticsPromises.push(YoutubeAPI.getStats(video))
				})
				return $q.all(youtubeStatisticsPromises).then(function(response){
					return response
				});
			}
		
		fac.addData = function(video, list){
			var data;
			console.log(list)
			var inLibrary = false;
			if(list == 'results'){
				angular.forEach(store.library, function(libraryVideo){
					console.log(video.id)
					if(video.id.videoId == libraryVideo.id)
						inLibrary = true;
					console.log(inLibrary);
				})
			}
			
			return data = {
				id: video.id.videoId,
				title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        author: video.snippet.channelTitle,
				publishedAt:video.snippet.publishedAt.slice(0,-14),
				inLibrary: inLibrary
			}
		}
		
	 	 fac.addToLibrary = function(resultVideo){
			 resultVideo.inLibrary=true;
			 libraryStock=true;
			 store.library.push(resultVideo);
	 		 store.cookieLibrary.push(resultVideo.id);
			 $cookieStore.put('library', store.cookieLibrary);
			 console.log('added');
	 	};
		
		fac.removeFromLibrary = function(libraryVideo){
			angular.forEach(store.library, function(video){
				if(video.id == libraryVideo.id){
					index = store.library.indexOf(video)
					if (index > -1) {store.library.splice(index, 1);}
				}
			})
			angular.forEach(store.cookieLibrary, function(video){
				if(video == libraryVideo.id){
					index = store.cookieLibrary.indexOf(video)
					if (index > -1) {store.cookieLibrary.splice(index, 1);}
				}
			})
			angular.forEach(store.results, function(video){
				if(video.id == libraryVideo.id){
					video.inLibrary = false;
				}
			})
			$cookieStore.put('library', store.cookieLibrary);
			
			if(store.library.length==0){
				libraryStock=false;
				$cookieStore.remove('library');
			}
			console.log('removed');
					
		}

		
    fac.getCookieLibrary = function(){
			if(typeof $cookieStore.get('library') != "undefined"){
				libraryStock = true;
				var PromiseList = [];
				store.cookieLibrary = $cookieStore.get('library');
				angular.forEach(store.cookieLibrary, function(videoId){
					PromiseList.push(YoutubeAPI.youtubeSearch(videoId, 1).then(function(response){
						video = fac.addData(response.data.items[0])
						YoutubeAPI.getStats(video)
						return video
						}));
					})
				}
			else
				return YoutubeAPI.youtubeSearch('lUuOIU6u6oU', 1).then(function(response){
						video = fac.addData(response.data.items[0])
						YoutubeAPI.getStats(video)
						console.log(video)
						store.init = video
						store.detail = video
						return video
				});
			return $q.all(PromiseList).then(function(response){
				store.library = response
				store.init = response[0]
				nowPlaying.id = store.init.id
				return response
				})		
		}			
		
		fac.getResults = function(){
			return store.results
		}
		
		fac.getLibrary = function(){
			return store.library
		}
		
		fac.getLibraryStock = function(){
			return libraryStock
		}
		
		fac.getDetail = function(){
			store.detail = store.init;
			return store.detail
		}
		
			
	return fac
	
})

app.factory('YoutubeAPI', function($http){
	
	var youtubeAPI = {}
	
	youtubeAPI.youtubeSearch = function(query, maxResults){
      return $http.get('https://www.googleapis.com/youtube/v3/search',{
        params: {
          key: 'AIzaSyBy9_bHIiY_cr8xXiPPt8QOGT0Nq2KrbwQ',
          type: 'video',
          maxResults: maxResults,
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/channelTitle,items/snippet/description,items/snippet/thumbnails/high,items/snippet/publishedAt',
					q: query,
        }			  
      })
		};
		
		youtubeAPI.youtubeStatisticsSearch = function(data){
			return $http.get('https://www.googleapis.com/youtube/v3/videos',{
        params: {
        key: 'AIzaSyBy9_bHIiY_cr8xXiPPt8QOGT0Nq2KrbwQ',
        id: data,
				part: 'statistics',
	 		  fields:'items/id,items/statistics/viewCount,items/statistics/likeCount'
        }			  
      });
		};
		
		youtubeAPI.getStats = function(video){
	  return this.youtubeStatisticsSearch(video.id).then(function(stats){
			video.viewCount = parseInt(stats.data.items[0].statistics.viewCount).toLocaleString();
			video.likeCount = parseInt(stats.data.items[0].statistics.likeCount).toLocaleString();
			return video
		})
	}
	
	
		return youtubeAPI
	
	
})