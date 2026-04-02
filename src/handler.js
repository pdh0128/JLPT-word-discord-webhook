const { getRandomWord, translateToKorean } = require("./api");
const { generateQuizzes } = require("./quiz");
const { postQuiz } = require("./discord");

const QUIZ_COUNT_PER_LEVEL = 3;
const LEVELS = [1, 2, 3, 4, 5];

async function handler() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("DISCORD_WEBHOOK_URL is not set");

  const allWords = [];
  for (const level of LEVELS) {
    for (let i = 0; i < QUIZ_COUNT_PER_LEVEL; i++) {
      const result = await getRandomWord(level);
      result.meaning = await translateToKorean(result.meaning);
      allWords.push(result);
    }
  }

  const quizzes = generateQuizzes(allWords);
  await postQuiz(webhookUrl, quizzes);

  return { statusCode: 200, body: JSON.stringify({ quizCount: quizzes.length }) };
}

module.exports = { handler };
