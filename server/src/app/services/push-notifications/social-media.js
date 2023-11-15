//const config = require('../../../config');
const { TwitterApi } = require('twitter-api-v2');

module.exports.makePost = async (tweet,config) => {
  const client = new TwitterApi({
    appKey: config.TWITTER_API_KEY,
    appSecret: config.TWITTER_API_KEY_SECRET,
    accessToken: config.TWITTER_API_ACCESS_TOKEN,
    accessSecret: config.TWITTER_API_ACCESS_TOKEN_SECRET,
    bearerToken: config.TWITTER_API_BEARER_TOKEN,
  });

  const rwClient = client.readWrite;

  let res = null;
  let errMsg = '';
  try {
    res = await rwClient.v2.tweet(tweet).catch(error => {
      console.debug(JSON.stringify(error, null, 2));
      let copy = JSON.parse(JSON.stringify(error));
      errMsg = `status: ${copy.error.status}, code: ${copy.code}. message: ${copy.error.detail}`;
      return null;
    });
    if (res === null) {
      throw errMsg;
    }
    console.debug('postOnTwitter response', JSON.stringify(res, null, 2));
    return {
      response: res,
      tweet: tweet,
      client: rwClient,
      status: 'ok',
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      response: res,
      tweet: tweet,
      client: rwClient,
      status: 'error',
      error,
    };
  }
};
