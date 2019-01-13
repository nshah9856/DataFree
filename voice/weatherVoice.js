require('es6-promise').polyfill();
require('isomorphic-fetch');


const VoiceResponse = require("twilio").twiml.VoiceResponse
const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = 
function getWeather(location, res){
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=bfcdb6bb34f68ccc033fb9e297c8df1f`

    async function reply() {
        try {
        const data = await fetch(url)
        const out = await data.json()
        var d = 'Current temperature is: ' + Math.round(out.main.temp)  
        var d1 = "Minumum today: " + Math.round(out.main.temp_min)
        var d2 = "Maximum today: " + Math.round(out.main.temp_max)
        const response = new VoiceResponse()
        response.say(d)
        response.say(d1)
        response.say(d2)
        response.pause({length:1})
        res.type('text/xml');
        res.send(response.toString());
     }   catch(error) {
        console.error(error);
        }
    }

    reply()
}

