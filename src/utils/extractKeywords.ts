export function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "you",
    "this",
    "that",
    "from",
    "will",
    "must",
    "should",
    "have",
    "job",
    "role",
    "your",
    "are",
    "as",
    "an",
    "a",
    "to",
    "in",
    "on",
    "we",
    "be",
    "is",
    "of",
    "at",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !commonWords.has(w));

  return [...new Set(words)].slice(0, 30);
}
