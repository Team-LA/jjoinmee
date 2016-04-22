var express = require('express');
var knex = require('../database').knex;
var bodyParser = require('body-parser');
var Event = require('../helpers/event');
var app = express();

app.use(bodyParser());

module.exports = {
  events: {
    get: function (req, res) {
      knex('events').select('*').then(function(data) {
        res.send(data);
      });
    },
    //{ longitude: -118.4943443, latitude: 34.0192691 }
    post: function (req, res) {
      Event.sendRequest(req.body.address).then(function(data){
        var latlng = data.latitude + ',' + data.longitude;
        knex('events').insert({
            inputTitle: req.body.inputTitle,
            userId: knex('users').where({Email: req.body.Email}).select('id'),
            datetimeValue: req.body.datetimeValue,
            duration: req.body.duration,
            address: req.body.address,
            latlng: latlng
          })
          .then(function (firstData) {
            console.log('firstDat', firstData)
              knex('users_events').insert({
                EventID: firstData[0],
                UserId: knex('users').where({Email: req.body.Email}).select('id')
              })
              .then(function (data) {
                res.send(data);
              });
          });
      });
    }
  }


};
