var request = require('request');
var conf = require('config');

var apiUrl = conf.get('apiUrl');
var userProfileUrl = conf.get('userProfileUrl');
var pageTokenForBank = conf.get('pageTokenForBank');

var api = function () {
    var self = this;
    self.send = function send(sender, messageData) {
        request({
            url: apiUrl,
            qs: {access_token: pageTokenForBank},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData
            }
        }, function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }
    self.getUserProfile = function getUserProfile(sender) {
        request({
            url: userProfileUrl + sender + "?fields=first_name,last_name&amp;access_token=" + pageTokenForBank,
            method: 'GET'
        }, function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }
};
module.exports = api;