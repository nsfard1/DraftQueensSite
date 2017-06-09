app.controller('lobbyController',
 ['$scope', '$state', '$http', '$uibModal', 'notifyDlg', 'lobbies', '$interval',
 function($scope, $state, $http, $uibM, nDlg, lobbies, $interval) {

   $scope.lobbies = lobbies;

   $scope.getLobbies = function() {
      $http.get('/Lobbies')
      .then(function(rsp) {
         $scope.lobbies = rsp.data;
      });
   };

   $interval($scope.getLobbies, 2000);

   $scope.joinLobby = function(lobbyId) {
      $scope.dlgTitle = "Join Lobby";
      $uibM.open({
         templateUrl: 'Lobby/joinLobbyDlg.template.html',
         scope: $scope
      }).result
      .then(function(teamName) {
         // TODO: Post a new team in lobbyId to the server
         console.log(teamName + " playing in lobby " + lobbyId);
      })
      .then(function() {
         // TODO: Do a state.go to the proper lobby
         $state.go('draft', ({lobbyId: lobbyId}));         
      })
      .catch(function(err) {
         if (err) {
            nDlg.show($scope, "An error occurred...\n" + err, "Error");
         }
      });
   };

   $scope.newLobby = function() {
      $scope.dlgTitle = "New Lobby";
      var selectedName;

      $uibM.open({
         templateUrl: 'Lobby/editLobbyDlg.template.html',
         scope: $scope
      }).result
      .then(function(lobbyName) {
         selectedTitle = lobbyName;
         return $http.post('/Lobbies', {name: lobbyName});
      })
      .then(function() {
         return $http.get('/Lobbies');
      })
      .then(function(rsp) {
         $scope.lobbies = rsp.data;
      })
      .catch(function(err) {
         if(err) {
            nDlg.show($scope, "Another lobby already has title " +
             selectedTitle + "\n" + err, "Error");
         }
      });
   };

}]);
