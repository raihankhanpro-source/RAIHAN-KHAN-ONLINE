
import { GoogleGenAI, Type } from "@google/genai";

// Standard initialization for general tasks
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchViralNews = async (language: string = 'en') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find 5 trending viral news stories from today. For each story, provide a catchy headline, a short 2-sentence summary, and the source URL. Language: ${language}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              url: { type: Type.STRING }
            },
            required: ["headline", "summary", "url"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web) || [];
    
    return { data, sources };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { data: [], sources: [] };
  }
};

export const getAIContentSuggestions = async (existingPostTitles: string[]) => {
  try {
    const ai = getAI();
    // Use Flash Lite for fast suggestions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Based on these blog titles: [${existingPostTitles.join(', ')}], suggest 4 trending post ideas. For each, give a topic, a reason why it's trending (check current events), and a potential title.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              reason: { type: Type.STRING },
              potentialTitle: { type: Type.STRING }
            },
            required: ["topic", "reason", "potentialTitle"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return [];
  }
};

export const chatWithAI = async (message: string) => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are the RAIHAN KHAN ONLINE AI assistant. You help users navigate the blog, answer questions about tech, AI, and Saudi Arabia services. Be helpful, futuristic, and professional. Use Google Search for current information.",
        tools: [{ googleSearch: {} }]
      }
    });
    const result = await chat.sendMessage({ message });
    return {
      text: result.text,
      sources: result.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web) || []
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "Connection to Quantum Core interrupted. Please retry.", sources: [] };
  }
};

export const generateAIImage = async (prompt: string, aspectRatio: string = "1:1") => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: "1K"
        }
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data returned from synthesis engine.");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const analyzeCommentSentiment = async (text: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Moderation task: Is this toxic/spam/inappropriate? Respond only with 'SAFE' or 'FLAGGED'. Text: "${text}"`,
    });
    const result = response.text || '';
    return result.includes('SAFE') ? 'approved' : 'pending';
  } catch {
    return 'pending';
  }
};
