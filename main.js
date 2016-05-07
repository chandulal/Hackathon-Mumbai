var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var conf = require('config');
var app = express();
module.exports = app;
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.listen(4567);

var pageToken = conf.get('pageToken');
var apiToken = conf.get('apiToken');

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === apiToken) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation pageToken');
});

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      if (text === '@products') {
        sendGenericMessage(sender);
        continue;
      }
      else {
        sendTextMessage(sender, "Hello! Thanks for connecting with us over Messenger. It looks like you" +
            "are interested in the classic mobiles.");
      }
    }
    if (event.postback) {
      text = JSON.stringify(event.postback);
      sendPaymentMessage(sender);
      continue;
    }
  }
  res.sendStatus(200);
});

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:pageToken},
    method: 'POST',
    json: {
      recipient: {id:sender},
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

function sendPaymentMessage(sender) {
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
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:pageToken},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendGenericMessage(sender) {
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
            "payload": "Intex-Cloud-Cube",
          }],
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
            "payload": "Apple-iPhone-6S",
          }],
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:pageToken},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}