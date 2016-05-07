var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var conf = require('config');
var utils = require("./utils.js");

var app = express();
module.exports = app;
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.listen(4567);

var apiToken = conf.get('apiToken');

var utilsInstance = new utils();

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === apiToken) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      if (text === '@products') {
        utilsInstance.sendGenericMessage(sender);
        continue;
      }
      else {
        utilsInstance.sendTextMessage(sender, "Hello! Thanks for connecting with us over Messenger. It looks like you" +
            "are interested in the classic mobiles.");
      }
    }
    if (event.postback) {
      text = JSON.stringify(event.postback);
      utilsInstance.sendPaymentMessage(sender);
      
    }
  }
  res.sendStatus(200);
});