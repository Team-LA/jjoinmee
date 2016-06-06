angular.module('jauntly.addEventCtrl', [])

.controller('addEventCtrl', function ($scope, $state, AddressGeocoder, ExpediaInfo, GoogleGeocodeInfo, Auth, Event, NgMap) {

  $scope.results = {};
  $scope.address;
  $scope.email = Auth.authData.facebook.email;
  $scope.latlng;
  $scope.coordinates = [34.019269, -118.494344];

  $scope.search = function (location, activity) {
    ExpediaInfo.getExpInfo(location, activity)
    .then(function (results) {
      $scope.results = results.data.activities;
    })
    .catch(function (error) {
      console.error(error);
    });
  };


  $scope.getAddress = function (latlng) {
    GoogleGeocodeInfo.getAddress(latlng)
    .then(function (address) {
      $scope.address = address.data.results[0].formatted_address;
    })
  };

  $scope.postEvent = function (inputTitle, address, datetimeValue, duration, imageUrl) {

  AddressGeocoder.getLocation(address)
  .then(function(result){
    if(result.success){
      $scope.latlng = result.location.latitude + "," + result.location.longitude;
      console.log("SCOPE LATLNG ISSSS: ", $scope.latlng);
    }
  })
  .then(function(){
    console.log("Line 67: ", $scope.latlng);
    Event.submitEvent({inputTitle: inputTitle, 
      address: address, 
      latlng: $scope.latlng,
      datetimeValue: datetimeValue, 
      duration: duration, 
      Email: $scope.email})
      .then(function() {
        console.log('in addEventCtrl event added', $scope.latlng);
        $scope.inputTitle = null;
        $scope.duration = null;
        $scope.imageUrl = null;
        $scope.datetimeValue = null;
        $scope.address = null;
        $scope.latLng = null;
      })
      .then(function() {
        console.log('event added');
        $state.go('app.myEvents');
      })
  })
  }

  $scope.clearFields = function () {
    $scope.inputTitle = null;
    $scope.duration = null;
    $scope.imageUrl = null;
    $scope.datetimeValue = null;
    $scope.address = null;
    $scope.latlng = null;
    $state.go($state.current, {}, {reload: true, inherit: false});
  }

  NgMap.getMap().then(function(map) {});

});
