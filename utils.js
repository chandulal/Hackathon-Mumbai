var api = require("./api.js");
var jsonfile = require('jsonfile');
var conf = require('config');

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