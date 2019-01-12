console.log("Youtube video link is: https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopular&gl=US&maxResults=10&key=AIzaSyCCFpsCSr2aWaxWGZVb3V16rTjBn_YK5WM");
require('es6-promise').polyfill();
require('isomorphic-fetch');


const dotnev = require("dotenv")
dotnev.load()

module.exports = exports = function getYoutubeTrending(numSearches, to){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopular&gl=US&maxResults=${numSearches}&key=AIzaSyCCFpsCSr2aWaxWGZVb3V16rTjBn_YK5WM`
    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        var d = 'Top ' + numSearches + ' Trending on YouTube: \n' //PUT SEARCHCES TITLES AND NUMS ; LOOP T HROUGH HERE
        for (var i=1; i<=out.items.length; i++){
            var vidID = out.items[i-1].id
            
            let videoUrl = `https://www.googleapis.com/youtube/v3/videos?id=${vidID}&key=AIzaSyCCFpsCSr2aWaxWGZVb3V16rTjBn_YK5WM&fields=items(id,snippet(channelId,title,categoryId),statistics)&part=snippet,statistics`
            const vidData = await fetch(videoUrl)
            const vidOut = await vidData.json()
            console.log(vidOut.items[0].id)
            d = d + "#"+ i +": " + vidOut.items[0].snippet.title + ": " + "https://www.youtube.com/watch?v="+ vidID + "\n"
        }
        await client.messages.create({
            to: to,
            from: '+14088821788', 
            body: `${d}`
        });
        console.log('Request sent');
        } catch(error) {
        console.error(error);
        }
    }

    sendTextMessage(to)
}

