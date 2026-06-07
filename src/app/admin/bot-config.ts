export type Keyword = {
  id: string;
  keyword: string;
  synonyms: string[];
  created_at?: string;
};

export type CombinationType = "photo" | "link";

export type Combination = {
  id: string;
  fk_keyword1: string;
  fk_keyword2: string;
  keyword1: string;
  keyword2: string;
  type: CombinationType;
  result: string;
  api_key: string | null;
  created_at?: string;
};

export type apiBuild = {
  id: string;
  type: string;
  subtitle:string | null;
  title:string | null;
  text:string|null;
  imageLinkWord:string|null;
  result: string;
  created_at?: string;
};

export type Account = {
  id: string;
  username: string;
  email:string;
  streak: number;
  isAdmin: boolean;
};

export const FALLBACK_STORAGE_KEY = "bot.fallback";
export const DEFAULT_FALLBACK = "I can't help you with your issue.";
export const TOKEN_STORAGE_KEY = "authToken";
export const ACCOUNT_STORAGE_KEY = "account";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getCurrentAccount(): Account | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Account;
  } catch {
    return null;
  }
}

export function saveSession(token: string, account: Account): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  window.localStorage.setItem("isLoggedIn", "true");
  window.localStorage.setItem("username", account.username);
  window.localStorage.setItem("email", account.email);
  window.dispatchEvent(new Event("authChange"));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  window.localStorage.removeItem("isLoggedIn");
  window.localStorage.removeItem("username");
  window.localStorage.removeItem("email");
  window.dispatchEvent(new Event("authChange"));
}

type FetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? safeParse(text) : null;

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && typeof data.error === "string")
        ? data.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function fetchKeywords(): Promise<Keyword[]> {
  const data = await apiFetch<{ keywords: Keyword[] }>("/api/keywords");
  return data.keywords;
}

export async function createKeyword(input: {
  keyword: string;
  synonyms: string[];
}): Promise<Keyword> {
  return apiFetch<Keyword>("/api/keywords", { method: "POST", body: input });
}

export async function updateKeyword(
  id: string,
  input: { keyword?: string; synonyms?: string[] },
): Promise<Keyword> {
  return apiFetch<Keyword>(`/api/keywords/${id}`, { method: "PUT", body: input });
}

export async function deleteKeyword(id: string): Promise<void> {
  await apiFetch(`/api/keywords/${id}`, { method: "DELETE" });
}

export async function fetchCombinations(): Promise<Combination[]> {
  const data = await apiFetch<{ combinations: Combination[] }>("/api/combinations");
  return data.combinations;
}

export async function createCombination(input: {
  keywordId1: string;
  keywordId2: string;
  type: CombinationType;
  result: string;
  apiKey?: string | null;
}): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/api/combinations", {
    method: "POST",
    body: input,
  });
}

export async function updateCombination(
  id: string,
  input: { type?: CombinationType; result?: string; apiKey?: string | null },
): Promise<void> {
  await apiFetch(`/api/combinations/${id}`, { method: "PUT", body: input });
}

export async function deleteCombination(id: string): Promise<void> {
  await apiFetch(`/api/combinations/${id}`, { method: "DELETE" });
}

export async function deleteCombinationsByKeyword(
  keywordId: string,
): Promise<{ deleted: number }> {
  return apiFetch<{ deleted: number }>(
    `/api/combinations/by-keyword/${keywordId}`,
    { method: "DELETE" },
  );
}

export async function updateApi_details(
  id:string,
  input: {  type?: CombinationType;  title: string;  imageLinkWord?: string | null;  subtitle?: string | null;  text?: string | null; }): Promise<void>{
    await apiFetch(`api/apiBuild/${id}`,{method:"PUT", body: input})
  }

  export function getApibyId(id:string){
    return apiFetch(`api/apiBuild/${id}`, {method:"GET"})
  }

export function loadFallback(): string {
  if (typeof window === "undefined") return DEFAULT_FALLBACK;
  return window.localStorage.getItem(FALLBACK_STORAGE_KEY) ?? DEFAULT_FALLBACK;
}

export function saveFallback(value: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FALLBACK_STORAGE_KEY, value);
}

