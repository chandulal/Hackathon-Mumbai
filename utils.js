var api = require("./api.js");
var jsonfile = require('jsonfile');
var math = require('mathjs');
var conf = require('config');
var global = require('./global.js')

var dataPath = conf.get('dataPath');
var apiInstance = new api();

var utils = function (){
   var self = this;
    
   self.sendTextMessage = function sendTextMessage(sender, text) {
        messageData = {
            text:text
            };
        apiInstance.send(sender, messageData);
   };
    
   self.sendPayloadMessage = function sendPaymentMessage(sender, payload) {
       var payloadJson = dataPath + payload + ".json";
       jsonfile.readFile(payloadJson, function (err, jsonObj) {
           apiInstance.send(sender, jsonObj);
       });
   };

   self.sendSpecificPayloadMessage = function sendSpecificPayloadMessage(sender, payloadType, user) {
       var payloadPath = conf.get(payloadType);
       var payloadJson = payloadPath + user + ".json";
       jsonfile.readFile(payloadJson, function (err, jsonObj) {
           apiInstance.send(sender, jsonObj);
       });
   };

   self.generateReplyForMobileCommand = function generateReplyForMobileCommand(sender, mobileNumber) {

       function isMobileNumberIsRegistered(mobileNumber) {
            if(mobileNumber == "9537171203") return true;
            else return false;
       }

       if(isMobileNumberIsRegistered(mobileNumber.trim())) 
           self.sendTextMessage(sender, global.OTP_MESSAGE)
       else 
           self.sendTextMessage(sender, global.MOBILE_NOT_REGISTERED_MESSAGE)
       
    };

    self.generateReplyForTransferCommand = function generateReplyForTransferCommand(sender, amountAndRemarks) {

        // var data = amountAndRemarks.trim().split(" ");
        // var amount = data[0];
        // var remarks = data[1].substring(1, str.length - 1);
        self.sendTextMessage(sender, global.OTP_MESSAGE)
    };

    self.generateReplyForOTPCommand = function generateReplyForOTPCommand(sender, otp) {

        function isOTPIsValid(otp) {
            if(otp == "12345") return true;
            else return false;
        }

        if(isOTPIsValid(otp.trim())) {
            var homeMenuJson = dataPath + "homeMenu.json";
            jsonfile.readFile(homeMenuJson, function (err, jsonObj) {
                apiInstance.send(sender, jsonObj);
            });
        }
        else if(otp.trim() === "54321"){
            self.sendPayloadMessage(sender, global.PAYMENT_PAYLOAD)
        }
        else self.sendTextMessage(sender, global.OTP_INVALID_MESSAGE);
    };
};

module.exports = utils;