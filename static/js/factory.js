app.factory('messageService', function($q){
	return {
		getMessage:function(){
			return $q.when("Hello World")
		}
	}
})


app.factory("youtube", function($q, YoutubeFactory){
   return {
       getVideos: function(){
       	 return fac.getAllVideos('eminem', 10)
       }
   }
});

app.factory('YoutubeFactory', function($http, $q){
	
	fac = {}
	
	results = []
	
	fac.youtubeSearch = function(query, maxResults){
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
		
		fac.youtubeStatisticsSearch = function(data){
			return $http.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
        key: 'AIzaSyBy9_bHIiY_cr8xXiPPt8QOGT0Nq2KrbwQ',
        id: data,
				part: 'statistics',
	 		  fields:'items/id,items/statistics/viewCount,items/statistics/likeCount'
        }			  
      });
		};
				
		var library = []
				
		fac.getAllVideos = function(query, maxResults){
			return this.youtubeSearch(query, maxResults)
				.then(function(videos){
					angular.forEach(videos.data.items, function(video){
						var data = fac.addData(video)
						library.push(data)
					})
					return fac.getAllStats(library)
				})
				.then(function(response){
					return library
				})
		}
				
			fac.getAllStats = function(videos){
				youtubeStatisticsPromises = []
				angular.forEach(videos, function(video){
					youtubeStatisticsPromises.push(fac.getStats(video))
				})
				//once all the statistcs promises have been resolved,
				//return all the promises together
				return $q.all(youtubeStatisticsPromises).then(function(results){
					return results
				});
			}

			fac.getStats = function(video){
		  return this.youtubeStatisticsSearch(video.id).then(function(stats){
				video.viewCount = parseInt(stats.data.items[0].statistics.viewCount).toLocaleString();
				video.likeCount = parseInt(stats.data.items[0].statistics.likeCount).toLocaleString();
				return video
			})
		}
		
		fac.addData = function(video){
			var data;
			return data = {
				id: video.id.videoId,
				title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        author: video.snippet.channelTitle,
				publishedAt:video.snippet.publishedAt.slice(0,-14),
				
			}
		}

			fac.getResults = function(){
				return results
			}
	
	return fac
	
})