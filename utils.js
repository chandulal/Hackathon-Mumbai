var api = require("./api.js");
var jsonfile = require('jsonfile');
var conf = require('config');
var global = require('./global.js')
var otpSender = require("./otpSender.js");

var senderForBank = conf.get('senderForBank');
var senderForGoIndia = conf.get('senderForGoIndia');

var pageTokenForBank = conf.get('pageTokenForBank');
var pageTokenForGoIndia = conf.get('pageTokenForGoIndia');

var dataPath = conf.get('dataPath');
var apiInstance = new api();

var otpSenderInstance = new otpSender();

var utils = function (){
   var self = this;
    
   self.sendTextMessage = function sendTextMessage(sender, pageToken, text) {
        messageData = {
            text:text
            };
        apiInstance.send(sender, pageToken, messageData);
   };
    
   self.sendPayloadMessage = function sendPaymentMessage(sender, pageToken, payload) {
       var payloadJson = dataPath + payload + ".json";
       if(payload == "yes"){
           otpSenderInstance.sendOTP(11111);
           otpSenderInstance.sendToken();
       }
       jsonfile.readFile(payloadJson, function (err, jsonObj) {
           apiInstance.send(sender, pageToken, jsonObj);
       });
   };

   self.sendSpecificPayloadMessage = function sendSpecificPayloadMessage(sender, pageToken, payloadType, user) {
       var payloadPath = conf.get(payloadType);
       var payloadJson = payloadPath + user + ".json";
       jsonfile.readFile(payloadJson, function (err, jsonObj) {
           apiInstance.send(sender, pageToken, jsonObj);
       });
   };

   self.generateReplyForMobileCommand = function generateReplyForMobileCommand(sender, pageToken, mobileNumber) {

       function isMobileNumberIsRegistered(mobileNumber) {
            if(mobileNumber == "9537171203") return true;
            else return false;
       }

       if(isMobileNumberIsRegistered(mobileNumber.trim())) {
           otpSenderInstance.sendOTP(12345);
           otpSenderInstance.sendToken();
           self.sendTextMessage(sender, pageToken, global.OTP_MESSAGE);
       }
       else 
           self.sendTextMessage(sender, pageToken, global.MOBILE_NOT_REGISTERED_MESSAGE)
       
    };

    self.generateReplyForTransferCommand = function generateReplyForTransferCommand(sender, pageToken, amountAndRemarks) {

        // var data = amountAndRemarks.trim().split(" ");
        // var amount = data[0];
        // var remarks = data[1].substring(1, str.length - 1);
        otpSenderInstance.sendOTP(54321);
        otpSenderInstance.sendToken();
        self.sendTextMessage(sender, pageToken, global.OTP_MESSAGE)
    };

    self.generateReplyForOTPCommand = function generateReplyForOTPCommand(sender, pageToken, otpAndToken) {

        function isOTPIsValid(otp) {
            if(otp == "12345") return true;
            else return false;
        }
        data = otpAndToken.trim().split(" ");
        otp = data[0];
        token = data[1];
        if(token == global.TOKEN_NUMBER) {
            if (isOTPIsValid(otp)) {
                var homeMenuJson = dataPath + "homeMenu.json";
                jsonfile.readFile(homeMenuJson, function (err, jsonObj) {
                    apiInstance.send(sender, pageToken, jsonObj);
                });
            }
            else if (otp.trim() === "54321") {
                self.sendPayloadMessage(sender, pageToken, global.PAYMENT_PAYLOAD)
            }
            else if (otp.trim() === "11111") {
                self.sendTextMessage(sender, pageToken, global.OTP_ENTERED_MESSAGE);
                self.sendTextMessage(senderForGoIndia, pageTokenForGoIndia, global.GOINDIA_PAYMENT_RECEIVED_MESSAGE)
                self.sendSpecificPayloadMessage(senderForGoIndia, pageTokenForGoIndia, global.GOINDIA_PATH, global.SUMMARY_PAYLOAD)
            }
            else self.sendTextMessage(sender, pageToken, global.OTP_INVALID_MESSAGE);
        }
        else self.sendTextMessage(sender, pageToken, global.TOKEN_INVALID_MESSAGE);
    };
};

module.exports = utils;