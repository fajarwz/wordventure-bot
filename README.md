# 📚 Wordventure Bot — Your Daily Dose of Words, via Telegram

Wordventure Bot is a Node.js-powered Telegram bot that sends subscribers a new English word every day — complete with definitions, examples, synonyms, and antonyms — to help grow your vocabulary effortlessly.

## ✨ Features
💬 Sends beautifully formatted daily word messages on Telegram\
📖 Provides multiple definitions, usage examples, synonyms, and antonyms\
🔁 Retries fetching words if data is incomplete or unavailable\
🔔 Scheduled delivery via cron (daily at 9 AM or customizable)\
🧠 Words are randomly selected to keep it fresh\
📦 Uses Prisma and PostgreSQL to manage subscribers

## ⚙️ Tech Stack
- Node.js
- Prisma + PostgreSQL
- Telegram Bot API
- Axios
- node-cron

## 🛠 Setup
```bash
# Clone the project
git clone https://github.com/yourusername/wordventure-bot.git
cd wordventure-bot

# Install dependencies
npm install

# Set your environment variables
cp .env.example .env
# Edit .env to include your Telegram bot token and database URL

# Generate Prisma client
npx prisma generate

# Run the bot
npm start
```

## 💡 Inspiration
Inspired by the idea of learning a little every day. Whether you're a word nerd, student, or language learner, this bot helps you stay curious and consistent.

## Data Source
- Words (Oxford 5000.txt): [jnoodle/English-Vocabulary-Word-List](https://github.com/jnoodle/English-Vocabulary-Word-List)