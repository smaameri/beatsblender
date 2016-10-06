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
	
	
	$window.onYouTubeIframeAPIReady = function(){
    $log.info('Youtube API is ready');
    youtube.ready = true;
		youtubePlayer.playerInit(store.library[0].id);
  }
	
	youtubePlayer.youtubeAPIInit = function(){
		var tag = document.createElement('script');
		tag.src = "http://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
	
	youtubePlayer.playerInit = function(videoId){
		console.log(videoId)
		player = youtubePlayer.createPlayer(videoId);
		console.log(player)
		console.log(player.a)  
		return player
	}

  youtubePlayer.createPlayer = function (videoId) {
		return new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
  };
	
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      youtube.state = 'playing';
			console.log('playing');
    } else if (event.data == YT.PlayerState.PAUSED) {
      youtube.state = 'paused';
			console.log('paused');
    } else if (event.data == YT.PlayerState.ENDED) {
      youtube.state = 'ended';
			console.log('ended');
      nextVideo(nowPlaying)
    }			
  }
	
  function onPlayerReady(event) {
    event.target.playVideo();
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
		this.check();
		player.loadVideoById(videoId);
	}
	
	youtubePlayer.check = function(){
		console.log(player)
		if(player == null)
			{player = this.createPlayer(store.library[0].id);
		console.log('boo')
			}
		return player
	}
	
	
	return youtubePlayer
	
})

app.factory('YoutubeFactory', function($http, $q, $cookieStore, $window, $log, YoutubeAPI, YoutubePlayer){
	
	fac = {}
	
	var detail;
	
	var results = []
	
	var library = []
	
	var youTubeData = []
	
	var libraryStock = false;
	
	store = {
		results:[],
		library:[],
		cookieLibrary:[]
	}
	
	

	function nextVideo(videoId){
		if(libraryVideoPlaying){
			playlist = library;
		}
		else{playlist = results}
		
		var nextVideoIndex;
		angular.forEach(playlist, function(video){
			if(videoId == video.id){
				var index = playlist.indexOf(video)
				if(index < playlist.length - 1){
					nextVideoIndex = index + 1;
				}
				else{nextVideoIndex = 0}
			}
		})
		nowPlaying = playlist[nextVideoIndex].id
    youtube.player.loadVideoById(nowPlaying);
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
	
				
		fac.getAllVideos = function(query, maxResults, list, reset){
			return YoutubeAPI.youtubeSearch(query, maxResults)
				.then(function(videos){
					if(reset)
						store[list].length = 0;
					angular.forEach(videos.data.items, function(video){
						var data = fac.addData(video)
						store[list].push(data)
					})
					return store[list]
				})
				.then(function(response){
					fac.getAllStats(response)
					return store[list]
				})
		}
		
			fac.getAllStats = function(videos){
				youtubeStatisticsPromises = []
				angular.forEach(videos, function(video){
					youtubeStatisticsPromises.push(YoutubeAPI.getStats(video))
				})
				//once all the statistcs promises have been resolved,
				//return all the promises together
				return $q.all(youtubeStatisticsPromises).then(function(response){
					return response
				});
			}
		
		fac.addData = function(video){
			var data;
			return data = {
				id: video.id.videoId,
				title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        author: video.snippet.channelTitle,
				publishedAt:video.snippet.publishedAt.slice(0,-14),
				inLibrary: false
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
				var PromiseList = [];
				store.cookieLibrary = $cookieStore.get('library');
				angular.forEach(store.cookieLibrary, function(videoId){
					PromiseList.push(fac.getAllVideos(videoId, 1, 'library', false));
					libraryStock = true;
					})
				}
			return $q.all(PromiseList).then(function(response){
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
			detail = store.library[0];
			return detail
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