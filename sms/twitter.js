
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

let string = ""
var twilio = require('twilio');

 T.get('trends/place', {id:23424977, count:10}, function(err, data, response) {
    
      let d = Array(...Object.values( data[0].trends)).slice(0)
      d.sort((a,b) => b.tweet_volume - a.tweet_volume)
      for (i in d){
        // if (i < num){
          string += `${parseInt(i)+1}` + ". " + d[i].name + "tabs" + d[i].url + "\n"
        // }
      }
    
})

module.exports = exports = 
function getTwitterPosts(to, num){

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    async function sendTextMessage(to) {
        try {
        let data = "Trending on Twitter: \n"
        let spl = string.split('\n')
        for( i in spl){
          if (i < num){
            data += spl[i].replace("tabs", "\n") + "\n\n"
          }
        }

        await client.messages.create({
            to: to,
            from: process.env.TWILIO_NUMBER, 
            body: `${data}`
        });
        console.log('Request sent');
        } catch(error) {
          if (error.code === 21617){
            client.messages.create({
                to: to,
                from: process.env.TWILIO_NUMBER, 
                body: `Too much data to display in a text message requested, lower the count!`
            });
        }else{
            console.error(error)
        }        
      }
    }

    sendTextMessage(to)
}

 
