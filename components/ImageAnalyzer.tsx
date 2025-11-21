import React, { useState } from 'react';
import { ImageState } from '../types';
import { analyzeImageWithPrompt } from '../services/geminiService';
import { Upload, Search, Loader2, Image as ImageIcon } from 'lucide-react';

export const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null, mimeType: null });
  const [prompt, setPrompt] = useState("Describe this image in detail.");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
        
        setImage({
          file,
          previewUrl: result,
          base64: base64Data,
          mimeType: mimeType
        });
        setAnalysis("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image.base64 || !image.mimeType || !prompt) return;
    
    setIsLoading(true);
    try {
      const result = await analyzeImageWithPrompt(image.base64, image.mimeType, prompt);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysis("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Input Section */}
        <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-400" />
                    Upload Image
                </h3>
                <div className="relative group">
                    {!image.previewUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-400">Upload an image to analyze</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                    ) : (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-600 bg-black/20 flex items-center justify-center group">
                        <img src={image.previewUrl} alt="Analysis Target" className="max-w-full max-h-full object-contain" />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white font-medium flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Replace
                            </span>
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
                 <h3 className="text-lg font-semibold text-slate-200 mb-4">Question / Prompt</h3>
                 <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none"
                    placeholder="What would you like to know about this image?"
                 />
                 <button
                    onClick={handleAnalyze}
                    disabled={!image.base64 || isLoading || !prompt}
                    className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                    ${!image.base64 || isLoading 
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                 >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Analyze
                 </button>
            </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl min-h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Analysis Results</h3>
            <div className="flex-grow bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 overflow-y-auto max-h-[600px]">
                {analysis ? (
                    <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300">{analysis}</p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                        <Search className="w-12 h-12 mb-2" />
                        <p>Analysis will appear here...</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
