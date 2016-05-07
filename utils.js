var api = require("./api.js");
var jsonfile = require('jsonfile');
var conf = require('config');

var paymentDataPath = conf.get('paymentDataPath');
var productsPath = conf.get('productsPath');
var apiInstance = new api();

var utils = function (){
   var self = this;
    
   self.sendTextMessage = function sendTextMessage(sender, text) {
        messageData = {
            text:text
            };
        apiInstance.send(sender, messageData);
   };
    
   self.sendPaymentMessage = function sendPaymentMessage(sender) {
       var paymentJson = paymentDataPath + "payment.json";
       jsonfile.readFile(paymentJson, function (err, jsonObj) {
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