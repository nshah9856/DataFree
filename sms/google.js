
require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotenv = require("dotenv")
dotenv.load()

module.exports = exports = 
function search(search, to, num){
    var twilio = require('twilio');

    var client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH); // TODO

    let url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAo_Gm8XXDV1lBIJDoiyr0S9NwKQQqy94s&cx=013122210725277253496:ts6w8ob_n5q&q=${search}`

    async function sendTextMessage(to) {
        try {
        const data = await fetch(url)
        const out = await data.json()
        let string = `Top Google results for ${search}:\n`
        for (i in out.items){
            if (i < num){
                let title = out.items[i].title
                let summary = out.items[i].snippet
                
                string += `${parseInt(i) + 1}. ${title}\n${summary}\n\n`
            }
        }
        await client.messages.create({
            to: to,
            from: process.env.TWILIO_NUMBER, 
            body: `${string}`
        });
        console.log("Request sent")
        }  catch(error) {
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
