require('es6-promise').polyfill();
require('isomorphic-fetch');


const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getYoutubeTrending(numSearches, to){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopular&gl=US&maxResults=${numSearches}&key=${process.env.YOUTUBE_KEY}`
    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        var d = 'Trending on YouTube: \n' //PUT SEARCHCES TITLES AND NUMS ; LOOP T HROUGH HERE
        for (var i=1; i<=out.items.length; i++){
            var vidID = out.items[i-1].id

            let videoUrl = `https://www.googleapis.com/youtube/v3/videos?id=${vidID}&key=${process.env.YOUTUBE_KEY}&fields=items(id,snippet(channelId,title,categoryId),statistics)&part=snippet,statistics`
            const vidData = await fetch(videoUrl)
            const vidOut = await vidData.json()
            d = d + i +". " + vidOut.items[0].snippet.title + "\n " + "https://www.youtube.com/watch?v="+ vidID + "\n"
        }
        await client.messages.create({
            to: to,
            from: process.env.TWILIO_NUMBER,
            body: `${d}`
        });
        console.log('Request sent');
        } catch(error) {
        console.error(error);
        }
    }

    sendTextMessage(to)
}
