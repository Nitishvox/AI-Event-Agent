// Fix: Implement the service to fetch feature recommendations using the Gemini API.
// This resolves multiple 'Cannot find name' errors and the module resolution error in InnovationHub.tsx.
import { GoogleGenAI, Type } from "@google/genai";
import type { Recommendation } from "../types";

// Access the API key from Vite's environment variables
const apiKey = import.meta.env.VITE_API_KEY;

// Ensure the API key is available in the environment variables, consistent with other services.
if (!apiKey) {
  throw new Error("VITE_API_KEY environment variable is not set in your .env file.");
}

const ai = new GoogleGenAI({ apiKey });

// Define the JSON schema for the AI's response to ensure structured output.
const recommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A short, catchy title for the innovative feature.",
      },
      description: {
        type: Type.STRING,
        description: "A brief explanation of the feature and its benefits for the event.",
      },
      icon: {
        type: Type.STRING,
        description: "The category of the feature. Must be one of: 'Tech', 'Experience', or 'Engagement'.",
      },
    },
    required: ["title", "description", "icon"],
  },
};

export const getFeatureRecommendations = async (
  planContext: string
): Promise<Recommendation[]> => {
  try {
    const prompt = `You are an AI innovation strategist for events. Based on the following event plan, suggest exactly 3 unique and cutting-edge features to enhance it. For each feature, provide a title, a brief description, and categorize it with an icon type. The icon type must be one of 'Tech', 'Experience', or 'Engagement'.

Event Plan:
---
${planContext}
---

Provide your response as a JSON array of objects, adhering to the specified schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
      },
    });

    // Fix: Guard against undefined/null response text before parsing.
    const jsonString = (response.text ?? '[]').trim();
    if (!jsonString) {
      return []; // Return empty if the response is empty after trim
    }

    const recommendations = JSON.parse(jsonString) as Recommendation[];

    if (!Array.isArray(recommendations)) {
      throw new Error("AI response is not a valid array.");
    }

    return recommendations;

  } catch (error) {
    console.error("Error generating feature recommendations:", error);
    throw new Error("Failed to get innovative features from the AI. Please try again later.");
  }
};