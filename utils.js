var api = require("./api.js");
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
        messageData = {
            "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"button",
                    "text":"Your payment of 10000Rs has been processed",
                    "buttons":[
                        {
                            "type":"postback",
                            "title":"View Payment",
                            "payload":"USER_DEFINED_PAYLOAD"
                        }
                    ]
                }
            }
        };
        apiInstance.send(sender, messageData);
   };
   self.sendProducts = function sendGenericMessage(sender) {
        messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Intex Cloud Cube",
                        "subtitle": "Lets make the world better",
                        "image_url": "http://www.themobileindian.com/images/new_launches/2015/05/5503/Cloud-M5-II.jpg",
                        "buttons": [{
                            "type": "web_url",
                            "url": "http://www.flipkart.com/intex-cloud-cube/p/itmed7g38hqrz2n5?pid=MOBED7G3G2JJXEZM&al=DIhLapwSxrFFtYD5KTmlwcldugMWZuE7Qdj0IGOOVqsLCvvHEKSlsPIH4ZjRxAjF8TeOIlTNllg%3D&ref=L%3A3898321916473331522&srno=b_1",
                            "title": "Specifications"
                        }, {
                            "type": "postback",
                            "title": "Buy",
                            "payload": "Intex-Cloud-Cube"
                        }]
                    },{
                        "title": "Apple iPhone 6S",
                        "subtitle": "Think different.",
                        "image_url": "http://cdn.images.express.co.uk/img/dynamic/59/590x/Apple-iPhone-6s-Apple-iPhone-6s-Review-Woman-Gets-iPhone-6s-Early-ATT-iPhone-6s-Smartphone-iPhone-Smartphone-Review-Apple-ATT-iP-607026.jpg",
                        "buttons": [{
                            "type": "web_url",
                            "url": "http://www.flipkart.com/apple-iphone-6s/p/itmebysgqqaranas?pid=MOBEBY3VG2Z2HVGJ&al=DIhLapwSxrEd3KiFyEoK98ldugMWZuE7Qdj0IGOOVquM9KAOUAaCfKdCtfhV9Mb1SoqZDgVoaEc%3D&ref=L%3A-5957458462133632693&srno=b_3&findingMethod=Menu&otracker=nmenu_sub_electronics_0_Apple",
                            "title": "Specifications"
                        },{
                            "type": "postback",
                            "title": "Buy",
                            "payload": "Apple-iPhone-6S"
                        }]
                    }]
                }
            }
        };
        apiInstance.send(sender, messageData);
    };
};

module.exports = utils;