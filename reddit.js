require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = function getRedditPosts(to){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = "https://www.reddit.com/r/popular/top.json"

    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        let string = 'Top Trending Reddit Posts: \n' 
        for (i in out.data.children){
            if (i < 5)
            {var title = out.data.children[i].data.title
            var link = "reddit.com/" + out.data.children[i].data.permalink
            string += (i+1) + ". " +title + "\n" + link +"\n\n"}
        }

        await client.messages.create({
            to: to,
            from: process.env.TWILIO_NUMBER, 
            body: `${string}`
        });
        console.log('Request sent');
        } catch(error) {
        console.error(error);
        }
    }

    sendTextMessage(to)
}

