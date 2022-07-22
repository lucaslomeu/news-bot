const rwClient = require('./twitterClient.js')

const tweet = async () => {
  try {
    await rwClient.v2.tweet('Hello from Node.js!')
  } catch (e) {
    console.log(e)
  }
}

tweet()
