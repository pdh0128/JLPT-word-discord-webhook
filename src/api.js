const API_BASE = "https://jlpt-vocab-api.vercel.app/api";

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function getRandomWord(level) {
  const url = level
    ? `${API_BASE}/words/random?level=${level}`
    : `${API_BASE}/words/random`;
  return fetchJSON(url);
}

async function getWords({ level, offset = 0, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (offset) params.set("offset", offset);
  if (limit) params.set("limit", limit);
  const qs = params.toString();
  return fetchJSON(`${API_BASE}/words${qs ? `?${qs}` : ""}`);
}

async function getRandomWords(count, level) {
  const promises = Array.from({ length: count }, () => getRandomWord(level));
  const results = await Promise.all(promises);
  return results.map((r) => r.word);
}

async function translateToKorean(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ko`;
  const res = await fetch(url);
  if (!res.ok) return text;
  const data = await res.json();
  return data?.responseData?.translatedText || text;
}

module.exports = { getRandomWord, getWords, getRandomWords, translateToKorean };
