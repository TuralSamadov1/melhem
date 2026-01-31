
import { GoogleGenAI, Type } from "@google/genai";
import { ClinicalCase } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSocialContent = async (clinicalCase: ClinicalCase) => {
  const prompt = `
    Aşağıdakı tibbi keys məlumatlarına əsasən Instagram üçün 3 fərqli kontent formatı hazırla: 
    1. Instagram Post (uzun və maraqlı mətn, hashtaglarla birgə)
    2. Reels Ssenarisi (vizual və səs təlimatları daxil olmaqla)
    3. Story Mətni (qısa, cəlbedici).
    
    Keys Məlumatları:
    Başlıq: ${clinicalCase.title}
    Problem: ${clinicalCase.patientProblem}
    Müalicə: ${clinicalCase.treatmentProcess}
    Nəticə: ${clinicalCase.result}
    Ton: ${clinicalCase.tone}
    Həkim: ${clinicalCase.doctorName}
    
    Xahiş edirəm cavabı JSON formatında qaytar.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          instagramPost: { type: Type.STRING },
          reelsScript: { type: Type.STRING },
          storyText: { type: Type.STRING },
        },
        required: ["instagramPost", "reelsScript", "storyText"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};
