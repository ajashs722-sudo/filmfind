import { GoogleGenAI } from "@google/genai";

async function findMovieImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Find the TMDB poster_path and backdrop_path for movie IDs 1115544 and 1207162. Return only the paths in JSON format.",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  console.log(response.text);
}

findMovieImages();
