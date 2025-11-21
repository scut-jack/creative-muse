import React, { useState } from 'react';
import { ImageState } from '../types';
import { generateStory, generateSpeech } from '../services/geminiService';
import { playRawAudio } from '../services/audioService';
import { Loader2, Upload, Volume2, Sparkles, Image as ImageIcon } from 'lucide-react';

export const StoryWriter: React.FC = () => {
  const [image, setImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null, mimeType: null });
  const [story, setStory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract Base64 data and mime type
        // Data URL format: data:[<mediatype>][;base64],<data>
        const base64Data = result.split(',')[1];
        const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
        
        setImage({
          file,
          previewUrl: result,
          base64: base64Data,
          mimeType: mimeType
        });
        setStory(""); // Reset story on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image.base64 || !image.mimeType) return;
    
    setIsLoading(true);
    try {
      const generatedStory = await generateStory(image.base64, image.mimeType);
      setStory(generatedStory);
    } catch (error) {
      console.error("Failed to generate story", error);
      setStory("The muse is silent right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloud = async () => {
    if (!story) return;
    
    setIsPlaying(true);
    try {
      const audioData = await generateSpeech(story);
      await playRawAudio(audioData);
    } catch (error) {
      console.error("Failed to generate speech", error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Visual Storyteller
        </h2>
        <p className="text-slate-400 mt-2">Upload an image to inspire a ghostwritten story.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Image Upload */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              Inspiration Source
            </h3>
          </div>
          
          <div className="relative group">
             {!image.previewUrl ? (
               <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-all">
                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
                   <Upload className="w-10 h-10 mb-3 text-slate-400" />
                   <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                   <p className="text-xs text-slate-500">PNG, JPG (Max 5MB)</p>
                 </div>
                 <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
               </label>
             ) : (
               <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-600 group">
                 <img src={image.previewUrl} alt="Inspiration" className="w-full h-full object-cover" />
                 <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Change Image
                    </span>
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                 </label>
               </div>
             )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!image.base64 || isLoading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
              ${!image.base64 || isLoading 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Dreaming...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Write Story
              </>
            )}
          </button>
        </div>

        {/* Right Column: Story Output */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm min-h-[400px] flex flex-col">
           <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-200">The Story</h3>
            {story && (
              <button 
                onClick={handleReadAloud}
                disabled={isPlaying}
                className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors
                  ${isPlaying 
                    ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
              >
                {isPlaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                {isPlaying ? 'Speaking...' : 'Read Aloud'}
              </button>
            )}
          </div>
          
          <div className="flex-grow bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            {story ? (
              <p className="leading-relaxed text-slate-200 text-lg font-light font-serif whitespace-pre-wrap">
                {story}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                <Sparkles className="w-12 h-12 mb-2" />
                <p>Your story will appear here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
