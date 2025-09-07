import { GoogleGenAI } from "@google/genai";
import type { Stage } from "../types";

// Access the API key from environment variables
const API_KEY = import.meta.env.VITE_API_KEY;

// Ensure the API key is available
if (!API_KEY) {
  throw new Error("VITE_API_KEY is not set in your .env file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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

    return response.text ?? '';
  } catch (error) {
    console.error(`Error generating plan for stage "${stage.title}":`, error);
    if (error instanceof Error) {
      // Make the error more specific for easier debugging in the UI
      throw new Error(`AI error during "${stage.title}": ${error.message}`);
    }
    throw new Error(`Failed to get a response from the AI for the ${stage.title} stage.`);
  }
};