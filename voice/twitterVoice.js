
require('es6-promise').polyfill();
require('isomorphic-fetch');

var Twit = require('twit')
const VoiceResponse = require("twilio").twiml.VoiceResponse
var dotenv = require('dotenv')
dotenv.load()

var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_AUTH,
  access_token_secret:  process.env.TWITTER_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

let string = "Top Trending Twitter posts\n"

 T.get('trends/place', {id:23424977, count:10}, function(err, data, response) {
    
      let d = Array(...Object.values( data[0].trends)).slice(0)
      d.sort((a,b) => b.tweet_volume - a.tweet_volume)
      for (i in d){
          if (i < 10){
          string += d[i].name + "\n"
        }
      }
    
})

module.exports = exports = 
function getTwitterPosts(res){

    async function sendTextMessage() {
        try {
            const response = new VoiceResponse()
            let data =  string.split("\n")
            for (i in data){
                response.say(data[i])
                response.pause({
                    length: 1
                });
            }
            res.type('text/xml');
            res.send(response.toString());

        } catch(error) {
            console.error(error)
        }        
      }

    sendTextMessage()
}

 
