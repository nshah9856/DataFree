var unirest = require('unirest');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getNews(search, to){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=true&pageNumber=1&pageSize=3&q=${search}&safeSearch=false`
    var rqst = unirest.get(url);
    var hdr = rqst.header("X-RapidAPI-Key", process.env.NEWS_KEY);

    // Construct message
    var d = search + "News \n";

    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        for (var i=0; i<3; i++) {
            d += hdr.end(function (result) {
              result.body.value[i].title,
              result.body.value[i].url,
              result.body.value[i].description});
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
