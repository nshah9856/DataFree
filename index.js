const http = require("http")
const express = require("express")
var bodyParser = require('body-parser');
const MessagingResponse = require("twilio").twiml.MessagingResponse

const getWeather = require("./weather.js");
const getYoutubeTrending = require("./youtube.js");
const getRedditPosts = require('./reddit')
const getTwitterPosts = require('./twitter')
const getNews = require("./news.js");
const app = express()

app.use(bodyParser.urlencoded({extended: false}));
app.post('/sms', (req, res) => {

    let user_message = req.body.Body.toLowerCase()
    const twiml = new MessagingResponse();

    if (user_message.startsWith("what is the weather in") ){

      getWeather(user_message.substring(user_message.indexOf("in")+3,user_message.length), req.body.From)

    } else if (user_message.startsWith("trending youtube")){
      getYoutubeTrending(user_message.split(" ").slice(-1), req.body.From)

  } else if (user_message.startsWith("trending news")){

      getNews(req.body.From)

    } else if(user_message.startsWith("trending reddit")){
        getRedditPosts(req.body.From)
    }
    else if(user_message.startsWith("trending twitter")){
      getTwitterPosts(req.body.From)
    }
    else if (user_message == 'bye') {

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
