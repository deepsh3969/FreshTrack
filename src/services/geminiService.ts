/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in your environment.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export interface ImageAnalysisResult {
  freshness: 'fresh' | 'risky' | 'stale';
  confidence: number;
  reasoning: string;
  colorAnalysis: string;
  textureAnalysis: string;
  isVeg: boolean;
}

export async function analyzeFoodImage(base64Image: string, mimeType: string = "image/jpeg"): Promise<ImageAnalysisResult> {
  try {
    const aiClient = getAI();
    const response = await aiClient.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Analyze this food image for freshness and dietary type. 
            Identify the color and texture. 
            Determine if the food is vegetarian (isVeg: true) or non-vegetarian (isVeg: false).
            Provide a freshness status (fresh, risky, or stale) and reasoning.
            Return the result in JSON format with the following schema:
            {
              "freshness": "fresh" | "risky" | "stale",
              "confidence": number (0-1),
              "reasoning": string,
              "colorAnalysis": string,
              "textureAnalysis": string,
              "isVeg": boolean
            }`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response text received from the AI model. This might be due to safety filters or an empty response.");
    }

    const result = JSON.parse(response.text);
    return result as ImageAnalysisResult;
  } catch (error: any) {
    console.error("Detailed Error analyzing food image:", error);
    
    // Check for specific API errors
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please check your Gemini API key configuration.");
    }
    
    throw new Error(error.message || "Failed to analyze image. Please try again.");
  }
}
