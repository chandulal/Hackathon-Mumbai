var global = require('./global.js');
var math = require('mathjs');
var conf = require('config');

// android cloud messaging related stuff
var FCM = require('fcm').FCM;

var apiKey = conf.get('fcmserverkey');
var fcm = new FCM(apiKey);

// Twilio Credentials
var accountSid = 'AC84daa8c77214b516011fe59b15c101f0';
var authToken = '15e6d784a5a24e98d505d94e64f2adaf';

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);

var otpSender = function (){
    var self = this;
    self.sendOTP = function sendOTP(otp) {
        console.log(otp);
        client.messages.create({
            to: "+919545644045",
            from: "+12562179791",
            body: "Hello, " + otp + " is your OTP for your transaction.",
        }, function(err, message) {
            console.log(message.sid);
        });
    };

    self.sendToken = function sendToker(){
        global.TOKEN_NUMBER = math.randomInt(10000,1000000);
        var message = {
            registration_id: global.DEVICE_ID,
            collapse_key: 'otp_key',
            'data.otp': global.TOKEN_NUMBER
        };

        console.log(message);

        fcm.send(message, function(err, messageId){
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Sent with message ID: ", messageId);
            }
        });
    }
};

module.exports = otpSender;