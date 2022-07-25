const getNews = require('./plataforms/Twitter/news.js')
const scheduleTweet = require('./plataforms/Twitter/schedule.js')
const updateHeader = require('./plataforms/Twitter/header.js')

const startTheBot = () => {
  // Start functions for twitter
  getNews()
  scheduleTweet()
  updateHeader()
}

startTheBot()
