require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getGas(to, currLocation, results){
    var twilio = require('twilio');

    var client = new  twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH);

    let locUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${currLocation}&key=${process.env.GOOGLEMAP_KEY}`;

    async function sendTextMessage(to) {
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

            d = d + i + ". " + station_name + "\n" + address + "\nDistance: " + distance + "\n\n";
        }
        await client.messages.create({
            to: to,
            from: process.env.TWILIO_NUMBER,
            body: `${d}`
        });
        console.log('Request sent');
        } catch(error) {
            if (error.code === 21617){
                client.messages.create({
                    to: to,
                    from: process.env.TWILIO_NUMBER,
                    body: `Too much data to display in a text message requested, lower the count!`
                });
            }else{
                console.error(error)
            }
                }
    }

    sendTextMessage(to)
}
