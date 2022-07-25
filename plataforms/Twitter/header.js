// Axios request to connect to the API
const axios = require('axios')

// CronJob
const CronJob = require('cron').CronJob

// TwitterClient is a const that contains the Twitter API credentials
const TwitterClient = require('./client.js')

// Change header twitter each 24 hours
// Tags: news, technology, newspapper

const searchQuery = ['news', 'technology', 'newspapper']

const randomize = item => {
  return item[Math.floor(Math.random() * item.length)]
}

const randomQuery = randomize(searchQuery)

const searchUrl = `https://api.pexels.com/v1/search?query=${randomQuery}&per_page=100`

const configAxios = {
  headers: {
    Authorization: process.env.PEXEL_API_KEY
  }
}

const headerAndUpdateProfileBanner = async imageUrl => {
  return await axios
    .get(imageUrl, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const returnBuffer = Buffer.from(response.data)
      TwitterClient.v1.updateAccountProfileBanner(returnBuffer)
    })
    .catch(err => console.error(err))
}

const updateHeader = () => {
  console.log('Updating the header!')
  const getRandomImage = () => {
    return axios
      .get(searchUrl, configAxios)
      .then(response => {
        const randomPhoto = randomize(response.data.photos)
        headerAndUpdateProfileBanner(randomPhoto.src.landscape)
      })
      .catch(err => console.error(err))
  }

  new CronJob('0 1 * * *', getRandomImage).start()
}

module.exports = updateHeader
