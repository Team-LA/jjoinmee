angular.module('jauntly.searchCtrl', [])

.controller('searchCtrl', function($scope, Event, Auth) {
  $scope.data;
  $scope.myID;
  $scope.users;

  $scope.getSearchResult = function() {
  Event.getMyEvents(Auth.authData.facebook.email)
    .then(function(data) {
      $scope.data = data.data;
      // for(var i = 0; i < $scope.data.length; i++) {
      //   $scope.data[i].joined = false;
      //   console.log('$scope.data line 14', $scope.data)
      // }
    })
    .then(function(){
    
    })
    .then(function() {
      Event.getMyID(Auth.authData.facebook.email)
        .then(function(data) {
      $scope.myID = data.data[0].id;
      })
    })
  };

  $scope.showAttendees = function(id) {
    //get all attendees info array
    Event.getAttendees(id).then(function(data) {
      console.log('data in showAttendees', data.data);
      $scope.users = data.data;
      //get creator id
      // Event.findCreator(id).then(function(data){
      //   //console.log('get creator id', data.data[0].userId)
      // });
    })
  };

  $scope.joinEvent = function(eventID) {
    Event.postToJoint(eventID, $scope.myID)
    // .then(function(){
    //   for(var i = 0; i < $scope.data.length; i++) {
    //     if($scope.data[i].id === eventID){
    //   console.log('in joinEvent line 40', eventID,$scope.data)
    //       $scope.data[i].joined = true;
    //       console.log('joined', $scope.data[i].joined)
    //     }
    //   }
    // });
  };

  $scope.ifJoined = function(id) {
    // Event.getAttendees(id).then(function(data) {
    //   console.log('data in showAttendees', data.data);
    //   $scope.users = data.data;
    // })
    // for(var i = 0; i < $scope.users.length; i++) {
    //   if($scope.users[i]){}
    // }
  }
  
  $scope.getSearchResult();
});
