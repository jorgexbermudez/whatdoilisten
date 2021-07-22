app.controller("myCtrl2", function($scope, $http, $cookies,$timeout,$routeParams, $location,$sce) {
	lert("Inicializando CTRL2")
    //Now Playing function
	  $scope.now_playing = function () {
        $http({
          method : "GET",
          url : "https://api.spotify.com/v1/me/player/currently-playing",
          headers:{"Authorization": "Bearer "+$scope.authorization
          }
          }).then(function mySuccess(response) {
                alert("10")
              var npsong = response.data.item.name;
              var npartist = response.data.item.artists[0].name;
              var npuri = []
              npuri [0] = response.data.item.uri;
              alert("Está sonando: "+npsong+" de "+npartist+" con link: "+npuri);
              $scope.playlistidnp = "1dxJXfnfAV46mmLrMEypIN";

              $http({
                  method : "POST",
                  data :{uris:npuri},
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