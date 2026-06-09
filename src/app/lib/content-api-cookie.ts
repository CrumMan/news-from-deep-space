export type ContentApiKind = "article" | "photo" | "api";

export type ContentApiCookie = {
  url: string;
  kind: ContentApiKind;
};

export const CONTENT_API_COOKIE = "nfds_content_api";
export const DEFAULT_ARTICLE_API = "/api/articles";
export const DEFAULT_PHOTO_API = "/api/apod";

const MAX_AGE_DAYS = 7;

export function setContentApiCookie(url: string, kind: ContentApiKind): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify({ url, kind }));
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${CONTENT_API_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getContentApiCookie(): ContentApiCookie | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONTENT_API_COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))) as ContentApiCookie;
  } catch {
    return null;
  }
}

export function getContentApiUrl(fallbackKind: ContentApiKind): string {
  const stored = getContentApiCookie();
  if (stored?.url) return stored.url;
  return fallbackKind === "photo" ? DEFAULT_PHOTO_API : DEFAULT_ARTICLE_API;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export async function fetchContentApi<T>(
  kind: ContentApiKind,
  suffix = "",
  query?: Record<string, string>,
): Promise<T> {
  const base = getContentApiUrl(kind).replace(/\/$/, "");
  const qs =
    query && Object.keys(query).length
      ? `?${new URLSearchParams(query).toString()}`
      : "";

  let url = suffix ? `${base}/${suffix}${qs}` : `${base}${qs}`;

  if (base.startsWith("http://") || base.startsWith("https://")) {
    if (suffix) {
      url = `${base.replace(/\/$/, "")}/${suffix}${qs}`;
    } else {
      url = `${base}${qs}`;
    }
    return fetchJson<T>(`/api/proxy?url=${encodeURIComponent(url)}`);
  }

  return fetchJson<T>(url);
}

export function apiUrlForPath(path: string, apiUrl: string): { url: string; kind: ContentApiKind } {
  if (path.startsWith("/photo") || path.includes("/photo/")) {
    return { url: DEFAULT_PHOTO_API, kind: "photo" };
  }
  if (path.startsWith("/article") || path.includes("/article/")) {
    return { url: DEFAULT_ARTICLE_API, kind: "article" };
  }
  if (/^https?:\/\//i.test(apiUrl)) {
    return { url: apiUrl, kind: "api" };
  }
  return { url: apiUrl, kind: "article" };
}
