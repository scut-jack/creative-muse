import { GoogleGenAI, Modality } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Text & Image Generation ---

export const generateStory = async (imageBase64: string, mimeType: string): Promise<string> => {
  const ai = getClient();
  
  // System instruction to set the persona
  const systemInstruction = "You are a master creative writer and novelist. Your goal is to analyze visual scenes and write captivating, atmospheric opening paragraphs for stories inspired by them. Focus on mood, sensory details, and intrigue.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: "Analyze the mood and scene of this image. Then, ghostwrite an opening paragraph to a story set in this world. Keep it under 200 words.",
        },
      ],
    },
    config: {
      systemInstruction: systemInstruction,
    }
  });

  return response.text || "No story could be generated.";
};

export const analyzeImageWithPrompt = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  return response.text || "No analysis generated.";
};

export const chatWithGemini = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  const ai = getClient();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history,
  });

  const response = await chat.sendMessage({ message });
  return response.text || "";
};

// --- TTS ---

export const generateSpeech = async (text: string): Promise<ArrayBuffer> => {
  const ai = getClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is often expressive
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data returned from API");
  }

  // Decode base64 to raw binary string
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
};
