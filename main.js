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

var senderForBank = conf.get('senderForBank');
var senderForGoIndia = conf.get('senderForGoIndia');

var pageTokenForBank = conf.get('pageTokenForBank');
var pageTokenForGoIndia = conf.get('pageTokenForGoIndia');

var utilsInstance = new utils();

// //my sql connection
// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'hackm'
// });
//
// connection.connect(function(err){
//   if(!err) {
//     console.log("Database is connected ...");
//   } else {
//     console.log("Error connecting database ...");
//   }
// });
//
// app.get("/",function(req,res){
//   connection.query('SELECT * from transaction_log', function(err, rows, fields) {
//     connection.end();
//     if (!err)
//       console.log('The solution is: ', rows);
//     else
//       console.log('Error while performing Query.');
//   });
// });


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

  if(sender == senderForBank) {
    if (event.message && event.message.text) {
      text = event.message.text
      command = text.substr(0, text.indexOf(' '));
      details = text.substr(text.indexOf(' ') + 1);

      if (command === global.MOBILE_NUMBER_COMMAND) {
        utilsInstance.generateReplyForMobileCommand(sender, pageTokenForBank, details);
        continue;
      }
      else if (command === global.OTP_COMMAND) {
        utilsInstance.generateReplyForOTPCommand(sender, pageTokenForBank, details);
        continue;
      }
      else if (command === global.TRANSFER_COMMAND) {
        utilsInstance.generateReplyForTransferCommand(sender, pageTokenForBank, details);
        continue;
      }
      else if (command === global.ADD_PAYEE_COMMAND) {
        utilsInstance.sendPayloadMessage(sender, pageTokenForBank, global.PAYEE_SUCCESS_PAYLOAD);
        continue;
      }
      else if (command === global.RECHARGE_COMMAND) {
        utilsInstance.sendPayloadMessage(sender, pageTokenForBank, global.RECHARGE_SUCCESS_PAYLOAD);
        continue;
      }
      else if (command === global.PAY_ELECTRICITY_BILLS_COMMAND || command === global.PAY_POSTPAID_BILLS_COMMAND || command === global.PAY_GAS_BILLS_COMMAND) {
        utilsInstance.sendPayloadMessage(sender, pageTokenForBank, global.PAYBILL_SUCCESS_PAYLOAD);
        continue;
      }
      else {
        utilsInstance.sendTextMessage(sender, pageTokenForBank, global.WELCOME_MESSAGE);
      }
    }
    if (event.postback) {
      postbackJson = event.postback;
      payload = postbackJson.payload
      console.log(payload)
      if (payload.indexOf(":") > -1) {
        payload = postbackJson.payload.split(":");
        payloadType = payload[0];
        user = payload[1];
        console.log(payloadType + user);
        utilsInstance.sendSpecificPayloadMessage(sender, pageTokenForBank, payloadType, user);
      } else utilsInstance.sendPayloadMessage(sender, pageTokenForBank, payload);
    }
  }
  else{
    //for GoIndia use case
    if (event.message && event.message.text) {
      text = event.message.text
      command = text.substr(0, text.indexOf(' '));
      details = text.substr(text.indexOf(' ') + 1);

      if (command === global.ONE_WAY_COMMAND) {
        utilsInstance.sendSpecificPayloadMessage(sender, pageTokenForGoIndia, global.GOINDIA_PATH, global.GOINDIA_FLIGHT_LIST);
        continue;
      }
      else if (command === global.BOOK_FLIGHT_COMMAND) {
        utilsInstance.sendTextMessage(sender, pageTokenForGoIndia, global.BOOK_FLIGHT_TOKEN_MESSAGE);
        utilsInstance.sendTextMessage(senderForBank, pageTokenForBank, global.OTP_MESSAGE);
        continue;
      }
      else {
        utilsInstance.sendSpecificPayloadMessage(sender, pageTokenForGoIndia, global.GOINDIA_PATH, global.GOINDIA_MAIN_MENU);
      }
    }
    if (event.postback) {
      postbackJson = event.postback;
      payload = postbackJson.payload
      console.log(payload)
      if (payload.indexOf(":") > -1) {
        payload = postbackJson.payload.split(":");
        payloadType = payload[0];
        user = payload[1];
        console.log(payloadType + user);
        utilsInstance.sendSpecificPayloadMessage(sender, pageTokenForGoIndia, payloadType, user);
      } else utilsInstance.sendSpecificPayloadMessage(sender, pageTokenForGoIndia, global.GOINDIA_PATH, payload);
    }

   }
  }
  res.sendStatus(200);
});