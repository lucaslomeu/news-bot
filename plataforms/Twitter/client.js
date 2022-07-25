// Dotenv environment variables
require('dotenv').config()

// TwitterApi handles the communication with the Twitter API
const { TwitterApi } = require('twitter-api-v2')

// Client with the Twitter API credentials
const client = new TwitterApi({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET
})

const TwitterClient = client.readWrite

module.exports = TwitterClient
