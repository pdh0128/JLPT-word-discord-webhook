const DISCORD_API = "https://discord.com/api/v10";

async function sendDiscord(webhookUrl, payload) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Discord API error ${res.status}: ${text}`);
  }
}

function buildQuizMessage(quizzes) {
  const levelNames = { 1: "N1", 2: "N2", 3: "N3", 4: "N4", 5: "N5" };
  const grouped = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  for (const q of quizzes) {
    if (grouped[q.level]) grouped[q.level].push(q);
  }

  const embeds = [];
  for (const level of [1, 2, 3, 4, 5]) {
    const levelQuizzes = grouped[level];
    if (levelQuizzes.length === 0) continue;

    const fields = levelQuizzes.map((q) => {
      const [word, rest] = q.question.split("\n");
      return {
        name: `**${word}**`,
        value: `${rest || ""}\n정답: ||${q.answer}||`.trim(),
        inline: false,
      };
    });

    embeds.push({
      title: `📌 ${levelNames[level]}`,
      color: 0x00ff00,
      fields,
    });
  }

  return embeds;
}

async function postQuiz(webhookUrl, quizzes) {
  const embeds = buildQuizMessage(quizzes);
  await sendDiscord(webhookUrl, {
    content: "## 📝 JLPT 단어 퀴즈",
    embeds,
  });
}

module.exports = { postQuiz, buildQuizMessage };
