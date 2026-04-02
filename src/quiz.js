function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n = 1) {
  const s = shuffle(arr);
  return n === 1 ? s[0] : s.slice(0, n);
}

function makeQuiz(word, type) {
  const furigana = word.furigana ? `\`${word.furigana}\`` : "";
  if (type === "word") {
    return {
      type: "word",
      level: word.level,
      question: `${word.meaning}\n${furigana}`.trim(),
      answer: word.word,
    };
  }
  return {
    type: "meaning",
    level: word.level,
    question: `${word.word}\n${furigana}`.trim(),
    answer: word.meaning,
  };
}

function generateQuizzes(words) {
  return words.map((w) => makeQuiz(w, "meaning"));
}

module.exports = { generateQuizzes, makeQuiz, pick, shuffle };
