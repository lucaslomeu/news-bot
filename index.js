// Axios request to connect to the API
const axios = require('axios')

// TwitterClient is a const that contains the Twitter API credentials
const mnClient = require('./twitterClient.js')

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
        if (previousId && id !== previousId) {
          console.log("New story! Let's tweet it!")
          console.log('id', id)
          console.log('previousId', previousId)
          // Post the story to Twitter
          mnClient.v1.tweet(`"${title}" ${url}`)
          previousId = id // Save the ID to compare with the next one
        } else {
          console.log("No new stories! Let's wait for a new one in a minute!")
        }
      })
  }

  // Repeat the function every minute
  setInterval(postTweet, 60000)
}

// Run the function
getNews()
