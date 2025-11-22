
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import { analyzeReportImage } from './services/geminiService';
import { ReportAnalysis, AppLanguage, HistoryItem } from './types';

const App: React.FC = () => {
  // Changed default to 'hi' (Hindi)
  const [lang, setLang] = useState<AppLanguage>('hi');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ReportAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('diagnosmart_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (analysis: ReportAnalysis) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      analysis
    };
    const newHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem('diagnosmart_history', JSON.stringify(newHistory));
  };

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const mimeType = file.type;
        
        try {
          const analysis = await analyzeReportImage(base64Data, mimeType);
          setCurrentAnalysis(analysis);
          saveToHistory(analysis);
        } catch (err) {
          console.error(err);
          setError(lang === 'hi' 
            ? "रिपोर्ट का विश्लेषण करने में विफल। कृपया सुनिश्चित करें कि इमेज स्पष्ट है और इसमें मेडिकल टेक्स्ट है।"
            : "Failed to analyze report. Please ensure the image is clear and contains medical text.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setError(lang === 'hi' ? "फाइल पढ़ने में त्रुटि।" : "Error reading file.");
      setIsAnalyzing(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setCurrentAnalysis(item.analysis);
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setError(null);
  };

  const t = {
    heroTitle: lang === 'en' ? 'Understand Your ' : 'अपनी ',
    heroTitleHighlight: lang === 'en' ? 'Lab Reports ' : 'लैब रिपोर्ट्स ',
    heroTitleEnd: lang === 'en' ? 'in Seconds' : 'को सेकंडों में समझें',
    heroDesc: lang === 'en' 
      ? 'Upload any Blood Test, X-Ray, or Pathology report. diagnosmart AI analyzes it instantly, explains results in simple language, and guides you on what to do next.'
      : 'कोई भी ब्लड टेस्ट, एक्स-रे या पैथोलॉजी रिपोर्ट अपलोड करें। diagnosmart AI तुरंत इसका विश्लेषण करता है, सरल भाषा में परिणाम समझाता है, और आगे क्या करना है, इस पर मार्गदर्शन करता है।',
    recentReports: lang === 'en' ? 'Recent Reports' : 'हाल की रिपोर्ट',
    medicalReport: lang === 'en' ? 'Medical Report' : 'मेडिकल रिपोर्ट',
    features: [
      {
        icon: '🔍', 
        title: lang === 'en' ? 'AI OCR ANALYSIS' : 'AI OCR विश्लेषण', 
        desc: lang === 'en' ? 'Instantly reads values from scanned images and PDFs.' : 'स्कैन की गई इमेज और PDF से तुरंत वैल्यू पढ़ता है।'
      },
      {
        icon: '🏥', 
        title: lang === 'en' ? 'DOCTOR CONNECT' : 'डॉक्टर कनेक्ट', 
        desc: lang === 'en' ? 'Finds specialists near you based on your specific condition.' : 'आपकी स्थिति के आधार पर आपके नजदीकी विशेषज्ञ ढूंढता है।'
      },
      {
        icon: '🛡️', 
        title: lang === 'en' ? 'RISK ASSESSMENT' : 'जोखिम मूल्यांकन', 
        desc: lang === 'en' ? 'Identifies critical levels and provides immediate advice.' : 'गंभीर स्तरों की पहचान करता है और तत्काल सलाह देता है।'
      }
    ],
    footerDesc: lang === 'en' ? 'Created By: Shekh Shabir' : 'Created By: Shekh Shabir', // Keeping branding as requested
    disclaimer: lang === 'en' 
      ? 'Disclaimer: This tool is for informational purposes only and does not replace professional medical advice.'
      : 'अस्वीकरण: यह उपकरण केवल सूचनात्मक उद्देश्यों के लिए है और पेशेवर चिकित्सा सलाह की जगह नहीं लेता है।'
  };

  return (
    // Removed bg-slate-50 to allow body gradient to show
    <div className="min-h-screen text-slate-900 font-sans selection:bg-blue-100 bg-transparent">
      <Header 
        lang={lang} 
        setLang={setLang} 
        goHome={handleReset} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center">
             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        )}

        {!currentAnalysis ? (
          <div className="flex flex-col items-center">
            {/* Hero Section */}
            <div className="text-center mb-10 mt-6 max-w-3xl">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-6 uppercase drop-shadow-sm">
                {t.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t.heroTitleHighlight}</span> {t.heroTitleEnd}
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
                {t.heroDesc}
              </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} lang={lang} />

            {/* History Section */}
            {history.length > 0 && !isAnalyzing && (
              <div className="w-full max-w-4xl mt-20">
                <h3 className="text-xl font-bold text-gray-800 mb-4 px-2 uppercase tracking-wide">{t.recentReports}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => loadHistoryItem(item)}
                      className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-white/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase">{new Date(item.date).toLocaleDateString()}</span>
                        <span className={`w-2 h-2 rounded-full ${item.analysis.overallResult === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      </div>
                      <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors uppercase">{item.analysis.testType || t.medicalReport}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {lang === 'hi' && item.analysis.possibleDiagnosis_hi 
                          ? item.analysis.possibleDiagnosis_hi 
                          : item.analysis.possibleDiagnosis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full border-t border-gray-200/50 pt-12">
              {t.features.map((f, i) => (
                <div key={i} className="text-center p-6 bg-white/50 rounded-2xl hover:bg-white/80 transition-colors backdrop-blur-sm">
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wider">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <AnalysisResult 
            data={currentAnalysis} 
            lang={lang} 
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-900 font-bold uppercase tracking-widest text-xs">DIAGNOSMART AI</p>
            <p className="text-gray-500 text-sm mt-1">{t.footerDesc}</p>
            <p className="text-gray-400 text-xs mt-4">{t.disclaimer}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
