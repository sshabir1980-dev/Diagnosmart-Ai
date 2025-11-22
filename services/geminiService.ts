
import { GoogleGenAI, Type } from "@google/genai";
import { ReportAnalysis } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    patientName: { type: Type.STRING, description: "Name of patient if found, else 'Unknown'" },
    reportDate: { type: Type.STRING, description: "Date of report if found" },
    testType: { type: Type.STRING, description: "Type of test (e.g., CBC, Lipid Profile, X-Ray)" },
    overallResult: { type: Type.STRING, enum: ["Normal", "Abnormal"] },
    riskLevel: { type: Type.STRING, enum: ["Safe", "Moderate", "Critical"] },
    healthScore: { type: Type.NUMBER, description: "Calculated health score from 0 (Critical) to 100 (Perfect)" },
    summary_en: { type: Type.STRING, description: "Comprehensive summary in English" },
    summary_hi: { type: Type.STRING, description: "Detailed comprehensive summary in Hindi language" },
    possibleDiagnosis: { type: Type.STRING, description: "Most likely disease or condition in English. If normal, state 'Healthy'" },
    possibleDiagnosis_hi: { type: Type.STRING, description: "Most likely disease or condition translated to Hindi. If normal, state 'स्वस्थ'" },
    advice_en: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of advice/precautions in English" 
    },
    advice_hi: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of advice/precautions in Hindi" 
    },
    requiredSpecialist: { type: Type.STRING, description: "The type of doctor needed in English (e.g., Cardiologist)" },
    requiredSpecialist_hi: { type: Type.STRING, description: "The type of doctor needed in Hindi (e.g., हृदय रोग विशेषज्ञ)" },
    parameters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          value: { type: Type.STRING },
          unit: { type: Type.STRING },
          referenceRange: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Normal", "Low", "High", "Critical"] },
          interpretation: { type: Type.STRING, description: "Brief medical meaning of this specific result in English" },
          interpretation_hi: { type: Type.STRING, description: "Brief medical meaning of this specific result in Hindi" }
        },
        required: ["name", "value", "status"]
      }
    }
  },
  required: ["testType", "overallResult", "riskLevel", "healthScore", "summary_en", "summary_hi", "parameters", "requiredSpecialist", "possibleDiagnosis"]
};

export const analyzeReportImage = async (base64Image: string, mimeType: string): Promise<ReportAnalysis> => {
  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
      You are an expert AI Pathologist and Medical Analyst named 'diagnosmart AI'. 
      Analyze the attached medical report image (Pathology, Lab Test, X-Ray, etc.).
      
      1. Extract all test parameters, values, units, and reference ranges.
      2. Determine the status (Normal/Low/High/Critical) for each parameter.
      3. Calculate a 'Health Score' (0-100). 100 is perfect health, <50 is critical.
      4. If the report is completely normal, specify: "Patient is Healthy. No abnormal findings."
      5. Provide a summary and advice in BOTH English and Hindi.
      6. Identify the type of specialist doctor the patient should visit.
      7. Translate the diagnosis and specialist type into Hindi as well.
      
      Output strictly JSON matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1 
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("No response from AI");
    
    return JSON.parse(textResponse) as ReportAnalysis;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const suggestDoctors = async (pincode: string, specialist: string): Promise<any[]> => {
  try {
    const prompt = `
      Generate a JSON list of 3-4 realistic (but fictional or representative) ${specialist} doctors/clinics that might exist in a city with Indian Pincode ${pincode}.
      Include: name, specialization, hospital/clinic name, address (with the pincode), approximate distance (e.g. 1.2 km), and rating (3.5-5.0).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              specialization: { type: Type.STRING },
              hospital: { type: Type.STRING },
              address: { type: Type.STRING },
              distance: { type: Type.STRING },
              rating: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}
