app.controller("myCtrl", function($scope, $http, $cookies,$timeout,$routeParams, $location,$sce) {
	
	//alert("Executing controller")
	$scope.playersrc = "https://open.spotify.com/embed/track/7aSH6TRRmt2mDIdEY7fIf5";
	$scope.playlists=[];
	$scope.current_playlist=null;
	$scope.first_call=false;
	$scope.play_length=0;
	$scope.first_cycle=true;
	$scope.playlist_view=1;
	$scope.playlist_songs=[];
	$scope.avg=100;
	$scope.total=0;
	$scope.loading_playlist=false;
	$scope.top_view=1;
	$scope.player_type="artist";
	$scope.player_uri="";
	$scope.loaded_player=false;

	//alert("Playlist: "+$scope.playlists)
//Flags
	  $scope.loading=false;
	  $scope.success_alert = false;
	  $scope.playlists_flag=false;
	  
//Data
	  $scope.type = "artists";
	  $scope.state = null;
	  $scope.timespan= "long_term";
	  $scope.limit = 20;
	  $scope.limit2 = $scope.limit-50;
	  $scope.playlistname = null;
	  $scope.playlistid=null;
	  $scope.playlistaddingname=null;
	  $scope.songsfeatures=null;
	  $scope.country=null;
	  $scope.counter=0;
	  $scope.counter2=0;
	  $scope.artist=null;
	  
//Data lists
	  $scope.topitems=[];
	  $scope.topitems2=[];
	  $scope.songsuris=[];
	  $scope.songid1="";
	  $scope.songid2="";
	  $scope.counter=0;
	  
//Access
	  $scope.authorization = $cookies.get("accesstoken");
	  $scope.status=null;
	  $scope.status2=null;
	  $scope.clientid="6d82c54e550143bdbcd74c580c9b0fbb";
	  $scope.redirecturi="https://jorgexbermudez.github.io/whatdoilisten/Spotify.html";
	  $scope.scope="playlist-read-private%20playlist-modify-private%20playlist-modify-public%20playlist-read-collaborative%20user-modify-playback-state%20user-read-currently-playing%20user-read-playback-state%20user-top-read%20user-read-recently-played%20app-remote-control%20streaming%20user-read-birthdate%20user-read-email%20user-read-private%20user-follow-read%20user-follow-modify%20user-library-modify";
	  $scope.renewuri="https://accounts.spotify.com/authorize?client_id="+$scope.clientid+"&response_type=token&redirect_uri="+$scope.redirecturi+"&scope="+$scope.scope+"&state=123";
	  $scope.currenturl=window.location.href;
  
  
  
//Checks if user is logged in Spotify  
	  if($scope.currenturl.includes("access_token")){
		  $scope.authorization=$scope.currenturl.slice($scope.currenturl.indexOf("access_token")+13, $scope.currenturl.indexOf("&token_type"));
		  $cookies.put("accesstoken",$scope.authorization);
		  window.location.href=$scope.redirecturi;
	  }
  
	  $http({
		    method : "GET",
		    url : "https://api.spotify.com/v1/me",
		    headers:{"Authorization": "Bearer "+$scope.authorization
		    }
		    }).then(function mySuccess(response) {
		    $scope.status = response.status;
		    $scope.profile=response.data;
		    $scope.country=response.data.country;
		  }, function myError(response) {
			  $scope.status = response.status;
		  });

	  
//Login into Spotify account
	  $scope.login = function () {
	      //alert("URL: "+$scope.renewuri);
		  window.location.href = $scope.renewuri;
	  }
	  
//Logout removes access cookies
	  $scope.logout = function () {
		  $cookies.remove("accesstoken");
		  $scope.status=400;
	  }

  
//Copies token into clipboard
	  $scope.alert_token = function () {
		  var textArea = document.createElement("textarea");
		  textArea.value = $cookies.get("accesstoken");
		  document.body.appendChild(textArea);
		  textArea.style.position = 'fixed';
		  textArea.style.top = 0;
		  textArea.style.left = 0;
		  textArea.style.width = '2em';
		  textArea.style.height = '2em';
		  textArea.style.padding = 0;
		  textArea.style.border = 'none';
		  textArea.style.outline = 'none';
		  textArea.style.boxShadow = 'none';
		  textArea.style.background = 'transparent';
		  textArea.select();
		  document.execCommand("copy");
		  try {
			    var successful = document.execCommand('copy');
			    var msg = successful ? 'successful' : 'unsuccessful';
			    alert('Copying text command was ' + msg);
			  } catch (err) {
			    alert('Oops, unable to copy');
			  }
			  document.body.removeChild(textArea);
	  }
	  
	  
//Set type
	  $scope.type_click= function (value) {
		  //alert("In function Type Click "+value)
		  $scope.type = value;
		  $scope.top_caller();
	  }
	  
//Set timespan
	  $scope.time_click= function (value) {
		  //alert("In function Time Click "+value)
		  $scope.timespan = value;
		  $scope.top_caller();
	  }
	  
//Call top artists/tracks
	  $scope.top_caller = function () {
		  if($scope.type=="artists"){
			  $scope.get_top_artists();
		  }else if ($scope.type=="tracks"){
			  $scope.get_top_songs();
		  }
	  }
	  
//Retrieve artists
	  $scope.get_top_artists = function () {
		 $scope.player_type="artist";
	 //Retrieving 50 top artists
		  $http({
			    method : "GET",
			    url : "https://api.spotify.com/v1/me/top/artists?time_range="+$scope.timespan+"&limit=50&offset=0",
			    headers:{"Authorization": "Bearer "+$scope.authorization
			    }
			    }).then(function mySuccess(response) {
			    	//alert("1a "+JSON.stringify(response));
					$scope.topitems=response.data.items;
					$scope.player_uri=response.data.items[0].uri.split(":")[2];
					//alert($scope.player_uri)
			    }, function myError(response) {
			    	//alert("2 "+JSON.stringify(response));
				    $scope.errorMessage = response.statusText;
				  });
	
		  //Retrieving 50-99 top artists
		  $http({
			    method : "GET",
			    url : "https://api.spotify.com/v1/me/top/artists?time_range="+$scope.timespan+"&limit=50&offset=49",
			    headers:{"Authorization": "Bearer "+$scope.authorization
			    }
			    }).then(function mySuccess(response) {
			    	//alert("1a "+JSON.stringify(response));
			    	//Slice to only store 51-99 results
					$scope.topitems2=response.data.items.slice(1);
			    }, function myError(response) {
			    	//alert("2 "+JSON.stringify(response));
				    $scope.errorMessage = response.statusText;
				  });
		  
	  }
	  
	  
//Get artists ids
	  $scope.get_artist_id = function () {
		  //alert("Inside artist id");
		  $scope.artistid1=[];
		  $scope.artistid2=[];
		  if($scope.limit<=50){
			  //alert("if");
			  //alert("$scope.songid1: "+$scope.songid1);
			  for(var i = 0; i < $scope.limit; i++){
				  $scope.artistid1[i] = $scope.topitems[i].id;
			  }
		  }else{
			  //alert("else")
			  for(var i = 0; i < 50; i++){
				  $scope.artistid1[i] = $scope.topitems[i].id;
			  }
			  for(var i = 0; i < $scope.limit-50; i++){
				  $scope.artistid2[i] = $scope.topitems2[i].id;
			  }
		  }
		  //alert("AID1"+$scope.artistid1);
		  //alert("AID2"+$scope.artistid2);
		  $scope.get_artist_top_songs();
	  }
  
	  
//Retrieve 3 top songs from ARTISTS
	  $scope.get_artist_top_songs = function () {
		  $scope.artist_song_uri=[];
		  $scope.artist_song_uri1=[];
		  $scope.artist_song_uri2=[];
		  $scope.artist_song_uri3=[];
		  $scope.counter=0;
		  $scope.counter2=0;
		  $scope.cycle_limit=50;
		  if($scope.limit<50){
			  $scope.cycle_limit=$scope.limit;
		  }
			  for(var i = 0; i < $scope.cycle_limit; i++){
				  //alert("Getting songs from: "+$scope.topitems[i].name)
				  $http({
					    method : "GET",
					    url : "https://api.spotify.com/v1/artists/"+$scope.artistid1[i]+"/top-tracks?country="+$scope.country,
					    headers:{"Authorization": "Bearer "+$scope.authorization
					    }
					    }).then(function mySuccess(response) {
					    	if(typeof response.data.tracks[0].uri==="undefined"){}
					    	else{
					    		$scope.artist_song_uri.push(response.data.tracks[0].uri);
					    	}
					    	if(typeof response.data.tracks[1].uri==="undefined"){}
					    	else{
					    		$scope.artist_song_uri.push(response.data.tracks[1].uri);
					    	}
					    	if(typeof response.data.tracks[2].uri==="undefined"){}
					    	else{
					    		$scope.artist_song_uri.push(response.data.tracks[2].uri);
					    	}
					    	$scope.counter+=1;
					    	if ($scope.counter==$scope.cycle_limit){
					    		if($scope.limit<51){
					    			$scope.divideuris();
					    		}else{
					    			$scope.get_artist_top_songs2();
					    		}
					    		
					    	}
					    }, function myError(response) {
					    	alert("T3f1: "+JSON.stringify(response));
						  });
			  }
	  }
			  
		$scope.get_artist_top_songs2 = function () {		  
			  for(var i = 0; i < $scope.limit-50; i++){
				  $http({
					    method : "GET",
					    url : "https://api.spotify.com/v1/artists/"+$scope.artistid2[i]+"/top-tracks?country="+$scope.country,
					    headers:{"Authorization": "Bearer "+$scope.authorization
					    }
					    }).then(function mySuccess(response) {
					    	if(typeof response.data.tracks[0].uri==="undefined"){}
					    	else{
					    		$scope.artist_song_uri.push(response.data.tracks[0].uri);
					    	}
					    	if(typeof response.data.tracks[1].uri==="undefined"){}
					    	else{
					    		$scope.artist_song_uri.push(response.data.tracks[1].uri);
					    	}
					    	if(typeof response.data.tracks[2].uri==="undefined"){}
					    	else{
					    		$scope.artist_song_uri.push(response.data.tracks[2].uri);
					    	}
					    	$scope.counter2+=1;
					    	if ($scope.counter2==$scope.limit-50){
					    			$scope.divideuris();
					    	}
					    }, function myError(response) {
					    	alert("T3f2: "+JSON.stringify(response));
						  });
			  }
			  
		  }
	  
	  
	  
//Intermediate check
	  $scope.intermediate_check = function () {
		  if($scope.counter2==$scope.limit-50 && $scope.counter==$scope.limit){
			  $scope.divideuris();
		  }
	  }
	  
	  $scope.divideuris = function () {
		  //alert("Total: "+$scope.artist_song_uri)
		  $scope.artist_song_uri1=$scope.artist_song_uri.slice(0,99);
		  $scope.artist_song_uri2=$scope.artist_song_uri.slice(99,198);
		  $scope.artist_song_uri3=$scope.artist_song_uri.slice(198);
		  //alert("Uris1: "+$scope.artist_song_uri1);
		  //alert("Uris2: "+$scope.artist_song_uri2);
		  //alert("Uris3: "+$scope.artist_song_uri3);
		  $scope.new_playlist();
	  }
	  
	  
	  
//Retrieve top songs
	  $scope.get_top_songs = function () {
		  $scope.player_type="track";
//Retrieving 50 top songs
	  $http({
		    method : "GET",
		    url : "https://api.spotify.com/v1/me/top/tracks?time_range="+$scope.timespan+"&limit=50&offset=0",
		    headers:{"Authorization": "Bearer "+$scope.authorization
		    }
		    }).then(function mySuccess(response) {
		    	//alert("1s "+JSON.stringify(response));
				$scope.topitems=response.data.items;
		    }, function myError(response) {
		    	//alert("2 "+JSON.stringify(response));
			    $scope.errorMessage = response.statusText;
			  });

//Retrieving 50-99 top songs
	  $http({
		    method : "GET",
		    url : "https://api.spotify.com/v1/me/top/tracks?time_range="+$scope.timespan+"&limit=50&offset=49",
		    headers:{"Authorization": "Bearer "+$scope.authorization
		    }
		    }).then(function mySuccess(response) {
		    	//alert("1s "+JSON.stringify(response));
		    	//Slice to only store 51-99 results
				$scope.topitems2=response.data.items;
		    }, function myError(response) {
		    	//alert("2 "+JSON.stringify(response));
			    $scope.errorMessage = response.statusText;
			  });
	  }
  
	  
//Calls top artists/songs depending on selection
	  $scope.get_top = function () {
		  if($scope.type=="artists"){
			  $scope.get_top_artists();
		  }else if ($scope.type=="tracks"){
			  $scope.get_top_songs();
		  }else{
			  alert("Else option");
		  }
	  }
	  
//Calls create song/artist playlist
	  $scope.create_playlist = function () {
		  $scope.loading=true;
		  //alert("Inside Create playlist");
		  if($scope.type=="artists"){
			  $scope.create_artist_playlist();
		  }else if ($scope.type=="tracks"){
			  $scope.create_song_playlist();
		  }else{
			  alert("Else option");
		  }
	  }
	  
//Artists playlist
	  $scope.create_artist_playlist = function () {
		  //Call get artist id
		  $scope.get_artist_id()
	  }
	  
	  
	  
	  
	  
//Songs playlist
	  $scope.create_song_playlist = function () {
		  //alert("Creating Song Playlist")
		  $scope.get_song_uri();
	  }
	  
	  
//New Playlist
	  $scope.new_playlist = function () {
		  //alert ("Inside new Playlist");
		  $http({
			    method : "POST",
			    url : "https://api.spotify.com/v1/me/playlists",
			    data: {name:$scope.playlistname,description:"Created with whatdoilisten.com"},
			    headers:{"Authorization": "Bearer "+$scope.authorization, "Content-Type":"application/json"}
		  	}).then(function mySuccess(response) {
			    	//alert ("Playlist Created");
			    	//alert(JSON.stringify(response))
			    	$scope.playlistid=response.data.id;
			    	//alert("Playlist id: "+$scope.playlistid)
			    	$scope.add_songs();
			    	
			  }, function myError(response) {
				  	//alert(JSON.stringify(response))
				  alert ("21 "+response.status)
				  $scope.loading=false;
				  $scope.display_fail();
			  });
	  }
	  
	  
//Get song id
	  $scope.get_song_id = function () {
		  //alert("Inside song id");
		  $scope.songid1="";
		  $scope.songid2="";
		  if($scope.limit<=50){
			  //alert("if");
			  //alert("$scope.songid1: "+$scope.songid1);
			  for(var i = 0; i < $scope.limit; i++){
				  $scope.songid1 += $scope.topitems[i].id+",";
			  }
		  }else{
			  //alert("else")
			  for(var i = 0; i < 50; i++){
				  $scope.songid1 += $scope.topitems[i].id+",";
			  }
			  for(var i = 0; i < $scope.limit-50; i++){
				  $scope.songid2 += $scope.topitems[i].id+",";
			  }
		  }
		  //alert("SID1"+$scope.songid1);
		  //alert("SID2"+$scope.songid2);
		  
	  }

	  
//Get song uri
	  $scope.get_song_uri = function () {
		  //alert("Inside song uri");
		  $scope.songuris=[];
		  if($scope.limit<=50){
			  //alert("if");
			  //alert("$scope.songuri1: "+$scope.songuri1);
			  for(var i = 0; i < $scope.limit; i++){
				  $scope.songuris.push($scope.topitems[i].uri);
			  }
		  }else{
			  //alert("else")
			  for(var i = 0; i < 50; i++){
				  $scope.songuris.push($scope.topitems[i].uri);
			  }
			  for(var i = 0; i < $scope.limit-50; i++){
				  $scope.songuris.push($scope.topitems[i].uri);
			  }
		  }
		  //alert("SURIs "+$scope.songuris);
		  $scope.new_playlist();
	  }
	  
//Add songs to playlist
	  $scope.add_songs = function () {
		  alert ("Adding songs to "+$scope.playlistid);
		  //alert ("Song URIs: "+$scope.songuri1)
		  //alert("https://api.spotify.com/v1/playlists/"+$scope.playlistid+"/tracks?uris="+$scope.songuri1)
		  if($scope.type=="tracks"){
			  //alert("Posting: "+$scope.songuris)
			  $http({
				    method : "POST",
				    data :{uris:$scope.songuris},
				    url : "https://api.spotify.com/v1/playlists/"+$scope.playlistid+"/tracks",
				    headers:{"Authorization": "Bearer "+$scope.authorization, "Content-Type":"application/json"}
			  	}).then(function mySuccess(response) {
				    	//alert ("Songs successfully added")
			  			$scope.loading=false;
				    	$scope.display_success();
				  }, function myError(response) {
					  $scope.loading=false;
					  $scope.display_fail();
					  	//alert ("2 "+JSON.stringify(response))
				  });

		  }else{
			  //alert("Posting1: "+$scope.artist_song_uri1)
				  $http({
					    method : "POST",
					    data:{uris: $scope.artist_song_uri1},
					    url : "https://api.spotify.com/v1/playlists/"+$scope.playlistid+"/tracks",
					    headers:{"Authorization": "Bearer "+$scope.authorization, "Content-Type":"application/json"}
				  	}).then(function mySuccess(response) {
					    	//alert ("Songs successfully added")
				  		if($scope.limit<34){
				  			$scope.loading=false;
					    	$scope.display_success();
				  		}
					  }, function myError(response) {
						  $scope.loading=false;
						  $scope.display_fail();
						  alert ("201 "+JSON.stringify(response))
					  });
			  if($scope.limit>33){
				  //alert("Posting2: "+$scope.artist_song_uri2)
				  $http({
					    method : "POST",
					    data:{uris: $scope.artist_song_uri2},
					    url : "https://api.spotify.com/v1/playlists/"+$scope.playlistid+"/tracks",
					    headers:{"Authorization": "Bearer "+$scope.authorization, "Content-Type":"application/json"}
				  	}).then(function mySuccess(response) {
					    	//alert ("Songs successfully added")
				  		if($scope.limit<67){
				  			$scope.loading=false;
					    	$scope.display_success();
				  		}
					  }, function myError(response) {
						  $scope.loading=false;
						  $scope.display_fail();
						  alert ("202 "+JSON.stringify(response))
					  });
			  }if($scope.limit>66){
				  //alert("Posting3: "+$scope.artist_song_uri3)
				  $http({
					    method : "POST",
					    data:{uris: $scope.artist_song_uri3},
					    url : "https://api.spotify.com/v1/playlists/"+$scope.playlistid+"/tracks",
					    headers:{"Authorization": "Bearer "+$scope.authorization, "Content-Type":"application/json"}
				  	}).then(function mySuccess(response) {
					    	//alert ("Songs successfully added")
				  			$scope.loading=false;
					    	$scope.display_success();
					  }, function myError(response) {
						  $scope.loading=false;
						  $scope.display_fail();
						  alert ("203 "+JSON.stringify(response))
					  });
			  }
			  
		  }
}

	  
//Alert success
	  $scope.display_success = function() {
	        $scope.success_alert = true;
	      $timeout(function() {
	        $scope.success_alert = false;
	      }, 5000)
	    };
	    
//Alert fail
		  $scope.display_fail = function() {
		        $scope.fail_alert = true;
		      $timeout(function() {
		        $scope.fail_alert = false;
		      }, 2000)
		    };
		    
			$scope.toggle_top = function() {
				//alert("Before View "+$scope.playlist_view);
				if($scope.top_view==1){
					$scope.top_view=2;
					//alert("After View "+$scope.playlist_view);
				}else if ($scope.top_view==2){
					$scope.top_view=1;
					//alert("After View "+$scope.playlist_view);
				}
				//$scope.topFunction();
			}
		    
		    
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
		
//Playlists Tab

		    $scope.get_playlists2 = function() {
				$http({
				    method : "GET",
				    url : $scope.url_playlist,
				    headers:{"Authorization": "Bearer "+$scope.authorization
				    }
				    }).then(function mySuccess(response) {
				    	//alert("1s "+JSON.stringify(response));
				    	$scope.playlists.push(response.data.items);
				    	//alert("Total: "+response.data.total);
				    	//alert("Next: "+response.data.next);
				    	if(response.data.next!=null){
				    		$scope.url_playlist=response.data.next;
					    	$scope.get_playlists2();
				    	}else{
				    		if($scope.playlists_flag==false){
				    			//alert("Sending details")
				    			$scope.playlists_flag=true;
						    	$scope.current_playlist=$scope.playlists[0][0].href;
						    	$scope.playlist_details($scope.current_playlist);
				    		}
				    	}
				    	//alert("Array: "+$scope.playlists);
				    }, function myError(response) {
				    	//alert("2f "+JSON.stringify(response));
					    $scope.errorMessage = response.statusText;
					  });
				}
		    
		    
		$scope.url_playlist="https://api.spotify.com/v1/me/playlists?limit=50";
		$scope.get_playlists = function() {
			if($scope.first_cycle==true);{
				$scope.first_cycle=false
				//alert("Getting playlists");
				$scope.get_playlists2();
			}

		};
		
		$scope.get_playlists();
		
		//Playlist details
		$scope.playlist_details = function(href) {
			//alert("Inside Playlist details with: "+href)
			$scope.loading_playlist=false;
			$scope.current_playlist=href;
			$http({
			    method : "GET",
			    url : href,
			    headers:{"Authorization": "Bearer "+$scope.authorization
			    }
			    }).then(function mySuccess(response) {
			    	//alert("1spd "+JSON.stringify(response));
			    	//alert("1spdata "+JSON.stringify(response.data));
			    	//alert("1spdatatracks"+JSON.stringify(response.data.tracks));
			    	//alert("1spdataimages0 "+JSON.stringify(response.data.images[0]));
					$scope.playlist_data=response.data;
					$scope.playlist_songs=$scope.playlist_data.tracks.items;
					$scope.playlist_duration();
					//alert($scope.artist.name);

			    }, function myError(response) {
			    	alert("2pdf "+JSON.stringify(response));
				    $scope.errorMessage = response.statusText;
				  });
		}
		
		$scope.playlist_duration = function() {
			//alert("Inside playlist duration")
			$scope.play_length=0;
			var tracks = $scope.playlist_data.tracks.items;
			//alert("Tracks array: "+tracks);
//			alert(JSON.stringify(tracks))
			//alert("Track 0"+JSON.stringify(tracks[0].track.duration_ms))
			tracks.forEach(function(song) {
				$scope.play_length+=song.track.duration_ms;
			});
			$scope.average_popularity();
			//alert("Total length: "+$scope.play_length)
		}
		
		
		$scope.toggle_playlist = function() {
			//alert("Before View "+$scope.playlist_view);
			if($scope.playlist_view==1){
				$scope.playlist_view=2;
				//alert("After View "+$scope.playlist_view);
			}else if ($scope.playlist_view==2){
				$scope.playlist_view=1;
				//alert("After View "+$scope.playlist_view);
			}
			//$scope.topFunction();
		}
		
		
		$scope.change_pl_view = function() {
			//alert("Changing view");
			$scope.playlist_view=2;
			$scope.topFunction();
		}
		
		$scope.average_popularity = function() {
			//alert("Inside average popularity")
			$scope.total=0;
			$scope.counter=0;
			var tracks = $scope.playlist_data.tracks.items;
			tracks.forEach(function(song) {
				//alert("Popularity: "+song.track.popularity)
				$scope.total=$scope.total+song.track.popularity;
				$scope.counter+=1;
			});
			$scope.avg=Math.round($scope.total/$scope.counter);
			$scope.loading_playlist=true;
			//alert("Popularity: "+$scope.avg)
		}
		
				
		
		$scope.topFunction = function() {
			  document.body.scrollTop = 0; // For Safari
			  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
			}
			
		$scope.open_spotify = function(url) {
			  //alert("Url: "+url);
			  window.open(url,'_blank')
			}
			
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------		
//Now Playing function
$scope.now_playing = function () {
	$http({
	  method : "GET",
	  url : "https://api.spotify.com/v1/me/player/currently-playing",
	  headers:{"Authorization": "Bearer "+$scope.authorization
	  }
	  }).then(function mySuccess(response) {
		  $scope.npsong = response.data.item.name;
		  $scope.npartist = response.data.item.artists[0].name;
		  $scope.npuri = []
		  $scope.npuri [0] = response.data.item.uri;
		  $scope.npurishort = response.data.item.uri.split(":")[2];
		  alert($scope.npurishort);
		  $scope.playersrc = "https://open.spotify.com/embed/track/"+$scope.npurishort;

		  $http({
			  method : "POST",
			  data :{uris:$scope.npuri},
			  url : "https://api.spotify.com/v1/playlists/"+$scope.playlistidnp+"/tracks",
			  headers:{"Authorization": "Bearer "+$scope.authorization, "Content-Type":"application/json"}
			}).then(function mySuccess(response) {
				  alert ("Songs successfully added")
					$scope.loading=false;
				  $scope.display_success();
			}, function myError(response) {
				$scope.loading=false;
				$scope.display_fail();
					alert ("2 "+JSON.stringify(response))
			});
	  }, function myError(response) {
		  alert("Hubo un error "+JSON.stringify(response));
		  $scope.errorMessage = response.statusText;
		});
}

}); 
