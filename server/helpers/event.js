var knex = require('../database').knex;
var Event = {};
var https = require('https');


Event.get = function(id) {
  return new Promise(function(resolve) {
    if (resolve) {
      knex('events').where('id', id).then(function(data) {
        resolve(data);
      })
    }
  })
};

Event.delete = function(id) {
  return new Promise(function(resolve) {
    if (resolve) {
      knex('users_events').where('EventID', id).del()
        .then(function() {
          knex('events').where('id', id).del()
            .then(function() {
              resolve(true);
            })
        })
    }
  })
};

Event.join = function (eventID, userId) {
  return new Promise(function(resolve) {
    if (resolve) {
      knex('users_events').insert({ eventID: eventID, userId: userId})
        .then(function(data) {
          resolve(data);
        })
    }
  })
};

Event.getJoint = function (userId) {
  return new Promise(function(resolve) {
    if (resolve) {
      knex('users_events').select('EventID').where({userId: userId}).then(function(data) {
        resolve(data);
      })
    }
  })
};

Event.sendRequest = function(address) {
  var APIkey = "AIzaSyBcK8gSnEXC4SgWTsNwKOO8eeYnFmK5t8A";
  var query = "https://maps.googleapis.com/maps/api/geocode/json?address="+ address +"&key=" + APIkey;
  return new Promise(function(resolve, reject) {
    https.get(query, function(res) {
      var body = "";
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function(error) {
        if(error) { 
          console.log(error)
          reject(error);
        } else {

          //get current address's longitude latitude
          var result = JSON.parse(body);
          longitude = result.results[0].geometry.location.lng;
          latitude = result.results[0].geometry.location.lat;
          resolve({longitude: longitude, latitude: latitude});
        }
      })
    })
  }); 
}

module.exports = Event;
