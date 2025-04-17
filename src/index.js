const TelegramBot = require('node-telegram-bot-api');
const { registerCommands } = require('./commands');
const { startScheduler } = require('./scheduler');
const config = require('./config');

const options = {
  webHook: {
    port: 443
  }
};

const url = config.app.baseUrl;
const bot = new TelegramBot(config.botToken, options);

bot.setWebHook(`${url}/bot${botToken}`);

// Register bot commands
registerCommands(bot);

// Start the daily broadcast scheduler
startScheduler(bot);
