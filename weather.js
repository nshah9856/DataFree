require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getWeather(location, to){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=bfcdb6bb34f68ccc033fb9e297c8df1f`

    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        var d = 'Current temperature is: ' + Math.round(out.main.temp) + "\nMinumum today: " + Math.round(out.main.temp_min) + "\nMaximum today: " + Math.round(out.main.temp_max)
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
