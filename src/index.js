const TelegramBot = require('node-telegram-bot-api');
const { registerCommands } = require('./commands');
const { startScheduler } = require('./scheduler');
const config = require('./config');

const PORT = config.app.port;
const USE_WEBHOOK = config.app.useWebhook;
const WEBHOOK_PATH = `/bot${config.botToken}`;
const WEBHOOK_URL = `${config.app.baseUrl}${WEBHOOK_PATH}`;

let bot;

if (USE_WEBHOOK) {
  bot = new TelegramBot(config.botToken, { webHook: { port: PORT } });

  bot.setWebHook(WEBHOOK_URL)
    .then(() => console.log('✅ Webhook set:', WEBHOOK_URL))
    .catch(err => console.error('🚨 Failed to set webhook:', err.response?.body || err));
} else {
  bot = new TelegramBot(config.botToken, { polling: true });
  console.log('📡 Bot started in polling mode');
}

registerCommands(bot);
startScheduler(bot);
