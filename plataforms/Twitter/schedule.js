// CronJob
const CronJob = require('cron').CronJob

const scheduleTweet = () => {
  console.log('Cron job is running!')

  // Post the good morning tweet
  const morningTweet = new CronJob('0 5 * * * *', () => {
    mnClient.v1.tweet("Let's get the news!")
  })

  // Post the tweet for weekend
  const weekendTweet = new CronJob('0 18 * * * 5', () => {
    mnClient.v1.tweet('Enjoy the weekend!')
  })

  // Array to store the CronJobs
  const scheduleOptions = [morningTweet, weekendTweet]

  // Start the cron job
  scheduleOptions.forEach(schedule => schedule.start())
}

module.exports = scheduleTweet
