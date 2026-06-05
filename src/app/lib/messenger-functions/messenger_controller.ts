// This is the messenger component 4.
// It works as a controller that receives a user message, checks keyword results,
// and returns the correct response format for the chatbot.

type KeywordCombo = {
  id: string;
  fk_keyword1: string;
  fk_keyword2: string;
  type: "api" | "link";
  result: string;
  api_key?: string | null;
  word: string;
  created_at: string;
};

export function messengerResponse(message: string) {
  let response = "";

  // Placeholder for Component 2 output.
  // Later, this should come from the keyword parsing function:
  // const keywords = Component2(message)
  const keywords = [
    "eb1f1d5d-ab13-4888-aaec-e63bafafbe90",
    "3c600a65-102b-4ea8-aca1-827f2e4804d7",
  ];

  // Placeholder for Component 3 output.
  // Later, this should come from the keyword combination lookup:
  // const keywordCombo = Component3(keywords)
  const keywordCombo: KeywordCombo = {
    id: "3ed23766-49e3-4ac1-a164-8bdf35facb2c",
    fk_keyword1: keywords[0],
    fk_keyword2: keywords[1],
    type: "api",
    result: "testApi",
    api_key: "v9p8C8r4mLO73rj5RLn0hRROIGYMpyVBlXhL335n",
    word: "url",
    created_at: "2026-06-04 00:09:59.947916+00",
  };

  if (keywordCombo.type === "api") {
    const apiUrl = keywordCombo.api_key
      ? `${keywordCombo.result}?api_key=${keywordCombo.api_key}`
      : keywordCombo.result;

    response = JSON.stringify({
      type: "photo",
      word: keywordCombo.word,
      api: apiUrl,
    });
  }

  if (keywordCombo.type === "link") {
    response = JSON.stringify({
      type: "link",
      word: keywordCombo.word,
      url: keywordCombo.result,
    });
  }

  if (!response) {
    response = JSON.stringify({
      type: "error",
      message: "I can't help you with your issue.",
    });
  }

  return response;
}