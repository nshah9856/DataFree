require('es6-promise').polyfill();
require('isomorphic-fetch');

const VoiceResponse = require("twilio").twiml.VoiceResponse
const dotnev = require("dotenv")
dotnev.load()

module.exports = exports = function getNews(res){

    let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_KEY}`
    async function sendTextMessage() {
        try {
        const data = await fetch(url)
        const out = await data.json()
        var d = 'Top Trending News: \n' //PUT SEARCHCES TITLES AND NUMS ; LOOP T HROUGH HERE
        for (var i=0; i<10; i++){
            var articleTitle = out.articles[i].title;
            d += articleTitle + "\n";
        }
        const response = new VoiceResponse()

        let d1 =  d.split("\n")
        for (i in d1){
            response.say(d1[i])
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
