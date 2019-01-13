 
require('es6-promise').polyfill();
require('isomorphic-fetch');

const VoiceResponse = require("twilio").twiml.VoiceResponse
const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getDirections(startAddress, finalAddress, res){
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startAddress}&destination=${finalAddress}&key=${process.env.GOOGLEMAP_KEY}`

    async function sendTextMessage() {
        try {
        const data = await fetch(url)
        const out = await data.json()

        var d = "Directions FROM  " + startAddress + " TO " + finalAddress + ":\n"
        for (var i=1; i<=out.routes[0].legs[0].steps.length; i++){
            var StrippedString = out.routes[0].legs[0].steps[i-1].html_instructions.replace(/(<([^>]+)>)/ig,"");
            var StrippedString  = StrippedString.replace("&nbsp;","")
            d += StrippedString + "\n"
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
            console.error(error);
        }
    }
    sendTextMessage()
}
