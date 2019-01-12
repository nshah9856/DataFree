// var unirest = require('unirest');
// unirest.get("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=true&pageNumber=1&pageSize=10&q=Taylor+Swift&safeSearch=false")
// .header("X-RapidAPI-Key", "852775e4cemsh0e95e5ce65db594p1d88c2jsn7bd73002539b")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });

require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotnev = require("dotenv")
dotenv.load()

module.exports = exports = function getWeather(search, to){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=true&pageNumber=1&pageSize=5&q=${search}&safeSearch=false`

    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        var d = out.value[0]
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
