
require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotenv = require("dotenv")
dotenv.load()
const VoiceResponse = require("twilio").twiml.VoiceResponse

module.exports = exports = 
function search(search, res){

    let url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAo_Gm8XXDV1lBIJDoiyr0S9NwKQQqy94s&cx=013122210725277253496:ts6w8ob_n5q&q=${search}`

    async function sendTextMessage() {
        try {
        const data = await fetch(url)
        const out = await data.json()
        let string = `Top Google results for ${search}:\n`
        for (i in out.items){
            if (i < 5){
                let title = out.items[i].title
                let summary = out.items[i].snippet
                
                string += `Title: ${title}tabsSummary: ${summary}\n`
            }
        }
        const response = new VoiceResponse()

        let d =  string.split("\n")
        for (i in d){
            let d1 = d[i].split("tabs")
            for(j in d1){
                response.say(d1[j])
                response.pause({
                    length: 0.5
                });
            }
            response.pause({length:1})
        }
        
        res.type('text/xml');
        res.send(response.toString());

       }  catch(error) {
            console.error(error)
        }
    }
    sendTextMessage()
}
