require('es6-promise').polyfill();
require('isomorphic-fetch');


const dotnev = require("dotenv")
dotnev.load()

module.exports = exports = function getNews(to, num){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_KEY}`
    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        var d = 'Top Trending News: \n' //PUT SEARCHCES TITLES AND NUMS ; LOOP T HROUGH HERE
        for (var i=0; i<num; i++){

            var articleTitle = out.articles[i].title;
            var articleUrl = out.articles[i].url;

            d = d + (i+1) + ". " + articleTitle + " \n" + articleUrl + "\n\n";
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
