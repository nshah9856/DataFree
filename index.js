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
      let help = "Always know what is trending...\n" + 
      "\tTrending reddit  [results]\n" + 
      "\tTrending reddit  [results]\n" + 
      "\tTrending news    [results]\n" + 
      "\tTrending youtube [results]\n" + 
      "Ask for weather in any location...\n"+
      "\tWhat is the weather in (location)\n" + 
      "Get directions without needing wifi/data...\n"
      "\tDirection from (start) to (destination)\n"
      twiml.message(help)
    }

    else if (user_message.startsWith("what is the weather in") ){
      getWeather(user_message.substring(user_message.indexOf("in")+3,user_message.length), req.body.From)
    } 

    else if (user_message.startsWith("trending youtube")){
      getYoutubeTrending(req.body.From,user_message.split(' ')[2] ? parseInt(user_message.split(' ')[2]) : 5)
    }

    else if (user_message.startsWith("trending news")){
      getNews(req.body.From,user_message.split(' ')[2] ? parseInt(user_message.split(' ')[2]) : 5)
    }

    else if(user_message.startsWith("trending reddit")){
        getRedditPosts(req.body.From,user_message.split(' ')[2] ? parseInt(user_message.split(' ')[2]) : 5)
    }

    else if(user_message.startsWith("trending twitter")){
      getTwitterPosts(req.body.From,user_message.split(' ')[2] ? parseInt(user_message.split(' ')[2]) : 5)
    }

    else if(user_message.startsWith("direction")){
      var endFromIndex = user_message.indexOf("from") + 5
      var startToIndex = user_message.indexOf("to")
      getDirections(user_message.substring(endFromIndex,startToIndex), user_message.split("to")[1],req.body.From)
    }

    else if (user_message == 'bye') {
      twiml.message('Goodbye :)');
    } 
    
    else {
      twiml.message(
        'Please enter a valid command. Type \"list\" to know the commands!.'
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

http.createServer(app).listen(process.env.PORT || 1337, ()=> console.log("Listening on port 1337"))
