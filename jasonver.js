const http = require("http")
var bodyParser = require('body-parser');
const express = require("express")
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const MessagingResponse = require("twilio").twiml.MessagingResponse
const url = 'https://www.reddit.com';
const app = express()
var string = "";
var max = 10;
var counter = 1;

puppeteer
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
    $('h2', html).each(function() {
      if(counter< max ){
      string = string +($(this).text())+"\n\n\n";
      counter = counter +1;
    }
    });
  })
  .catch(function(err) {
    //handle error
});

app.use(bodyParser.urlencoded({extended: false}));
app.post('/', (req, res) => {

    let user_message = req.body.Body.toLowerCase()
    const twiml = new MessagingResponse();
    if (user_message == 'hello') {
      twiml.message('Hi!');
    } else if (user_message == 'bye') {
      twiml.message('Goodbye');
    }else if ( user_message=='reddit'){
      twiml.message(string);
    }
    else {
      twiml.message(
        'No Body param match, Twilio sends this in the request to your server.'
      );
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });

app.get('/', function (req, res) {
<<<<<<< HEAD
  res.send(string);
=======
  res.send('hello world')
})

http.createServer(app).listen(process.env.PORT || 1337, ()=> console.log("Listening on port 1337"))
