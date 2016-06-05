// Twilio Credentials 
var accountSid = '<accountSid>';
var authToken = '<authToken>';

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);

var otpSender = function (){
    var self = this;
    self.sendOTP = function sendOTP(otp) {
        console.log(otp);
        client.messages.create({
            to: "<to>",
            from: "<from>",
            body: "Hello, " + otp + " is your OTP for your transaction.",
        }, function(err, message) {
            console.log(message.sid);
        });
    };
};

module.exports = otpSender;