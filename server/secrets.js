
if (!process.env.GOODREADS_KEY) {
  throw new Error("Missing goodreads API key");
}

export const apiKey = process.env.GOODREADS_KEY;