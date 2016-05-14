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

      text = event.message.text
      command = text.substr(0,text.indexOf(' '));
      details = text.substr(text.indexOf(' ')+1);

      if (command === global.MOBILE_NUMBER_COMMAND) {
        utilsInstance.generateReplyForMobileCommand(sender, details);
        continue;
      }
      else if (command === global.OTP_COMMAND) {
        utilsInstance.generateReplyForOTPCommand(sender, details);
        continue;
      }
      else if (command === global.TRANSFER_COMMAND) {
        utilsInstance.generateReplyForTransferCommand(sender, details);
        continue;
      }
      else if (command === global.ADD_PAYEE_COMMAND) {
        utilsInstance.sendPayloadMessage(sender, global.PAYEE_SUCCESS_PAYLOAD);
        continue;
      }
      else if (command === global.RECHARGE_COMMAND) {
        utilsInstance.sendPayloadMessage(sender, global.RECHARGE_SUCCESS_PAYLOAD);
        continue;
      }
      else if (command === global.PAY_ELECTRICITY_BILLS_COMMAND || command === global.PAY_POSTPAID_BILLS_COMMAND ||command === global.PAY_GAS_BILLS_COMMAND) {
        utilsInstance.sendPayloadMessage(sender, global.PAYBILL_SUCCESS_PAYLOAD);
        continue;
      }
      else {
        utilsInstance.sendTextMessage(sender, global.WELCOME_MESSAGE);
      }
    }
    if (event.postback) {
      postbackJson = event.postback;
      payload = postbackJson.payload
      console.log(payload)
      if(payload.indexOf(":") > -1){
        payload = postbackJson.payload.split(":");
        payloadType = payload[0];
        user = payload[1];
        console.log(payloadType + user);
        utilsInstance.sendSpecificPayloadMessage(sender, payloadType, user);
      }else utilsInstance.sendPayloadMessage(sender, payload);
    }
  }
  res.sendStatus(200);
});