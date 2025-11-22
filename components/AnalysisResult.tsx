
import React, { useState } from 'react';
import { ReportAnalysis, AppLanguage, DoctorRecommendation } from '../types';
import { suggestDoctors } from '../services/geminiService';

interface AnalysisResultProps {
  data: ReportAnalysis;
  lang: AppLanguage;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, lang, onReset }) => {
  const [pincode, setPincode] = useState('');
  const [doctors, setDoctors] = useState<DoctorRecommendation[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'doctors'>('summary');

  // Text-to-Speech
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const specialistName = lang === 'hi' && data.requiredSpecialist_hi 
    ? data.requiredSpecialist_hi 
    : data.requiredSpecialist;

  const handleDoctorSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length < 6) return;
    setLoadingDoctors(true);
    // We pass the English specialist name to the API generator usually, but display Hindi
    const results = await suggestDoctors(pincode, data.requiredSpecialist);
    setDoctors(results);
    setLoadingDoctors(false);
    setActiveTab('doctors');
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const t = {
    summary: lang === 'en' ? 'Analysis Summary' : 'रिपोर्ट सारांश',
    details: lang === 'en' ? 'Detailed Report' : 'विस्तृत रिपोर्ट',
    doctors: lang === 'en' ? 'Find Doctors' : 'डॉक्टर खोजें',
    healthScore: lang === 'en' ? 'Health Score' : 'हेल्थ स्कोर',
    risk: lang === 'en' ? 'Immediate Risk' : 'जोखिम स्तर',
    advice: lang === 'en' ? 'Medical Advice' : 'चिकित्सीय सलाह',
    possibleDiagnosis: lang === 'en' ? 'Possible Diagnosis' : 'संभावित निदान',
    parameter: lang === 'en' ? 'Parameter' : 'पैरामीटर',
    value: lang === 'en' ? 'Result' : 'परिणाम',
    range: lang === 'en' ? 'Normal Range' : 'सामान्य सीमा',
    status: lang === 'en' ? 'Status' : 'स्थिति',
    enterPincode: lang === 'en' ? 'Enter Pincode' : 'पिन कोड डालें',
    search: lang === 'en' ? 'Search Doctors' : 'डॉक्टर खोजें',
    specialistNeeded: lang === 'en' ? 'Recommended Specialist' : 'अनुशंसित विशेषज्ञ',
    viewOnMap: lang === 'en' ? 'View on Google Maps' : 'गूगल मैप्स पर देखें',
    readAloud: lang === 'en' ? 'Listen' : 'सुनें',
    scanNew: lang === 'en' ? 'Scan New Report' : 'नई रिपोर्ट स्कैन करें',
    patient: lang === 'en' ? 'Patient Report' : 'मरीज की रिपोर्ट',
    aiAnalysis: lang === 'en' ? 'AI Analysis' : 'AI विश्लेषण',
    basedOn: lang === 'en' ? 'Based on your report results' : 'आपकी रिपोर्ट के परिणामों के आधार पर',
    bookDirections: lang === 'en' ? 'Book / Directions' : 'बुकिंग / रास्ता देखें',
    noDocsFound: lang === 'en' ? 'No direct recommendations found in simulation.' : 'सिमुलेशन में कोई सीधा सुझाव नहीं मिला।',
    clickMap: lang === 'en' ? 'Click here to search Google Maps directly for' : 'सीधे गूगल मैप्स पर खोजने के लिए यहाँ क्लिक करें:',
    near: lang === 'en' ? 'near' : 'के पास',
    enterPinPrompt: lang === 'en' ? 'Enter your Pincode to find relevant specialists near you.' : 'अपने आस-पास के विशेषज्ञों को खोजने के लिए अपना पिन कोड डालें।'
  };

  const diagnosis = lang === 'hi' && data.possibleDiagnosis_hi ? data.possibleDiagnosis_hi : data.possibleDiagnosis;
  const summaryText = lang === 'hi' ? data.summary_hi : data.summary_en;
  const adviceList = lang === 'hi' ? data.advice_hi : data.advice_en;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onReset} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {t.scanNew}
        </button>
        <button 
          onClick={() => speak(summaryText)}
          className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          <span>{t.readAloud}</span>
        </button>
      </div>

      {/* Main Score Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50"></div>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="flex-1">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${getRiskColor(data.riskLevel)}`}>
                    {t.risk}: {data.riskLevel}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{data.patientName || t.patient}</h2>
                <p className="text-gray-500 text-sm mb-4">{data.testType} • {data.reportDate || new Date().toLocaleDateString()}</p>
                
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{t.possibleDiagnosis}</h3>
                    <p className="text-lg font-medium text-gray-800">{diagnosis}</p>
                </div>
            </div>

            {/* Health Meter */}
            <div className="flex flex-col items-center ml-0 md:ml-8 mt-6 md:mt-0">
                <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={data.healthScore > 50 ? "#22c55e" : "#ef4444"} strokeWidth="3" strokeDasharray={`${data.healthScore}, 100`} className="animate-[spin_1s_ease-out_reverse]" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{data.healthScore}</span>
                        <span className="text-[10px] text-gray-500 uppercase">Score</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl mb-6">
        {(['summary', 'details', 'doctors'] as const).map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                {t[tab]}
            </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] p-6">
        
        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
            <div className="animate-fade-in">
                <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.aiAnalysis}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                        {summaryText}
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.advice}</h3>
                    <ul className="space-y-3">
                        {adviceList.map((adv, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">{idx + 1}</span>
                                <span className="text-gray-700">{adv}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === 'details' && (
            <div className="overflow-x-auto animate-fade-in">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.parameter}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.value}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.range}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.parameters.map((param, idx) => {
                            const isAbnormal = param.status.toLowerCase() !== 'normal';
                            // Use Hindi interpretation if available and language is Hindi
                            const interpretation = lang === 'hi' && param.interpretation_hi ? param.interpretation_hi : param.interpretation;
                            
                            return (
                                <tr key={idx} className={isAbnormal ? 'bg-red-50/50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{param.name}</div>
                                        {interpretation && <div className="text-xs text-gray-500 mt-1">{interpretation}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-bold">{param.value} <span className="text-xs font-normal text-gray-500">{param.unit}</span></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{param.referenceRange}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${param.status === 'Normal' ? 'bg-green-100 text-green-800' : 
                                              param.status === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {param.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}

        {/* DOCTORS TAB */}
        {activeTab === 'doctors' && (
            <div className="animate-fade-in">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between">
                    <div className="mb-4 sm:mb-0">
                        <h4 className="font-semibold text-blue-900">{t.specialistNeeded}: {specialistName}</h4>
                        <p className="text-sm text-blue-700 mt-1">{t.basedOn}</p>
                    </div>
                    <form onSubmit={handleDoctorSearch} className="flex w-full sm:w-auto space-x-2">
                        <input 
                            type="text" 
                            placeholder={t.enterPincode}
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                            className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            type="submit"
                            disabled={loadingDoctors}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loadingDoctors ? '...' : t.search}
                        </button>
                    </form>
                </div>

                {doctors.length > 0 ? (
                    <div className="space-y-4">
                        {doctors.map((doc, idx) => (
                            <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <h4 className="font-bold text-gray-800">{doc.name}</h4>
                                    <p className="text-sm text-gray-600">{doc.specialization} • {doc.hospital}</p>
                                    <p className="text-xs text-gray-500 mt-1">📍 {doc.address} ({doc.distance})</p>
                                </div>
                                <div className="mt-3 sm:mt-0 flex flex-col items-end">
                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold mb-2">⭐ {doc.rating}</span>
                                    <a 
                                        href={`https://www.google.com/maps/search/${encodeURIComponent(doc.name + ' ' + doc.address)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 text-sm font-medium hover:underline flex items-center"
                                    >
                                        {t.bookDirections} <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                   !loadingDoctors && doctors.length === 0 && pincode.length > 0 ? (
                       <div className="text-center py-10 text-gray-500">
                           <p>{t.noDocsFound}</p>
                           <a 
                            href={`https://www.google.com/maps/search/${encodeURIComponent(data.requiredSpecialist + ' near ' + pincode)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-4 text-blue-600 underline font-medium"
                           >
                               {t.clickMap} {specialistName} {t.near} {pincode}
                           </a>
                       </div>
                   ) : (
                    <div className="text-center py-10">
                        <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <p className="text-gray-500">{t.enterPinPrompt}</p>
                    </div>
                   )
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
