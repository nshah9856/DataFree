
require('es6-promise').polyfill();
require('isomorphic-fetch');

var Twit = require('twit')
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

let string = "Trending on Twitter: \n"

 T.get('trends/place', {id:23424977, count:10}, function(err, data, response) {
    
      let d = Array(...Object.values( data[0].trends)).slice(0)
      d.sort((a,b) => b.tweet_volume - a.tweet_volume)
      for (i in d){
        if (i < 5){
          string += `${parseInt(i)+1}` + ". " + d[i].name + "\n" + d[i].url + "\n\n"
        }
      }
    
})

module.exports = exports = 
function getTwitterPosts(to){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    async function sendTextMessage(to) {
        try {
          

        await client.messages.create({
            to: to,
            from: process.env.TWILIO_NUMBER, 
            body: `${string}`
        });
        console.log('Request sent');
        } catch(error) {
        console.error(error);
        }
    }

    sendTextMessage(to)
}

 
