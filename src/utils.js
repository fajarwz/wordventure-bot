const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Load the words from the file (one word per line)
const wordFilePath = path.join(__dirname, '../data/words.txt');
const wordList = fs.readFileSync(wordFilePath, 'utf-8')
  .split('\n')
  .filter(Boolean);

function getRandomWord() {
  const index = Math.floor(Math.random() * wordList.length);
  return wordList[index].trim();
}

async function fetchWordData(word) {
  try {
    const res = await axios.get(`${config.dictionary.baseApi}/v2/entries/en/${word}`);
    const data = res.data[0];

    // Map all definitions from the first meaning into an array
    const definitions = data.meanings[0]?.definitions;

    // Get synonyms and antonyms from the first definition
    const synonyms = data.meanings[0]?.synonyms || [];
    const antonyms = data.meanings[0]?.antonyms || [];

    return {
      word: data.word,
      definitions,
      synonyms,
      antonyms,
    };
  } catch (err) {
    console.error(err);
    console.error(`Error fetching data for word "${word}": ${err.message}`);
    return null;
  }
}

function formatWordMessage(wordData) {
  // Format definitions as a numbered list
  let definitionsText = wordData.definitions.length
    ? wordData.definitions
      .map((def, i) => {
        let entry = `${i + 1}. ${def.definition}`;
        if (def.example) {
          entry += `\n_Example: ${def.example}_`;
        }
        return entry;
      })
      .join('\n\n')
    : 'No definition available.';

  // Format synonyms and antonyms
  const synonymsText = wordData.synonyms.length ? wordData.synonyms.join(', ') : 'None';
  const antonymsText = wordData.antonyms.length ? wordData.antonyms.join(', ') : 'None';

  return `✨ *${wordData.word.toUpperCase()}*\n\n*Definitions:*\n${definitionsText}\n\n*Synonyms:* ${synonymsText}\n*Antonyms:* ${antonymsText}`;
}

function formatDailyWordMessage(wordData) {
  return `✨ *Word of the Day* ✨\n\n${formatWordMessage(wordData)}`;
}

module.exports = {
  getRandomWord,
  fetchWordData,
  formatWordMessage,
  formatDailyWordMessage,
};
