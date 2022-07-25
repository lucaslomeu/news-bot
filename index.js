// Axios request to connect to the API
const axios = require('axios')

// TwitterClient is a const that contains the Twitter API credentials
const mnClient = require('./twitterClient.js')

// Cron job to post scheduled tweets
const CronJob = require('cron').CronJob

// The following function is used to get the tweets from the API
const getNews = async () => {
  // Most recents stories from the HackerNews
  const newStories =
    'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty'

  // Variable to store the actual id of the story
  let currentId

  // Variable to be compared to the previous ID
  let previousId

  const postTweet = async () => {
    // Request newStories
    await axios
      .get(newStories)
      .then(news => {
        const id = news.data[0] // Get the last ID from the array
        currentId = id // Save the last ID to compare with the next one
      })
      .catch(err => {
        console.log(err)
      })

    // Request the story with the ID
    await axios
      .get(
        `https://hacker-news.firebaseio.com/v0/item/${currentId}.json?print=pretty`
      )
      .then(story => {
        // Get the title, URL and ID of the story
        const title = story.data.title
        const url = story.data.url
        const id = story.data.id

        // Check if the story is new
        // I need check if previousId is undefined because the first time the program is run. The previousId is undefined and the program will post the first story

        if (id !== previousId) {
          // Alert the user that a new story has been posted
          console.log("New story! Let's tweet it!")

          // Dont tweet title includes "Ask HN or Show HN"
          if (title.includes('Ask HN') || title.includes('Show HN')) {
            console.log('This story is not worth tweeting')
          } else {
            // Post the story to Twitter
            mnClient.v1.tweet(`"${title}" ${url !== undefined && url}`)
          }

          // Save the ID to compare with the next one
          previousId = id
        } else {
          console.log("No new stories! Let's wait for a new one in a minute!")
        }
      })
  }

  const scheduleTweet = () => {
    console.log(
      'Cron job is running! We will tweet every morning at 5:00 AM and 11:00 PM'
    )

    // Post the good morning tweet
    const morningTweet = new CronJob('0 5 * * * *', () => {
      mnClient.v1.tweet("Good morning! Let's get the news!")
    })

    // Post the good morning tweet
    const nightTweet = new CronJob('0 23 * * * *', () => {
      mnClient.v1.tweet("Good night! Let's go to the bed!")
    })

    // Post the tweet for weekend
    const weekendTweet = new CronJob('0 18 * * * 5', () => {
      mnClient.v1.tweet('Enjoy the weekend!')
    })

    // Post the tweet for start of the week
    const startWeek = new CronJob('0 4 * * * 2', () => {
      mnClient.v1.tweet("Good week for everyone! Let's start a new one!")
    })

    const scheduleOptions = [morningTweet, nightTweet, weekendTweet, startWeek]

    // Start the cron job
    scheduleOptions.forEach(schedule => schedule.start())
  }

  // Repeat the function every minute
  scheduleTweet()
  setInterval(postTweet, 60000)
}

// Run the global function
getNews()
