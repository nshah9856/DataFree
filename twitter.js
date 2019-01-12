
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

T.get('search/tweets', { q: 'trump', count: 10 }, function(err, data, response) {
    console.log(data)
  })