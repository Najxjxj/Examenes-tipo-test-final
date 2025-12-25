
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType, FileData, Difficulty, ContentLength } from "../types";

export const generateQuestions = async (
  file: FileData, 
  numQuestions: number, 
  type: QuestionType,
  difficulty: Difficulty = Difficulty.MEDIUM,
  length: ContentLength = ContentLength.MEDIUM,
  referenceText?: string
): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  
  // Lógica de parámetros
  const diffInstructions = {
    [Difficulty.EASY]: "Preguntas directas, definiciones claras y distractores obviamente incorrectos.",
    [Difficulty.MEDIUM]: "Preguntas conceptuales que requieren entender la relación entre temas. Distractores plausibles.",
    [Difficulty.HARD]: "Casos prácticos complejos, dilemas legales o técnicos. Distractores muy similares entre sí que requieren precisión absoluta."
  };

  const lengthInstructions = {
    [ContentLength.SHORT]: "Preguntas breves (1 frase) y explicaciones concisas (30 palabras).",
    [ContentLength.MEDIUM]: "Preguntas desarrolladas y explicaciones detalladas (60-80 palabras).",
    [ContentLength.LONG]: "Preguntas extensas con mucho contexto (casos de estudio) y explicaciones exhaustivas (120+ palabras)."
  };

  let systemInstruction = `ERES EL MOTOR DE MIMETISMO ACADÉMICO "STUDYGEN V4.0".
Tu prioridad absoluta es IMITAR EL ESTILO, TONO Y COMPLEJIDAD de los ejemplos proporcionados por el usuario.

DIRECTRICES DE CALIDAD:
- DIFICULTAD (${difficulty}): ${diffInstructions[difficulty]}
- LONGITUD (${length}): ${lengthInstructions[length]}
- MIMETISMO: Si el usuario manda ejemplos de derecho, usa terminología latina y estructura de sentencias. Si es ingeniería, usa rigor matemático.

REGLAS TÉCNICAS:
1. 'correctAnswer' debe ser EXACTAMENTE igual a una de las opciones.
2. No uses prefijos como "A)", "B)" en las opciones.
3. El feedback debe ser un párrafo fluido que explique el 'por qué' técnico de la respuesta.`;

  if (referenceText && referenceText.trim().length > 0) {
    systemInstruction += `\n\nESTÁNDAR DE ORO (MIMETIZA ESTO): "${referenceText}"`;
  }

  const prompt = `Analiza el documento y genera EXACTAMENTE ${numQuestions} preguntas de tipo ${type}.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: `${systemInstruction}\n\n${prompt}` },
        { inlineData: { mimeType: file.mimeType || 'application/pdf', data: file.base64Data!.split(',')[1] } }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["id", "text", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    const textOutput = response.text;
    if (!textOutput) return [];
    const parsed = JSON.parse(textOutput);
    return parsed.map((q: any, i: number) => ({
      ...q,
      id: q.id || `q-${Date.now()}-${i}`,
      type: type,
      visualPrompt: "academic scenario"
    }));
  } catch (error) {
    console.error("Error en la IA:", error);
    return [];
  }
};

export const generateTopicImage = async (topic: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional 3D isometric icon representing ${topic}, dark blue background, cinematic lighting.` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return '';
  } catch (error) {
    return '';
  }
};
