
import React, { useRef, useState } from 'react';
import { AppLanguage } from '../types';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  lang: AppLanguage;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const t = {
    title: lang === 'en' ? 'Upload Report' : 'रिपोर्ट अपलोड करें',
    subtitle: lang === 'en' 
      ? 'Click to browse or drag and drop\n(JPG, PNG, Scanned Images)' 
      : 'ब्राउज़ करने के लिए क्लिक करें या यहाँ खींचें\n(JPG, PNG, स्कैन की गई इमेज)',
    analyzing: lang === 'en' ? 'Analyzing Parameters & Vital Signs...' : 'पैरामीटर और वाइटल साइन्स का विश्लेषण किया जा रहा है...'
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 relative z-10">
      <div 
        className={`relative group border-[3px] border-dashed rounded-[2rem] p-12 text-center transition-all duration-500 ease-out cursor-pointer overflow-hidden
          ${dragActive 
            ? "border-indigo-600 bg-indigo-50 scale-105 shadow-2xl" 
            : "border-indigo-300 bg-gradient-to-br from-white via-blue-50 to-indigo-50 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-200/50"
          }
          ${isAnalyzing ? "pointer-events-none opacity-50 grayscale" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Colorful Animated Blobs for Background Effect */}
        <div className="absolute top-0 left-0 -ml-10 -mt-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 -mb-10 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="relative flex flex-col items-center justify-center space-y-6 z-10">
          {/* Colorful Gradient Icon Container */}
          <div className="h-24 w-24 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3 border-4 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 group-hover:from-blue-600 group-hover:to-pink-600 transition-all uppercase tracking-tight">
              {t.title}
            </h3>
            <p className="text-slate-500 mt-3 text-sm font-semibold whitespace-pre-line leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>
      
      {isAnalyzing && (
        <div className="mt-8 flex flex-col items-center animate-pulse">
           <div className="flex space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
           </div>
           <p className="text-indigo-600 font-bold mt-3 uppercase tracking-widest text-xs">{t.analyzing}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
