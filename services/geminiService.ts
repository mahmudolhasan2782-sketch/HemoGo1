import { GoogleGenAI } from "@google/genai";

export const generateTransformation = async (
  imageBase64: string,
  promptSuffix: string
): Promise<string> => {
  try {
    // Initialize AI client inside the function to ensure it uses the latest API Key
    // This supports both Vercel Environment Variables and dynamic injection in AI Studio
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    
    // Construct a strong prompt to preserve facial fidelity while changing style
    const fullPrompt = `Transform this person to be ${promptSuffix}. 
    CRITICAL: Preserve the original facial features, identity, skin tone, and expression exactly. 
    Only change the clothing, background, and overall artistic style. 
    High quality, photorealistic, 8k. Return the image only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Upgraded to Pro model for better quality
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity
              data: cleanBase64,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Default square for consistency with thumbnails
          imageSize: "1K"
        }
      }
    });

    // Check for image in the response
    let generatedImage = '';
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImage = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImage) {
      throw new Error("No image generated from API");
    }

    return generatedImage;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const suggestThumbnailTitles = async (topic: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 catchy YouTube thumbnail titles in Bengali for a video about: ${topic}. Return as a JSON array of strings.`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const text = response.text;
    if (!text) return ["আকর্ষণীয় থাম্বনেইল", "ভাইরাল ভিডিও", "নতুন ডিজাইন"];
    
    return JSON.parse(text);
  } catch (e) {
    return ["আকর্ষণীয় স্টাইল", "সেরা লুক", "নতুন ডিজাইন"];
  }
}