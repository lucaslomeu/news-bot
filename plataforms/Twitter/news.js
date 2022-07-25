// Axios request to connect to the API
const axios = require('axios')

// TwitterClient is a const that contains the Twitter API credentials
const TwitterClient = require('./client.js')

// The following function is used to get the tweets from the API
const getNews = async () => {
  console.log('Getting the news!')
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
        setTimeout(postTweet, 60000)
        console.error('Error: ', err)
      })

    // Request the story with the ID
    await axios
      .get(
        `https://hacker-news.firebaseio.com/v0/item/${currentId}.json?print=pretty`
      )
      .then(story => {
        // Get the title, URL and ID of the story
        const { title, url, id } = story.data

        if (id !== previousId && title && url && id) {
          // Alert the user that a new story has been posted
          console.log("New story! Let's tweet it!")

          // Dont tweet title includes "Ask HN or Show HN"
          if (title.includes('Ask HN') || title.includes('Show HN')) {
            console.log('This story is not worth tweeting')
          } else {
            // Post the story to Twitter
            TwitterClient.v1.tweet(`"${title}" ${url !== undefined && url}`)
          }

          // Save the ID to compare with the next one
          previousId = id
        } else {
          console.log("No new stories! Let's wait for a new one in a minute!")
        }
      })
      .catch(err => {
        setTimeout(postTweet, 60000)
        console.error('Error: ', err)
      })
  }

  // Repeat the function every minute
  setInterval(postTweet, 60000)
}

module.exports = getNews
