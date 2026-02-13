
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectBreedFromPhoto = async (base64Image: string): Promise<string> => {
  const ai = getAI();
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1] || base64Image,
    },
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        imagePart,
        { text: "Zidentyfikuj rasę psa na tym zdjęciu. Odpowiedz tylko nazwą rasy po polsku." }
      ]
    },
  });

  return response.text?.trim() || "Nieznana rasa";
};

export const getVaccinationAdvice = async (breed: string, ageInMonths: number): Promise<string[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Dla psa rasy ${breed} w wieku ${ageInMonths} miesięcy, podaj listę zalecanych szczepień w formie JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["recommendations"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data.recommendations || [];
  } catch (e) {
    return ["Wścieklizna", "Parwowiroza", "Nosacizna"];
  }
};
