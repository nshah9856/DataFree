const http = require("http")
const express = require("express")
var bodyParser = require('body-parser');
const MessagingResponse = require("twilio").twiml.MessagingResponse
const VoiceResponse = require("twilio").twiml.VoiceResponse

const getWeather = require("./weather.js");
const getWeatherVoice = require("./weatherVoice.js")
const getYoutubeTrending = require("./youtube.js");
const getRedditPosts = require('./reddit')
const getTwitterPosts = require('./twitter')
const getNews = require("./news.js");
const getDirections = require("./directions.js")
const app = express()

app.use(bodyParser.urlencoded({extended: false}));
app.post('/sms', (req, res) => {

    let user_message = req.body.Body.toLowerCase()
    const twiml = new MessagingResponse();

    if (user_message.startsWith("hi") || user_message.startsWith("hello")){
      let greet = "Hello there! Use the alertfy system to stay connected even when offline!\nAsk for \"list\" to see what you can ask us "
      twiml.message(greet)
    }

    else if(user_message.startsWith("list")){
      let help = "Trending twitter - Know what's trending on Twitter\n" + 
      "Trending reddit - Know what's trending on Reddit\n" + 
      "Trending news - Know what's trending in the News\n" + 
      "Trending youtube - Know what's trending on YouTube\n" + 
      "What is the weather in (any location) - Know the weather even when away from data!\n" + 
      "Direction <FROM> <TO> - List Directions when away from data! Format location by (address + city + state) <- no spaces OR (city)\n"
      //directions: either <address + city + state> or <city to city>
      twiml.message(help)
    }

    else if (user_message.startsWith("what is the weather in") ){
      getWeather(user_message.substring(user_message.indexOf("in")+3,user_message.length), req.body.From)
    } 

    else if (user_message.startsWith("trending youtube")){
      getYoutubeTrending(user_message.split(" ").slice(-1), req.body.From)
    }

    else if (user_message.startsWith("trending news")){
      getNews(req.body.From)
    }

    else if(user_message.startsWith("trending reddit")){
        getRedditPosts(req.body.From)
    }

    else if(user_message.startsWith("trending twitter")){
      getTwitterPosts(req.body.From)
    }

    else if(user_message.startsWith("direction")){
      getDirections(user_message.split(" ")[1], user_message.split(" ")[2],req.body.From)
    }

    else if (user_message == 'bye') {
      twiml.message('Goodbye :)');
    } 
    
    else {
      twiml.message(
        'No Body param match, Twilio sends this in the request to your server.'
      );
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });



app.post('/voice', (req, res) => {
  const voice = new VoiceResponse();

  const gather = voice.gather({
    input: 'speech',
    timeout: 2,
    action : "/weather",
    method: 'GET'
  });
  gather.say('Say a location');


  // Render the response as XML in reply to the webhook request
  res.type('text/xml');
  res.send(voice.toString());
  
})

app.get('/weather', (req, res) => {
    let location = req.query.SpeechResult
    getWeatherVoice(location, res)
})

app.get('/', function (req, res) {
  res.send('hello world')
  
})

http.createServer(app).listen(process.env.PORT || 8000, ()=> console.log("Listening on port 1337"))
