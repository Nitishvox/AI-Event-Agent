import { GoogleGenAI } from "@google/genai";
import type { Stage } from "../types";

// Access the API key from Vite's environment variables
const apiKey = import.meta.env.VITE_API_KEY;

// Ensure the API key is available
if (!apiKey) {
  throw new Error("VITE_API_KEY environment variable is not set in your .env file.");
}

const ai = new GoogleGenAI({ apiKey });

export const generatePlanForStage = async (
  eventIdea: string,
  stage: Stage,
  context: string
): Promise<string> => {
  try {
    const prompt = stage.prompt(eventIdea, context);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Fix: Ensure a string is always returned, even if the API response is empty.
    return response.text ?? '';
  } catch (error) {
    console.error(`Error generating plan for stage "${stage.title}":`, error);
    throw new Error(`Failed to get a response from the AI for the ${stage.title} stage.`);
  }

};