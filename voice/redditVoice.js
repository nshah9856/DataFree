require('es6-promise').polyfill();
require('isomorphic-fetch');

const VoiceResponse = require("twilio").twiml.VoiceResponse
const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getRedditPosts(res){
  
    let url = "https://www.reddit.com/r/popular/top.json"

    async function sendTextMessage() {
        try {
        const data = await fetch(url)
        const out = await data.json()

        let string = 'Top Trending Reddit Posts: \n' 
        for (i in out.data.children){
            if (i < 10)
            {var title = out.data.children[i].data.title
            string += title + "\n"}
        }

        const response = new VoiceResponse()
        let d =  string.split("\n")
        for (i in d){
            response.say(d[i])
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

