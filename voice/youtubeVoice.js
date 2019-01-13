require('es6-promise').polyfill();
require('isomorphic-fetch');

const VoiceResponse = require("twilio").twiml.VoiceResponse
const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getYoutubeTrending(res){

    let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopular&gl=US&maxResults=${10}&key=${process.env.YOUTUBE_KEY}`
    async function sendTextMessage() {
        try {
        const data = await fetch(url)
        const out = await data.json()
        var d = 'Trending on YouTube: \n' //PUT SEARCHCES TITLES AND NUMS ; LOOP T HROUGH HERE
        for (var i=1; i<=out.items.length; i++){
            var vidID = out.items[i-1].id
            let videoUrl = `https://www.googleapis.com/youtube/v3/videos?id=${vidID}&key=${process.env.YOUTUBE_KEY}&fields=items(id,snippet(channelId,title,categoryId),statistics)&part=snippet,statistics`
            const vidData = await fetch(videoUrl)
            const vidOut = await vidData.json()
            d += vidOut.items[0].snippet.title + "\n"
        }
     
        let d1 = d.split("\n")
        const response = new VoiceResponse()
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
