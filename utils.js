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
    
   self.sendPayloadMessage = function sendPaymentMessage(sender, payloadType, product) {
       var payloadPath = conf.get(payloadType);
       var payloadJson = payloadPath + product + ".json";
       jsonfile.readFile(payloadJson, function (err, jsonObj) {
           if(payloadType === global.RECEIPTS_PAYLOAD) {
               var profile  = apiInstance.getUserProfile(sender);
               console.log(sender);
               jsonObj.attachment.payload.order_number = math.randomInt(10000,1000000);
           }
           apiInstance.send(sender, jsonObj);
       });
   };
    
   self.generateReplyForMobileCommand = function generateReplyForMobileCommand(sender, mobileNumber) {

       function isMobileNumberIsRegistered(mobileNumber) {
            if(mobileNumber == "9537171203") return true;
            else return false;
       }

       if(isMobileNumberIsRegistered(mobileNumber.trim())) {
           // var productJson = dataPath + "products.json";
           // jsonfile.readFile(productJson, function (err, jsonObj) {
           //     apiInstance.send(sender, jsonObj);
           // });
           self.sendTextMessage(sender, global.OTP_MESSAGE)
       }
       else {
           self.sendTextMessage(sender, global.MOBILE_NOT_REGISTERED_MESSAGE)
       }
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
        else
            self.sendTextMessage(sender, global.OTP_INVALID_MESSAGE);
    };
};

module.exports = utils;