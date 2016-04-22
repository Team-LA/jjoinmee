angular.module('jauntly.searchCtrl', [])

.controller('searchCtrl', function($scope, Event, Auth) {
  $scope.data;
  $scope.myID;
  $scope.users;
  $scope.filtered = [];

  $scope.getSearchResult = function() {
      Event.getMyID(Auth.authData.facebook.email)
        .then(function(data) {
      $scope.myID = data.data[0].id;
      }).then(function() {



  Event.getMyEvents(Auth.authData.facebook.email)
    .then(function(data) {
    $scope.data = data.data;
    console.log('all data, myID',$scope.myID, data.data)
    //all events data inner join users_events
    $scope.filtered.push(data.data[0]);
    ifJoined($scope.filtered[0]);
    //loop thought array to remove repeated events
    for(var i = 1; i < data.data.length; i++) {
      if(data.data[i].EventID !== $scope.filtered[$scope.filtered.length-1].EventID) {
        $scope.filtered.push(data.data[i]);
        ifJoined(data.data[i]);
      } else {
        ifJoined(data.data[i]);
      }
    }
    console.log('filtered', $scope.filtered)
  })

      })
    // .then(function() {
    //   Event.getMyID(Auth.authData.facebook.email)
    //     .then(function(data) {
    //   $scope.myID = data.data[0].id;
    //   })
    // })
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
    Event.postToJoint(eventID, $scope.myID);
  };

  $scope.unjoinEvent = function(eventID) {
    Event.unjoinEvent(eventID, $scope.myID);
  }

  $scope.shouldShow = function(id) {
    $scope.joined = false;
    console.log('in shouldshow', $scope.joined)
    Event.getAttendees(id)
    .then(function(data){
      for(var i = 0; i < data.data.length; i++){
        if(data.data[i].UserId === $scope.myID) {
          if(id === data.data[i].EventID) {
            $scope.joined = true;
          }
        }
      }
      console.log('$scope.joined', $scope.joined)
    })
  }
  
  $scope.getSearchResult();

  function ifJoined(event) {
    if($scope.filtered[$scope.filtered.length-1].joined !== true) {
      $scope.filtered[$scope.filtered.length-1].joined = false;
    }

    if(event.UserId === $scope.myID) {
        $scope.filtered[$scope.filtered.length-1].joined = true;
    } 
  }
});
