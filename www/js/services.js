angular.module('jauntly.services', [])

.factory('ExpediaInfo', function ($http) {

  var getExpInfo = function (location, activity) {

    var params = {
      location: location,
      activity: activity,
      apikey: expKey,
      limitTo: 5
    };

    var config = {params: params};
    return $http.get('http://terminal2.expedia.com/x/activities/search', config);
  };

  return {
    getExpInfo : getExpInfo
  };
})
  
.factory('GoogleGeocodeInfo', function ($http) {

  var getAddress = function (latlng) {

    var params = {
      latlng: latlng,
      key: googleMapsApiKey
    };

    var config = {params: params};
    return $http.get('https://maps.googleapis.com/maps/api/geocode/json', config);
  };

  return {
    getAddress : getAddress
  };
})
  
.factory('AddressGeocoder',['$q',function($q) {
  var myGeo;
  var result = function () {
      return {
          success: false,
          message: '',
          location: {
              latitude: '',
              longitude: ''
          }
      }
  };
  myGeo = {
      getLocation:function( address ){
          var deferred = $q.defer();
          var googleMap = new google.maps.Geocoder();
          googleMap.geocode( { 'address': address}, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                  var ok = new result();
                  //console.log(ok);
                  ok.success = true;
                  ok.location.latitude = results[0].geometry.location.lat();
                  ok.location.longitude = results[0].geometry.location.lng();
                  deferred.resolve(ok);
              } else {
                  var error = new result();
                  error.message = 'The geocode was not successful for the these reasons: ' + status;
                  deferred.reject(error);
              }
          });
          return deferred.promise;
      }
  };
  return myGeo;
}])



  
.factory("Auth", function($firebaseAuth) {

  var ref = new Firebase(firebaseKey);
  var auth = $firebaseAuth(ref);
  var authData = null;
  var isSignedIn = false;

  return {
    ref : ref,
    auth: auth,
    authData: authData,
    isSignedIn: isSignedIn
  }
})

.factory("FB", function($http) {
  var postEmail = function (data) {
    //var plugin = {Email: email};
    return $http.post('/api/login/user', data);
  };
  return {
    postEmail: postEmail
  }
})

.factory("Event", function($http) {
  var getAllEvents = function (email) {
    var plugin = {Email: email};
    return $http.get('/api/events/events', plugin);
  };

  var submitEvent = function (data) {
    console.log('in submitEvent', data)
    return $http.post('/api/events/events', data);
  };

  var getMyEvents = function () {
    return $http.get('/api/events/events');
  };

  var getMyID = function (data) {
    var plugin = {Email: data};
    return $http.post('/api/users/users', plugin);
  };

  var getAttendees = function(id) {
    var params = {id: id};
    var config = {params: params};
    var url = 'api/event/' + id;
    return $http.get(url, config);
  }

  var postToJoint = function (eventID, userID) {
    var plugin = {eventID: eventID, userId: userID};
    return $http.post('/api/join/events', plugin);
  };

  var postID = function (userID) {
    var plugin = {userId: userID};
    return $http.post('/api/filter/events', plugin);
  };

  var deleteEvent = function (id) {
    var params = {id: id};
    var config = {params: params};
    var url = '/api/myevents/' + id;
    console.log("line 104 delete events", url)
    return $http.delete(url, config);
  };

  var unjoinEvent = function(eventid, userid) {
    var params= {EventID: eventid, UserId: userid};
    var config = {params: params};
    var url = '/api/unjoinevent/' + eventid;
    return $http.delete(url, config);
  };

  var findCreator = function(id) {
    var params = {id: id};
    var config = {params: params};
    var url = 'api/event/' + id;
    return $http.post(url, config);
  }

  var getFullEvents = function() {
    return $http.get('/api/events/allevents');
  }

  return {
    getFullEvents: getFullEvents,
    getAllEvents: getAllEvents,
    submitEvent: submitEvent,
    getMyEvents: getMyEvents,
    getMyID: getMyID,
    getAttendees: getAttendees,
    postToJoint: postToJoint,
    postID: postID,
    unjoinEvent: unjoinEvent,
    deleteEvent: deleteEvent,
    findCreator: findCreator
  }
});

