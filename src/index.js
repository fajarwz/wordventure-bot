const TelegramBot = require('node-telegram-bot-api');
const { registerCommands } = require('./commands');
const { startScheduler } = require('./scheduler');
const { botToken } = require('./config');

const bot = new TelegramBot(botToken, { polling: true });

// Register bot commands
registerCommands(bot);

// Start the daily broadcast scheduler
startScheduler(bot);
