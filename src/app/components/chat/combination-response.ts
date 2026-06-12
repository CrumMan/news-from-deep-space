import type { Combination } from "../../admin/bot-config";
import {
  DEFAULT_PHOTO_API,
  apiUrlForPath,
  setContentApiCookie,
} from "../../lib/content-api-cookie";
import {
  combinationLabel,
  combinationTarget,
  isApiLikeComboType,
  isApodResult,
} from "./combo-iteration";

export type BotLink = {
  text: string;
  url: string;
};

export type ChatAttachment = {
  type: "image" | "link";
  imageUrl?: string;
  alt?: string;
  linkText?: string;
  href: string;
};

export type CombinationResponse = {
  text: string;
  links: BotLink[];
  attachments: ChatAttachment[];
};

type ApodPayload = {
  date: string;
  title: string;
  url: string;
  hdurl?: string;
  media_type: string;
};

type ArticlePayload = {
  id: string;
  title: string;
  summary: string;
  image_url: string | null;
};

async function buildApodChatResponse(
  label: string,
  successLine: string,
): Promise<CombinationResponse> {
  setContentApiCookie(DEFAULT_PHOTO_API, "photo");

  try {
    const res = await fetch("/api/apod");
    if (res.ok) {
      const apod = (await res.json()) as ApodPayload;
      const photoPath = `/photo/${apod.date}`;
      const imageUrl =
        apod.media_type === "image" ? apod.hdurl || apod.url : undefined;

      return {
        text: successLine,
        links: [{ text: apod.title || label, url: photoPath }],
        attachments: [
          {
            type: "image",
            imageUrl,
            alt: apod.title,
            href: photoPath,
            linkText: `View ${apod.title}`,
          },
        ],
      };
    }
    console.error("APOD fetch failed", res.status);
  } catch (err) {
    console.error("APOD fetch failed", err);
  }

  return {
    text: `I couldn't load today's photo right now. You can still browse recent pictures below.`,
    links: [{ text: "Recent space photos", url: "/recent-photos" }],
    attachments: [
      {
        type: "link",
        linkText: "Browse recent space photos",
        href: "/recent-photos",
      },
    ],
  };
}

function resolveFetchUrl(combination: Combination): string {
  if (isApodResult(combination.result)) {
    return "/api/apod";
  }

  const target = combinationTarget(combination);
  if (target.startsWith("/api/")) {
    return target;
  }
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return `/api/proxy?url=${encodeURIComponent(target)}`;
  }
  return target;
}

function isArticleEndpoint(url: string): boolean {
  return url.includes("/api/articles") || url.includes("/article");
}

function isDirectImageUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)$/.test(pathname);
  } catch {
    return /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?|$)/i.test(url);
  }
}

function buildImageAttachment(
  href: string,
  label: string,
  alt?: string,
): ChatAttachment {
  return {
    type: "image",
    imageUrl: href,
    alt: alt ?? label,
    href,
    linkText: `View ${label}`,
  };
}

function isValidFetchTarget(result: string): boolean {
  if (!result.trim() || result.trim().toLowerCase() === "apiurl") return false;
  if (isApodResult(result)) return true;
  if (result.startsWith("/")) return true;
  return /^https?:\/\//i.test(result);
}

function userFacingIntro(combination: Combination): string {
  const label = combinationLabel(combination);
  if (isApodResult(combination.result)) {
    return `Here's today's astronomy picture for ${label}:`;
  }
  if (isDirectImageUrl(combination.result)) {
    return `Here's a space image for ${label}:`;
  }
  if (
    combination.type === "link" ||
    isArticleEndpoint(combination.result)
  ) {
    return `Here's a space article for ${label}:`;
  }
  if (isApiLikeComboType(combination.type)) {
    return `Here's live space data for ${label}:`;
  }
  return `Here's what I found for ${label}:`;
}

