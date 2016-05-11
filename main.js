var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var conf = require('config');
var utils = require("./utils.js");
var global = require('./global.js')

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
      text = event.message.text.split(" ");
      command = text[0];
      details = text[1];
      if (command === global.MOBILE_NUMBER_COMMAND) {
        utilsInstance.generateReplyForMobileCommand(sender, details.toString());
        continue;
      }
      else if (command === global.OTP_COMMAND) {
        utilsInstance.generateReplyForOTPCommand(sender, details.toString());
        continue;
      }
      else {
        utilsInstance.sendTextMessage(sender, global.WELCOME_MESSAGE);
      }
    }
    if (event.postback) {
      postbackJson = event.postback;
      payload = postbackJson.payload.split(":");
      payloadType = payload[0];
      product = payload[1];
        utilsInstance.sendPayloadMessage(sender, payloadType, product);
    }
  }
  res.sendStatus(200);
});