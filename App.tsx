import React, { useState } from 'react';
import { AppMode } from './types';
import { StoryWriter } from './components/StoryWriter';
import { ChatBot } from './components/ChatBot';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { Feather, MessageSquare, Image as ImageIcon, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.STORY_WRITER);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Lumina <span className="font-light text-slate-500">| Creative Muse</span>
              </h1>
            </div>
            
            <nav className="flex gap-1">
                <button 
                    onClick={() => setMode(AppMode.STORY_WRITER)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${mode === AppMode.STORY_WRITER ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                    <Feather className="w-4 h-4" />
                    Storyteller
                </button>
                <button 
                    onClick={() => setMode(AppMode.IMAGE_ANALYSIS)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${mode === AppMode.IMAGE_ANALYSIS ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                    <ImageIcon className="w-4 h-4" />
                    Analyzer
                </button>
                <button 
                    onClick={() => setMode(AppMode.CHAT)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${mode === AppMode.CHAT ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === AppMode.STORY_WRITER && (
            <div className="animate-in fade-in zoom-in duration-300">
                <StoryWriter />
            </div>
        )}
        {mode === AppMode.CHAT && (
            <div className="animate-in fade-in zoom-in duration-300">
                <ChatBot />
            </div>
        )}
        {mode === AppMode.IMAGE_ANALYSIS && (
            <div className="animate-in fade-in zoom-in duration-300">
                <ImageAnalyzer />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
