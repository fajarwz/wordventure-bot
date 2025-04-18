const config = require('./config');
const prisma = require('./config/prisma');
const { fetchWordData, getRandomWord, formatWordMessage } = require('./utils');

function registerCommands(bot) {
  bot.onText(/\/(start|help)/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      `Welcome to ${config.botName}!
Use /subscribe to get a new word every day.
Use /word to get a random word now.
Use /quiz to test your vocabulary!`
    );
  });

  bot.onText(/\/subscribe/, async (msg) => {
    try {
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { chatId: msg.chat.id },
      });

      if (existingSubscriber) {
        return bot.sendMessage(msg.chat.id, 'You are already subscribed!');
      }

      // Add subscriber to the database
      await prisma.subscriber.create({
        data: {
          chatId: msg.chat.id,
        },
      });

      bot.sendMessage(msg.chat.id, `✅ Subscribed! You'll get a new word daily.`);
    } catch (error) {
      console.error('Error subscribing user:', error);
      bot.sendMessage(msg.chat.id, `❌ Failed to subscribe. Please try again later.`);
    }
  });

  bot.onText(/\/unsubscribe/, async (msg) => {
    try {
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { chatId: msg.chat.id },
      });

      if (!existingSubscriber) {
        return bot.sendMessage(msg.chat.id, 'You are not subscribed!');
      }

      // Remove subscriber from the database
      await prisma.subscriber.delete({
        where: { chatId: msg.chat.id },
      });

      bot.sendMessage(msg.chat.id, `❌ Unsubscribed. Come back soon!`);
    } catch (error) {
      console.error('Error unsubscribing user:', error);
      bot.sendMessage(msg.chat.id, `❌ Failed to unsubscribe. Please try again later.`);
    }
  });

  bot.onText(/\/word/, async (msg) => {
    const word = getRandomWord();
    const data = await fetchWordData(word);
    if (data) {
      bot.sendMessage(msg.chat.id, formatWordMessage(data), { parse_mode: 'Markdown' });
    } else {
      bot.sendMessage(msg.chat.id, 'Sorry, please try again.');
    }
  });

  bot.onText(/\/quiz/, async (msg) => {
    const correctWord = getRandomWord();
    const correctData = await fetchWordData(correctWord);
    if (!correctData) return bot.sendMessage(msg.chat.id, 'Error getting quiz word.');

    const choices = [correctData.definitions[0].definition];
    while (choices.length < 4) {
      const otherWord = getRandomWord();
      const data = await fetchWordData(otherWord);
      if (data && !choices.includes(data.definitions[0].definition)) {
        choices.push(data.definitions[0].definition);
      }
    }

    // Shuffle and assign IDs
    const shuffled = choices
      .map((definition, index) => ({ definition, id: `opt${index}` }))
      .sort(() => 0.5 - Math.random());

    // Store answer for comparison later
    const correctAnswerId = shuffled.find(c => c.definition === correctData.definitions[0].definition).id;

    // Create inline keyboard buttons
    const inlineKeyboard = shuffled.map((choice) => ([{
      text: choice.definition.slice(0, 100) + (choice.definition.length > 100 ? '...' : ''),
      callback_data: choice.id,
    }]));

    bot.sendMessage(msg.chat.id, `What does *${correctWord}* mean?`, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: inlineKeyboard },
    });

    bot.once('callback_query', (query) => {
      const selectedChoice = shuffled.find(c => c.id === query.data);
      const isCorrect = query.data === correctAnswerId;

      bot.sendMessage(query.message.chat.id,
        `${isCorrect ? '*✅ Correct!*\n\n' : '*❌ Wrong!*\n\n'} *Your answer*: ${selectedChoice.definition}${!isCorrect ? `\n\n*Correct answer*: ${correctData.definitions[0].definition}` : ''}`,
        { parse_mode: 'Markdown' }
      );
    });
  });
}

module.exports = {
  registerCommands,
};
