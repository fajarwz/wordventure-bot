require('dotenv').config();

const config = {
  botToken: process.env.BOT_TOKEN,
  database: {
    url: process.env.DATABASE_URL,
  },
  dictionary: {
    baseApi: process.env.DICTIONARY_BASE_API,
  },
};

if (!config.botToken) {
  throw new Error('❌ Token is missing');
}

module.exports = config;
