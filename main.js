var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var app = express();
module.exports = app;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.listen(4567);

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '12345') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log(text)
      sendTextMessage(sender, "I received your message: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});


var token = "EAAWApW7mI9MBANZCucQGJfGvIdVywwkcyxC0IoXwoKGLh2Di8N8hEU3kURCzkz3vX0FZBy44DKKLubfvQmqY2T4b6cNZAl0rq48v7BGPJV1QIsGVYZCmoKXBOX0ZB6WC9IxBKjQqFhTUGJ3043Ecv9FQLNbttzLogyHmHpS4OawZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
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
