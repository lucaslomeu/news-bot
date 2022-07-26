const getNews = require('./plataforms/Twitter/news.js')
const scheduleTweet = require('./plataforms/Twitter/schedule.js')
const updateHeader = require('./plataforms/Twitter/header.js')
let express = require('express')
let app = express()

const startTheBot = () => {
  // Start functions for twitter
  getNews()
  scheduleTweet()
  updateHeader()
}

startTheBot()

app.set('port', process.env.PORT || 80)

//For avoidong Heroku $PORT error
app
  .get('/', function (request, response) {
    let result = 'App is running'
    response.send(result)
  })
  .listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'))
  })
