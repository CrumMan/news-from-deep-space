export type BotLink = {
  text: string;
  url: string;
};

export type Keyword = {
  id: string;
  keyword: string;
  response: string;
  links: BotLink[];
};

export type Combination = {
  id: string;
  words: string[];
  response: string;
  links: BotLink[];
};

export const KEYWORDS_STORAGE_KEY = "bot.keywords";
export const COMBINATIONS_STORAGE_KEY = "bot.combinations";
export const FALLBACK_STORAGE_KEY = "bot.fallback";

export const DEFAULT_FALLBACK =
  "I can't help you with your issue.";

export const defaultKeywords: Keyword[] = [
  {
    id: "k-photos",
    keyword: "photo",
    response: "Here are the most recent space photos.",
    links: [
      { text: "View Recent Photos", url: "/recent-photos" },
      { text: "Daily Space Photo", url: "/" },
    ],
  },
  {
    id: "k-articles",
    keyword: "article",
    response: "Check out the latest space articles.",
    links: [
      { text: "Recent Articles", url: "/recent-articles" },
      { text: "Featured Article", url: "/article/1" },
    ],
  },
  {
    id: "k-mars",
    keyword: "mars",
    response: "Here is some information about Mars.",
    links: [
      { text: "Mars Photos", url: "/search?q=mars" },
      { text: "NASA Mars Mission", url: "https://mars.nasa.gov/" },
    ],
  },
  {
    id: "k-login",
    keyword: "login",
    response: "You can sign in to your account here.",
    links: [{ text: "Go to Login Page", url: "/login" }],
  },
];

export const defaultCombinations: Combination[] = [
  {
    id: "c-recent-photo",
    words: ["recent", "photo"],
    response: "Here are the most recent space photos from NASA.",
    links: [{ text: "View Recent Photos", url: "/recent-photos" }],
  },
  {
    id: "c-mars-rover",
    words: ["mars", "rover"],
    response: "Here is the latest from the Mars rover.",
    links: [
      { text: "Mars Rover Updates", url: "/search?q=mars+rover" },
      { text: "NASA Mars Mission", url: "https://mars.nasa.gov/" },
    ],
  },
];

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadKeywords(): Keyword[] {
  return readJSON<Keyword[]>(KEYWORDS_STORAGE_KEY, defaultKeywords);
}

export function saveKeywords(items: Keyword[]): void {
  writeJSON(KEYWORDS_STORAGE_KEY, items);
}

export function loadCombinations(): Combination[] {
  return readJSON<Combination[]>(
    COMBINATIONS_STORAGE_KEY,
    defaultCombinations,
  );
}

export function saveCombinations(items: Combination[]): void {
  writeJSON(COMBINATIONS_STORAGE_KEY, items);
}

export function loadFallback(): string {
  return readJSON<string>(FALLBACK_STORAGE_KEY, DEFAULT_FALLBACK);
}

export function saveFallback(value: string): void {
  writeJSON(FALLBACK_STORAGE_KEY, value);
}

export function newId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${random}`;
}
