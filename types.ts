
export interface TestParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  interpretation?: string;
  interpretation_hi?: string;
}

export interface DoctorRecommendation {
  name: string;
  specialization: string;
  hospital: string;
  address: string;
  distance: string;
  rating: number;
}

export interface ReportAnalysis {
  patientName?: string;
  reportDate?: string;
  testType: string; // e.g., CBC, Lipid Profile
  overallResult: 'Normal' | 'Abnormal';
  riskLevel: 'Safe' | 'Moderate' | 'Critical';
  healthScore: number; // 0-100
  summary_en: string;
  summary_hi: string;
  possibleDiagnosis: string;
  possibleDiagnosis_hi?: string;
  advice_en: string[];
  advice_hi: string[];
  parameters: TestParameter[];
  requiredSpecialist: string; // e.g., "Cardiologist"
  requiredSpecialist_hi?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  analysis: ReportAnalysis;
}

export type AppLanguage = 'en' | 'hi';
