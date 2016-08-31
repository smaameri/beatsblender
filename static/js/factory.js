
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
            fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/publishedAt',
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
				results.length=0;
				angular.forEach(data, function(items){
		        results.push({
		          id: items.videoId,
		          title: items.snippet.title,
							
		        });
		      });
					console.log(data);
		      return results;
		    };
				
		
	   fac.addToLibrary = function(id, title){
		  library.push({
		  		id:id,
				title:title
		  	})
			return library;
		  };
			
	    fac.getResults = function () {
	        return results;
	      };
			
			fac.getLibrary = function () {
	        return library;
	      };
						
			
		
		return fac;
				
	});

