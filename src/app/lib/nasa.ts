export function getNasaApiKey(): string {
  return process.env.NASA_API_KEY?.trim() || "DEMO_KEY";
}

export type ApodPhoto = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
};

export function nasaApodUrl(params: { date?: string; startDate?: string; endDate?: string }): string {
  const key = getNasaApiKey();
  const url = new URL("https://api.nasa.gov/planetary/apod");
  url.searchParams.set("api_key", key);
  if (params.date) url.searchParams.set("date", params.date);
  if (params.startDate) url.searchParams.set("start_date", params.startDate);
  if (params.endDate) url.searchParams.set("end_date", params.endDate);
  return url.toString();
}
