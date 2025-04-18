const config = require('./config');
const prisma = require('./config/prisma');
const { fetchWordData, getRandomWord, formatDailyWordMessage } = require('./utils');
const cron = require('node-cron');

function startScheduler(bot) {
  cron.schedule(config.app.dailyWordSchedule, async () => {
    console.log("Sending daily words to all subscribers...");
    await sendWordToAllSubscribers(bot);
  });
}

async function sendWordToAllSubscribers(bot) {
  let data;
  const retries = 3;
  let attempt = 1;

  while (attempt <= retries && !data) {
    const word = getRandomWord();
    console.log(`Attempt ${attempt} to fetch word data for "${word}"`);

    data = await fetchWordData(word);

    if (!data) {
      console.log(`Failed to fetch data for "${word}", retrying another word...`);
      if (attempt < retries) {
        const seconsdsToWait = 1000 * 2;
        await new Promise(resolve => setTimeout(resolve, seconsdsToWait));
      }
    }

    attempt++;
  }

  const message = formatDailyWordMessage(data);

  const subscribers = await prisma.subscriber.findMany();

  subscribers.forEach((subscriber) => {
    const chatId = subscriber.chatId.toString();
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });
};

module.exports = {
  startScheduler,
};
