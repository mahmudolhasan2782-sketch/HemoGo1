import React, { useState, useEffect } from 'react';
import { TRANSFORM_STYLES } from './constants';
import Logo from './components/Logo';
import ImageUploader from './components/ImageUploader';
import StyleCard from './components/StyleCard';
import Editor from './components/Editor';
import { generateTransformation } from './services/geminiService';
import { Wand2, RefreshCw, AlertCircle, Key } from 'lucide-react';
import { EditorState } from './types';

function App() {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  const [state, setState] = useState<EditorState>({
    originalImage: null,
    processedImage: null,
    isProcessing: false,
    selectedStyle: null,
    thumbnailText: '',
    error: null
  });

  // Check for API Key availability (AI Studio flow)
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // In Vercel or other environments, we assume the key is set via Env Vars.
        // We set true here to allow the UI to render. If the key is missing on server,
        // the API call will fail gracefully.
        setHasApiKey(true);
      }
      setIsCheckingKey(false);
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Re-check after selection
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const handleImageSelect = (base64: string) => {
    setState(prev => ({ ...prev, originalImage: base64, processedImage: null, selectedStyle: null, error: null }));
  };

  const handleStyleSelect = async (styleId: string) => {
    if (!state.originalImage) return;

    // Create a new GoogleGenAI instance right before making an API call 
    // to ensure it uses the most up-to-date API key from the dialog if applicable.
    
    setState(prev => ({ ...prev, selectedStyle: styleId, isProcessing: true, error: null }));

    const style = TRANSFORM_STYLES.find(s => s.id === styleId);
    if (!style) return;

    try {
      const result = await generateTransformation(state.originalImage, style.promptSuffix);
      setState(prev => ({ ...prev, processedImage: result, isProcessing: false }));
    } catch (err: any) {
      console.error(err);
      let errorMessage = "দুঃখিত, ছবিটি প্রসেস করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।";
      
      // Provide hint for Vercel deployment if key is missing
      if (err.message?.includes('API key') || err.message?.includes('403')) {
        errorMessage = "API Key সেট করা নেই। দয়া করে Vercel Settings-এ API_KEY যুক্ত করুন।";
      }

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage
      }));
    }
  };

  const reset = () => {
    setState({
      originalImage: null,
      processedImage: null,
      isProcessing: false,
      selectedStyle: null,
      thumbnailText: '',
      error: null
    });
  };

  if (isCheckingKey) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
    </div>;
  }

  // API Key Selection Screen (Only for supported environments like AI Studio)
  if (!hasApiKey && window.aistudio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
        <Logo className="mb-8 scale-150" />
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">API Key প্রয়োজন</h2>
          <p className="text-slate-600 mb-8">
            HemoStyle ব্যবহার করতে অনুগ্রহ করে আপনার Gemini API Key কানেক্ট করুন। এটি সম্পূর্ণ নিরাপদ এবং সরাসরি Google এর মাধ্যমে হয়।
          </p>
          <button 
            onClick={handleConnectKey}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            API Key কানেক্ট করুন
          </button>
          <p className="mt-6 text-xs text-slate-400">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-purple-600">
              Pricing সম্পর্কে জানুন
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            
            {/* Brand Ambassador Image Section */}
            <div className="hidden md:flex items-center gap-3 pl-6 border-l-2 border-orange-100/50">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur-[2px]"></div>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" 
                  alt="Pro Editor" 
                  className="relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700">AI Pro Suit</span>
                <span className="text-[10px] text-orange-500 font-medium tracking-wide">PREMIUM STYLE</span>
              </div>
            </div>
          </div>

          {state.originalImage && (
             <button 
               onClick={reset}
               className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors"
             >
               <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">নতুন শুরু করুন</span>
             </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        {!state.originalImage ? (
          // Landing / Upload State
          <div className="max-w-3xl mx-auto mt-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-orange-500 mb-6 pb-2">
              আপনার ছবিকে দিন প্রফেশনাল রূপ
            </h1>
            <p className="text-lg text-slate-600 mb-12 max-w-xl mx-auto">
              এআই-এর শক্তিতে সাধারণ ছবিকে স্টাইলিশ, প্রফেশনাল বা ট্র্যাডিশনাল লুকে পরিবর্তন করুন নিমেষেই।
            </p>
            <div className="bg-white p-2 rounded-3xl shadow-xl">
               <ImageUploader onImageSelect={handleImageSelect} />
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
               <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">এআই ম্যাজিক</h3>
                  <p className="text-sm text-slate-500">অটোমেটিক ব্যাকগ্রাউন্ড এবং পোশাক পরিবর্তন</p>
               </div>
               <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">প্রফেশনাল ডিজাইন</h3>
                  <p className="text-sm text-slate-500">ইউটিউব ও সোশ্যাল মিডিয়ার জন্য হাই-কোয়ালিটি আউটপুট</p>
               </div>
               <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">ফেস অবিকৃতি গ্যারান্টি</h3>
                  <p className="text-sm text-slate-500">আপনার মুখের বৈশিষ্ট্য থাকবে ১০০% অটুট</p>
               </div>
            </div>
          </div>
        ) : !state.processedImage ? (
          // Selection Phase
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
              <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">১</span>
              পছন্দের স্টাইল নির্বাচন করুন
            </h2>

            {state.error && (
              <div className="mb-8 max-w-lg mx-auto bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{state.error}</p>
              </div>
            )}

            {state.isProcessing ? (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="relative w-24 h-24 mb-6">
                   <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-t-purple-600 rounded-full animate-spin"></div>
                   <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 animate-pulse">AI প্রসেসিং চলছে...</h3>
                <p className="text-slate-500 mt-2">অনুগ্রহ করে অপেক্ষা করুন, ম্যাজিক তৈরি হচ্ছে!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {TRANSFORM_STYLES.map(style => (
                  <StyleCard 
                    key={style.id}
                    styleData={style}
                    isSelected={state.selectedStyle === style.id}
                    onSelect={handleStyleSelect}
                  />
                ))}
              </div>
            )}
            
            {!state.isProcessing && (
              <div className="mt-12 flex justify-center">
                 <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 max-w-xs mx-auto">
                    <img src={state.originalImage} alt="Original" className="w-full h-48 object-cover rounded-lg opacity-80" />
                    <p className="text-center text-xs text-slate-400 mt-2">আপনার আপলোড করা ছবি</p>
                 </div>
              </div>
            )}
          </div>
        ) : (
          // Editor Phase
          <div className="max-w-7xl mx-auto">
             <div className="flex items-center justify-center gap-2 mb-8">
               <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">২</span>
               <h2 className="text-2xl font-bold">এডিটর এবং ডাউনলোড</h2>
             </div>
             <Editor 
                originalImage={state.originalImage} 
                processedImage={state.processedImage} 
             />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <Logo className="h-10 mb-6 mx-auto justify-center brightness-150 grayscale-[0.2]" />
           <p className="text-sm opacity-60 mb-2">
             Advanced AI Photo Editing & Design Platform
           </p>
           <div className="border-t border-slate-800 my-6 w-1/2 mx-auto"></div>
           <p className="text-sm font-semibold text-orange-400">
             @Hemontu Incorporation এর একটি সার্ভিস
           </p>
        </div>
      </footer>
    </div>
  );
}

export default App;