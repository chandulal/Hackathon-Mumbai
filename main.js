var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
module.exports = app;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.listen(4567);

var token = "EAAWApW7mI9MBANZCucQGJfGvIdVywwkcyxC0IoXwoKGLh2Di8N8hEU3kURCzkz3vX0FZBy44DKKLubfvQmqY2T4b6cNZAl0rq48v7BGPJV1QIsGVYZCmoKXBOX0ZB6WC9IxBKjQqFhTUGJ3043Ecv9FQLNbttzLogyHmHpS4OawZDZD";

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '12345') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
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
      sendTextMessage(sender, "I received your message: "+ text.substring(0, 200));
    }
    if (event.postback) {
      text = JSON.stringify(event.postback);
      sendTextMessage(sender, "Thank you for purchasing : "+text.substring(0, 200) + ". Your payment method is COD.", token);
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
    qs: {access_token:token},
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
            "payload": "Intex Cloud Cube",
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
            "payload": "Apple iPhone 6S",
          }],
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
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