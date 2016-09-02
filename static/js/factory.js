
	app.factory('YoutubeFactory', function($http){
		
		var fac ={};
		
		library =[]			
		results=[]
		
		fac.users = ['J', 'M', 'P'];
		
		fac.search = function(query){
        return $http.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: 'AIzaSyBy9_bHIiY_cr8xXiPPt8QOGT0Nq2KrbwQ',
            type: 'video',
            maxResults: '5',
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
					this.search(query).then(function(videosResponse){
						angular.forEach(videosResponse.data.items, function(video){
							fac.getStatistics(video);
						});
					}, function(error){
						$log.info("Unable to load videos")
					});
					return results
				}
					
	   fac.addToLibrary = function(resultVideo){
		  library.push(resultVideo)
			return library;
		  };
			
			fac.setVideoInLibraryStatus = function(libraryVideo){
				angular.forEach(results, function(resultsVideo){
					if(resultsVideo.id == libraryVideo.id){
						resultsVideo.inLibrary = false;
					}
				})
			}
			
			fac.removeFromLibrary = function(libraryVideo){
				angular.forEach(library, function(video){
					if(video.id == libraryVideo.id){
						index = library.indexOf(video)
						if (index > -1) {library.splice(index, 1);}
					}
				})
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
				
	    fac.getResults = function () {
	        return results;
	      };
			
			fac.getLibrary = function () {
	        return library;
	      };
						
			
		
		return fac;
				
	});

