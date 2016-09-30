
app.factory('YoutubeFactory', function($http, $log, $window, $cookieStore){
		
		var fac ={};
		
		results=[]
				
		var player;
		
		var nowPlaying;
		
		var libraryVideoPlaying;
		
		var libraryStock = false;
		
		var playlist;	
		
		var library = []
		
		var cookieLibrary = []
		
		var detailLanding = []
		
		var detail = []
	 	
		
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
			console.log('player ready!!');
    }
		
	  function onPlayerStateChange(event) {
	    if (event.data == YT.PlayerState.PLAYING) {
	      youtube.state = 'playing';
				console.log(library);
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
		
	  fac.createPlayer = function (videoId) {
	    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
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
		
    function onPlayerReady(event) {
      event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
		
		
		
		fac.search = function(query, maxResults){
        return $http.get('https://www.googleapis.com/youtube/v3/search', {
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
			
			fac.views = function(data){
				return $http.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
          key: 'AIzaSyBy9_bHIiY_cr8xXiPPt8QOGT0Nq2KrbwQ',
          id: data,
					part: 'statistics',
		 		  fields:'items/id,items/statistics/viewCount,items/statistics/likeCount'
          }			  
        });
			};
			
		  fac.listResults = function(data){
				results.push({
		          id: data.id.videoId,
		          title: data.snippet.title, 
			        description: data.snippet.description,
			        thumbnail: data.snippet.thumbnails.high.url,
			        author: data.snippet.channelTitle,
							likeCount:parseInt(data.likes).toLocaleString(),
							viewCount:parseInt(data.views).toLocaleString(),
							publishedAt:data.snippet.publishedAt.slice(0,-14),
							inLibrary:fac.isVideoInLibrary(data),
		        });
		      return results;
		    };
				
			  fac.listCookieLibrary = function(data){
					lib.push({
			          id: data.id.videoId,
			          title: data.snippet.title, 
				        description: data.snippet.description,
				        thumbnail: data.snippet.thumbnails.high.url,
				        author: data.snippet.channelTitle,
								publishedAt:data.snippet.publishedAt.slice(0,-14),
			        });
						
						cookieVideo = lib[0]
							
						console.log('cookieDetail');
						console.log(cookieVideo);
						
			      return lib;
			    };
					
				  fac.listDetailVideo = function(data){
						console.log('data');
						console.log(data);
						detail = {
				          id: data.id.videoId,
				          title: data.snippet.title, 
					        description: data.snippet.description,
					        thumbnail: data.snippet.thumbnails.high.url,
					        author: data.snippet.channelTitle,
									publishedAt:data.snippet.publishedAt.slice(0,-14),
				        };
				      return detail;
				    };
		
				fac.getStatistics = function(video){
					this.views(video.id.videoId).then(function(response2){
								video.views = response2.data.items[0].statistics.viewCount;
								video.likes = response2.data.items[0].statistics.likeCount;
								fac.listResults(video);
					}, function(error){
						$log.info("Unable to load video statistics")
					});
				}
				
				fac.getVideo = function(query){
					this.search(query, 20).then(function(videosResponse){
						angular.forEach(videosResponse.data.items, function(video){
							fac.getStatistics(video);
						});
					}, function(error){
						$log.info("Unable to load videos")
					});
					return results
				}
					
	    fac.getResults = function () {
	        return results;
	      };
				
		  fac.getDetail = function (video) {
				detail = video;
						return detail;
		      };
			
		  fac.getCookieVideo = function () {
				return cookieVideo;
		      };
			
				
			fac.setDetail = function(video){
				detail = video;
				return detail
					}
			
			fac.setDetail2 = function(videoId){
				console.log('boo');
				console.log(videoId);
				fac.search(videoId,1).then(function(videoResponse){
					fac.listDetailVideo(videoResponse.data.items[0]);
					console.log('boo2');
					console.log(detail);
				}), function(error){$log.info("Unable to load videos")};
				return detail
		}

	
	 fac.addToLibrary = function(resultVideo){
		library.push(resultVideo);
		cookieLibrary.push(resultVideo.id);
		$cookieStore.put('library', cookieLibrary);
		return library
	  };
		
		fac.setVideoInLibraryStatus = function(libraryVideo){
			angular.forEach(results, function(resultsVideo){
				if(resultsVideo.id == libraryVideo.id){
					resultsVideo.inLibrary = false;
				}
			})
		}
		
		fac.removeFromLibrary = function(libraryVideo){
			console.log(library);
			angular.forEach(library, function(video){
				console.log(video);
				if(video.id == libraryVideo.id){
					index = library.indexOf(video)
					if (index > -1) {library.splice(index, 1);}
				}
			})
			angular.forEach(cookieLibrary, function(video){
				if(video == libraryVideo.id){
					index = cookieLibrary.indexOf(video)
					if (index > -1) {cookieLibrary.splice(index, 1);}
				}
			})
			$cookieStore.put('library', cookieLibrary);
			console.log()
		}
		
		fac.isVideoInLibrary = function(video){
			var inLibrary;
			if(library.length==0){inLibrary=false}
			else(
				angular.forEach(library, function(libraryVideo){
					if(video.id.videoId==libraryVideo.id){inLibrary=true;}
					else(inLibrary=false)
				})
			)
			return inLibrary
		}
		
		fac.getCookieLibrary = function () {
			if(typeof $cookieStore.get('library') != "undefined"){
				cookieLibrary = $cookieStore.get('library')
			}
			
			return cookieLibrary;
			
      };
			
			var lib = []
			
			var cookieVideo = []
			
			fac.generateLibraryFromCookie = function(){
				angular.forEach(cookieLibrary, function(videoId){
					fac.search(videoId,1).then(function(videoResponse){
						angular.forEach(videoResponse.data.items, function(video){
							fac.listCookieLibrary(video);
						});
					}), function(error){$log.info("Unable to load videos")};
				})
			return lib
			}
		
		fac.getLibrary = function () {
			if(typeof $cookieStore.get('library') != "undefined"){				
				library = lib;
			}
			return library;
      };
			
		return fac;
		
	})