/** Component 4: fetch API or build link for chat display */
export async function buildCombinationResponse(
  combination: Combination,
): Promise<CombinationResponse> {
  const label = combinationLabel(combination);
  const intro = userFacingIntro(combination);

  if (!isValidFetchTarget(combination.result)) {
    return {
      text: `I matched ${label}, but that content isn't configured yet. An admin can set a valid link or API URL in the dashboard.`,
      links: [],
      attachments: [],
    };
  }

  if (isApodResult(combination.result)) {
    return buildApodChatResponse(label, intro);
  }

  if (combination.type === "link" && !isApiLikeComboType(combination.type)) {
    const href = combination.result;

    let linkText = `Open ${label}`;
    let previewImage: string | undefined;

    if (isArticleEndpoint(href)) {
      setContentApiCookie("/api/articles", "article");
      try {
        const res = await fetch("/api/articles?limit=1");
        if (res.ok) {
          const data = (await res.json()) as { daily: ArticlePayload | null };
          const daily = data.daily;
          if (daily) {
            linkText = daily.title;
            previewImage = daily.image_url ?? undefined;
            const articlePath = `/article/${daily.id}`;
            return {
              text: intro,
              links: [{ text: linkText, url: articlePath }],
              attachments: [
                {
                  type: "link",
                  linkText: `Read today's article: ${daily.title}`,
                  href: articlePath,
                  imageUrl: previewImage,
                },
              ],
            };
          }
        }
      } catch {
        /* fall through */
      }
      const articlePath = "/article";
      return {
        text: intro,
        links: [{ text: "Today's featured article", url: articlePath }],
        attachments: [
          {
            type: "link",
            linkText: "Read today's featured article",
            href: articlePath,
            imageUrl: previewImage,
          },
        ],
      };
    }

    if (href.startsWith("/")) {
      return {
        text: intro,
        links: [{ text: linkText, url: href }],
        attachments: [{ type: "link", linkText, href, imageUrl: previewImage }],
      };
    }

    if (isDirectImageUrl(href)) {
      return {
        text: intro,
        links: [{ text: linkText, url: href }],
        attachments: [buildImageAttachment(href, label)],
      };
    }

    return {
      text: intro,
      links: [{ text: linkText, url: href }],
      attachments: [
        {
          type: "link",
          linkText: linkText,
          href: href,
          imageUrl: previewImage,
        },
      ],
    };
  }

  const fetchUrl = resolveFetchUrl(combination);

  try {
    const res = await fetch(fetchUrl);
    if (res.ok) {
      const data = (await res.json()) as ApodPayload & ArticlePayload;

      if (data.id && data.title) {
        const articlePath = `/article/${data.id}`;
        setContentApiCookie("/api/articles", "article");
        return {
          text: intro,
          links: [{ text: data.title, url: articlePath }],
          attachments: [
            {
              type: "link",
              linkText: data.title,
              href: articlePath,
              imageUrl: data.image_url ?? undefined,
            },
          ],
        };
      }
    }
  } catch (err) {
    console.error("Combination API fetch failed", err);
  }

  const fallbackHref = combination.result.startsWith("/")
    ? combination.result
    : "/";

  return {
    text: `I matched ${label}, but I couldn't load the preview right now. Please try again in a moment.`,
    links: fallbackHref !== "/" ? [{ text: `Open ${label}`, url: fallbackHref }] : [],
    attachments:
      fallbackHref !== "/"
        ? [
            {
              type: "link",
              linkText: `Open ${label}`,
              href: fallbackHref,
            },
          ]
        : [],
  };
}

export function saveLinkCookie(url: string) {
  if (/^https?:\/\//i.test(url)) {
    if (url.includes("api.nasa.gov/planetary/apod")) {
      setContentApiCookie(DEFAULT_PHOTO_API, "photo");
      return;
    }
    setContentApiCookie(url, "api");
    return;
  }
  const { url: apiUrl, kind } = apiUrlForPath(url, url);
  setContentApiCookie(apiUrl, kind);
}
