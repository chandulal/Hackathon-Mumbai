var api = require("./api.js");
var jsonfile = require('jsonfile');
var math = require('mathjs');
var conf = require('config');
var global = require('./global.js')

var productsPath = conf.get('productsPath');
var apiInstance = new api();

var utils = function (){
   var self = this;
    
   self.welcomeMessage = function welcomeMessage(sender, text) {
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
    
   self.sendProducts = function sendProducts(sender) {
       var productJson = productsPath + "products.json";
       jsonfile.readFile(productJson, function (err, jsonObj) {
           apiInstance.send(sender, jsonObj);
       });
    };
};

module.exports = utils;