import type { Combination, Keyword } from "../../admin/bot-config";
import type { KeywordDictionary, MatchedKeyword } from "./keyword-dictionary";
import { lookupKeywordsInMessage } from "./message-keyword-lookup";
import { findFirstCombination } from "./combo-iteration";
import {
  buildCombinationResponse,
  type ChatAttachment,
  type BotLink,
} from "./combination-response";
import { formatDebugBlock } from "./chat-debug";
import { createChatMessageId } from "./message-id";

export type ChatMessage = {
  id: number;
  text: string;
  isUser: boolean;
  links?: BotLink[];
  attachments?: ChatAttachment[];
};

export type ProcessMessageResult = {
  message: ChatMessage;
};

export async function processUserMessage(
  userMessage: string,
  keywords: Keyword[],
  combinations: Combination[],
  dictionary: KeywordDictionary,
  fallback: string,
): Promise<ProcessMessageResult> {
  const { matches, debugLines } = lookupKeywordsInMessage(
    userMessage,
    keywords,
    dictionary,
  );

  const debugBlock = formatDebugBlock(debugLines);

  if (matches.length >= 2) {
    const combination = findFirstCombination(matches, combinations);
    if (combination) {
      const response = await buildCombinationResponse(combination);
      return {
        message: {
          id: createChatMessageId(),
          text: debugBlock + response.text,
          isUser: false,
          links: response.links,
          attachments: response.attachments,
        },
      };
    }

    const names = matches.map((m) => m.canonical).join(" and ");
    return {
      message: {
        id: createChatMessageId(),
        text: `${debugBlock}I recognize ${names}, but I don't have a ready-made answer for that combination yet. Try asking about the daily photo or today's article.`,
        isUser: false,
      },
    };
  }

  if (matches.length === 1) {
    return {
      message: {
        id: createChatMessageId(),
        text: buildSingleKeywordReply(debugBlock, matches[0], combinations),
        isUser: false,
      },
    };
  }

  return {
    message: {
      id: createChatMessageId(),
      text:
        debugBlock ||
        fallback ||
        "I can't help with that yet. Try asking about the daily space photo or today's article.",
      isUser: false,
    },
  };
}

function buildSingleKeywordReply(
  debugBlock: string,
  matched: MatchedKeyword,
  combinations: Combination[],
): string {
  const partners = combinations
    .filter(
      (c) => c.fk_keyword1 === matched.id || c.fk_keyword2 === matched.id,
    )
    .map((c) =>
      c.fk_keyword1 === matched.id ? c.keyword2 : c.keyword1,
    );

  const suggestion = partners.length
    ? ` Try adding another topic, such as ${partners.slice(0, 3).join(" or ")}.`
    : " Try adding another space topic to your question.";

  return `${debugBlock}I noticed you're asking about "${matched.canonical}". I need one more related topic to find something for you.${suggestion}`;
}
