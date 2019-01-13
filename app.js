const http = require("http")
const express = require("express")
var bodyParser = require('body-parser');
const MessagingResponse = require("twilio").twiml.MessagingResponse
const VoiceResponse = require("twilio").twiml.VoiceResponse

const getWeatherVoice = require("./voice/weatherVoice.js")
const getTwitterVoice = require("./voice/twitterVoice.js")
const getRedditVoice = require("./voice/redditVoice.js")
const getNewsVoice = require("./voice/newsVoice.js")
const getYoutubeVoice = require("./voice/youtubeVoice.js")
const getGasVoice = require("./voice/gasVoice.js")
const directionVoice = require("./voice/directionVoice.js")

const getWeather = require("./sms/weather.js");
const getYoutubeTrending = require("./sms/youtube.js");
const getRedditPosts = require('./sms/reddit')
const getTwitterPosts = require('./sms/twitter')
const getNews = require("./sms/news.js");
const getDirections = require("./sms/directions.js")
const getGas = require("./sms/gas.js")

const app = express()

app.use(bodyParser.urlencoded({extended: false}));
app.post('/sms', (req, res) => {

    let user_message = req.body.Body.toLowerCase()
    const twiml = new MessagingResponse();

    if (user_message.startsWith("hi") || user_message.startsWith("hello")){
      let greet = "Hello there! Use the alertify system to stay connected even when offline!\nAsk for \"list\" to see what you can ask us "
      twiml.message(greet)
    }

    else if(user_message.startsWith("list")){
      let help = "Always know what is trending...\n" +
      "     Trending twitter    [results]\n" +
      "     Trending reddit     [results]\n" +
      "     Trending news      [results]\n" +
      "     Trending youtube [results]\n" +
      "\nAsk for weather in any location...\n"+
      "     What is the weather in (location)\n" +
      "\nGet directions without needing wifi/data...\n" +
      "     Direction from (start) to (destination)\n" +
      "\nFind nearby gas stations...\n" +
      "     Gas closest to (origin address) (results)"
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

    else if(user_message.startsWith("gas closest to")) {
        var usrInput = user_message.split("gas closest to ")[1];
        var resultsLastIndex = usrInput.lastIndexOf(" ");
        getGas(req.body.From, usrInput.substring(0, resultsLastIndex), parseInt(usrInput.substring(resultsLastIndex+1)));


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
  voice.pause({length:1})
  voice.say("Hello! Welcome to Aletify")
  voice.pause({length:1})

  const gather = voice.gather({
    input: 'speech dtmf',
    action : '/menu',
    timeout:"3",
    numDigits:"1"
  })
  gather.say('Press or say 1 to listen to the trending twitter hashtags')
  gather.say('Press or say 2 to listen to the trending Youtube video titles')
  gather.say('Press or say 3 to listen to the trending reddit posts titles')
  gather.say('Press or say 4 to listen to the top news')
  gather.say('Press or say 5 to get the weather for a location')
  gather.say('Press or say 6 to find the nearest gas stations for a location')
  gather.say('Press or say 7 to get directions from home to destination')

  // Render the response as XML in reply to the webhook request
  res.type('text/xml');
  res.send(voice.toString());

})

app.post('/menu', (req, res) => {
  let input = parseInt(req.body.Digits) || parseInt(req.body.SpeechResult)
  const voice = new VoiceResponse();

  switch(input){
    case 1:
      getTwitterVoice(res)
      break

    case 2:
      getYoutubeVoice(res)
      break

    case 3:
      getRedditVoice(res)
      break
      
    case 4:
      getNewsVoice(res)
      break

    case 5:
      const gather = voice.gather({
        input: 'speech',
        timeout: 4,
        action : "/weather",
        method: 'GET'
      });
      gather.say('Say a location');
      res.type('text/xml');
      res.send(voice.toString());
      break

    case 6:
      const gather1 = voice.gather({
        input: 'speech',
        timeout: 4,
        action : "/gas",
        method: 'GET'
      });
      gather1.say('Say a location');
      res.type('text/xml');
      res.send(voice.toString());
      break

      case 7:
        const gather2 = voice.gather({
          input: 'speech',
          timeout: 5,
          action : "/direction",
          method: 'GET'
        });
        gather2.say('Say the current location and the destination');
        res.type('text/xml');
        res.send(voice.toString());
        break

    
    default:
      voice.say("Goodbye, call back anytime")
      voice.pause({length:1})
      res.type('text/xml');
      res.send(voice.toString());
  }

})

app.get('/weather', (req, res) => {
    let location = req.query.SpeechResult
    getWeatherVoice(location, res)
})

app.get('/gas', (req, res) => {
  let location = req.query.SpeechResult
  getGasVoice(location, res)
})

app.get('/direction', (req, res) => {
  let location = req.query.SpeechResult.split("and")
  directionVoice(location[0], location[1], res)
})

app.get('/', function (req, res) {
  res.send('hello world')
})

http.createServer(app).listen(process.env.PORT || 8080, ()=> console.log("Listening on port 8080"))
