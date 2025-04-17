const TelegramBot = require('node-telegram-bot-api');
const { registerCommands } = require('./commands');
const { startScheduler } = require('./scheduler');
const config = require('./config');

const options = {
  webHook: {
    port: 443
  }
};

const baseurl = config.app.baseUrl;
const bot = new TelegramBot(config.botToken, options);

const url = `${baseurl}/bot${config.botToken}`;
console.log(`URL: ${url}`);
bot.setWebHook(url);

// Register bot commands
registerCommands(bot);

// Start the daily broadcast scheduler
startScheduler(bot);
