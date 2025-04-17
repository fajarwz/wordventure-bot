require('dotenv').config();

const config = {
  botToken: process.env.BOT_TOKEN,
  database: {
    url: process.env.DATABASE_URL,
  },
  dictionary: {
    baseApi: process.env.DICTIONARY_BASE_API,
  },
  app: {
    baseUrl: process.env.APP_BASE_URL,
    port: process.env.APP_PORT || 80,
  },
};

if (!config.botToken) {
  throw new Error('❌ Token is missing');
}

module.exports = config;
