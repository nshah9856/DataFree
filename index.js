const http = require("http")
const express = require("express")
var bodyParser = require('body-parser');
const MessagingResponse = require("twilio").twiml.MessagingResponse

const getWeather = require("./weather.js");

const app = express()

app.use(bodyParser.urlencoded({extended: false}));
app.post('/sms', (req, res) => {

    let user_message = req.body.Body.toLowerCase()
    const twiml = new MessagingResponse();
    if (user_message == `what is the weather in ${location}`) {
        getWeather(location) 
        .then (res => res.json())
        .then((out) => {
          twiml.message('Current temperature is: ' + Math.round(out.main.temp) + "\nMinumum today: " + Math.round(out.main.temp_min) + "\nMaximum today: " + Math.round(out.main.temp_max));
        })
        .catch(err => { throw err });
    } else if (user_message == 'bye') {
      twiml.message('Goodbye');
    } else {
      twiml.message(
        'No Body param match, Twilio sends this in the request to your server.'
      );
    }
  
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });

app.get('/', function (req, res) {
  res.send('hello world')
})

http.createServer(app).listen(process.env.PORT || 1337, ()=> console.log("Listening on port 1337"))
