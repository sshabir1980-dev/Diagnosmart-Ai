import React from 'react';
import { AppLanguage } from '../types';

interface HeaderProps {
  lang: AppLanguage;
  setLang: (l: AppLanguage) => void;
  goHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, goHome }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={goHome}>
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            D
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-extrabold text-gray-900 tracking-widest uppercase">DIAGNOSMART AI</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">By Shekh Shabir</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700 border border-gray-200 shadow-sm uppercase tracking-wide"
          >
            <span className="mr-1 text-lg">🌐</span>
            {lang === 'en' ? 'ENGLISH' : 'हिंदी'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;