require('es6-promise').polyfill();
require('isomorphic-fetch');

const VoiceResponse = require("twilio").twiml.VoiceResponse
const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getGas(currLocation, res, results=5){
  
    let locUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${currLocation}&key=${process.env.GOOGLEMAP_KEY}`;

    async function sendTextMessage() {
        try {

        const locData = await fetch(locUrl);
        const locOut = await locData.json();

        var lat = locOut.results[0].geometry.location.lat;
        var lng = locOut.results[0].geometry.location.lng;


        let url = `http://api.mygasfeed.com/stations/radius/${lat}/${lng}/20/reg/distance/${process.env.GAS_KEY}.json?`;

        const data = await fetch(url)
        const out = await data.json()
        var d = 'Nearby Gas Stations: \n'
        for (var i=1; i<=results; i++){
            var station = out.stations[i-1];

            var station_name = station.station;
            var streetAddr = station.address;
            var city = station.city;
            var region = station.region;
            var zip = station.zip;
            let address = `${streetAddr}, ${city}, ${region} ${zip}`;
            var distance = station.distance;

            d = d + station_name + "tabs" + address + "tabs Distance: " + distance + "\n";
        }

        const response = new VoiceResponse()

        let d1 =  d.split("\n")
        for (i in d1){
            let d2 = d1[i].split("tabs")
            for(j in d2){
                response.say(d2[j])
                response.pause({
                    length: 0.5
                });
            }

            response.pause({length:1})
           
        }

        res.type('text/xml');
        res.send(response.toString());

        } catch(error) {
            console.error(error)
        }
    }

    sendTextMessage()
}
