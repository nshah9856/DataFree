var unirest = require('unirest');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotnev = require("dotenv")
dotenv.load()
// unirest.get("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=true&pageNumber=1&pageSize=10&q=Taylor+Swift&safeSearch=false")
// .header("X-RapidAPI-Key", "852775e4cemsh0e95e5ce65db594p1d88c2jsn7bd73002539b")
// .end(function (result) {
//   console.log(result.body);
// });

// var d = "";
// var rqst = unirest.get("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=true&pageNumber=1&pageSize=10&q=Taylor+Swift&safeSearch=false");
// var hdr = rqst.header("X-RapidAPI-Key", "zeN5uN1iRwmsh2snD3HP4jjd6jA9p1Gmi7VjsnUWHwEDDqP7gr");
//
// for (var i=0; i<3; i++) {
//     d += hdr.end(function (result) {
//       console.log(result.body.value[i].title,
//       result.body.value[i].url, result.body.value[i].description)});
// }


module.exports = exports = function getNews(search, to){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=true&pageNumber=1&pageSize=3&q=${search}&safeSearch=false`
    var rqst = unirest.get(url);
    var hdr = rqst.header("X-RapidAPI-Key", "zeN5uN1iRwmsh2snD3HP4jjd6jA9p1Gmi7VjsnUWHwEDDqP7gr");

    // Construct message
    var d = search + "News"

    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        for (var i=0; i<3; i++) {
            d += hdr.end(function (result) {
              result.body.value[i].title,
              result.body.value[i].url, result.body.value[i].description)};
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
