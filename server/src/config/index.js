let parsed = require('./get').fetch();
const config = {
  PORT: process.env.PORT || 9099,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'sdgsgds@fdsgsdgdsgdsg',
  JWT_PUBLIC: process.env.JWT_PUBLIC || 'etuTiD4mfhAazYNmLjuZZuU7rr1WDrTQ',
  SERVER_URL: process.env.SERVER_URL || parsed.SERVER_URL || 'nycfirewireapp.com',
  ONE_SIGNAL_API_KEY: process.env.ONE_SIGNAL_API_KEY,
  ONE_SIGNAL_APP_ID: process.env.ONE_SIGNAL_APP_ID,
  IS_UNIT_TEST: typeof process.env.JEST_WORKER_ID !== 'undefined',
  MOCK_ONE_SIGNAL: typeof process.env.MOCK_ONE_SIGNAL !== 'undefined',
  FB_APP_ID: process.env.FB_APP_ID || parsed.FB_APP_ID,
  FB_APP_SECRET: process.env.FB_APP_SECRET || parsed.FB_APP_SECRET,
  TWITTER_API_ACCESS_TOKEN:
    process.env.TWITTER_API_ACCESS_TOKEN ||
    parsed.TWITTER_API_ACCESS_TOKEN ||
    '',
  TWITTER_API_ACCESS_TOKEN_SECRET:
    process.env.TWITTER_API_ACCESS_TOKEN_SECRET ||
    parsed.TWITTER_API_ACCESS_TOKEN_SECRET ||
    '',
  TWITTER_API_KEY: process.env.TWITTER_API_KEY || parsed.TWITTER_API_KEY || '',
  TWITTER_API_KEY_SECRET:
    process.env.TWITTER_API_KEY_SECRET || parsed.TWITTER_API_KEY_SECRET || '',
  TWITTER_API_BEARER_TOKEN:
    process.env.TWITTER_API_BEARER_TOKEN ||
    parsed.TWITTER_API_BEARER_TOKEN ||
    '',
};
parsed = Object.assign(parsed, config);
module.exports = parsed;
