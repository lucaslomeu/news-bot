const { TwitterApi } = require('twitter-api-v2')

const client = new TwitterApi({
  appKey: '10075OXJ29oqGgwWKEFVWD8wa',
  appSecret: 'rQjBdoFm6yPFTSAYdLeeB64qn9NAu6BjDB1fIvTwkGbs6qGxaw',
  acessToken: '1181549305938747394-SVZAoBOr55VEaM18U5SWdnKlYHHnsC',
  acessSecret: 'xD5UZvaJ4QDYPHwPzqUoGVAcbLn0yYd0oqXnCMHKsG4EZ'
})

const rwClient = client.readWrite

module.exports = rwClient
