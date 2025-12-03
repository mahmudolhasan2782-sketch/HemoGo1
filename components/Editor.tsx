import React, { useEffect, useRef, useState } from 'react';
import { Download, Type, Image as ImageIcon, Eraser, Palette } from 'lucide-react';
import { ASPECT_RATIOS } from '../constants';
import { suggestThumbnailTitles } from '../services/geminiService';

interface Props {
  originalImage: string;
  processedImage: string;
}

const Editor: React.FC<Props> = ({ originalImage, processedImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeImage, setActiveImage] = useState<string>(processedImage);
  const [text, setText] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<number>(60);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Draw logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = activeImage;
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      // Set canvas size based on AR
      const baseWidth = 1920; // High res base
      let baseHeight = 1080;
      
      switch(aspectRatio) {
        case '16:9': baseHeight = 1080; break;
        case '1:1': baseWidth === 1920 ? baseHeight = 1920 : baseHeight = 1080; break; // Make square
        case '9:16': baseHeight = 3413; break; // approx for vertical
        case '4:3': baseHeight = 1440; break;
      }
      
      // Fix for simple logic: let's stick to width 1200 for preview
      const width = 1200;
      let height = 675; // 16:9 default
       if (aspectRatio === '1:1') height = 1200;
       if (aspectRatio === '9:16') height = 2133;
       if (aspectRatio === '4:3') height = 900;

      canvas.width = width;
      canvas.height = height;

      // Draw Image (Cover fit)
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width / 2) - (img.width / 2) * scale;
      const y = (height / 2) - (img.height / 2) * scale;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Overlay Text
      if (text) {
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = `bold ${fontSize}px 'Hind Siliguri', sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Split lines
        const words = text.split(' ');
        let line = '';
        const lines = [];
        const maxWidth = width * 0.8;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        const lineHeight = fontSize * 1.2;
        const initialY = height - (lines.length * lineHeight) - 50; // Bottom aligned

        lines.forEach((l, i) => {
           ctx.fillText(l, width / 2, initialY + (i * lineHeight));
           // Stroke for better visibility
           ctx.strokeStyle = 'black';
           ctx.lineWidth = fontSize / 15;
           ctx.strokeText(l, width / 2, initialY + (i * lineHeight));
        });

        ctx.restore();
      }
    };
  }, [activeImage, text, aspectRatio, textColor, fontSize]);

  const handleDownload = (format: 'png' | 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `hemostyle-edit.${format}`;
    link.href = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`, 1.0);
    link.click();
  };

  const generateIdeas = async () => {
    setIsSuggesting(true);
    try {
        const titles = await suggestThumbnailTitles("Fashion and Style");
        if(titles.length > 0) setText(titles[0]);
    } catch(e) {
        console.error(e);
    } finally {
        setIsSuggesting(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-4">
      {/* Canvas Area */}
      <div className="flex-1 bg-slate-900 rounded-xl p-4 flex items-center justify-center shadow-2xl overflow-hidden relative min-h-[400px]">
        <canvas ref={canvasRef} className="max-w-full max-h-[600px] shadow-lg" />
      </div>

      {/* Controls */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col gap-6">
        <div>
           <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
             <Palette className="w-5 h-5 text-orange-500" />
             এডিটর টুলস
           </h3>
           
           {/* Aspect Ratio */}
           <div className="mb-4">
             <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">সাইজ / রেশিও</label>
             <div className="grid grid-cols-3 gap-2">
               {ASPECT_RATIOS.map(ar => (
                 <button
                   key={ar.value}
                   onClick={() => setAspectRatio(ar.value)}
                   className={`px-2 py-2 text-xs rounded-md border ${aspectRatio === ar.value ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                 >
                   {ar.label}
                 </button>
               ))}
             </div>
           </div>

           {/* Text Overlay */}
           <div className="mb-4">
             <label className="text-xs font-semibold text-slate-500 uppercase mb-2 flex justify-between">
                <span>টেক্সট / শিরোনাম</span>
                <button onClick={generateIdeas} disabled={isSuggesting} className="text-orange-500 text-xs hover:underline disabled:opacity-50">
                   {isSuggesting ? 'AI ভাবছে...' : 'AI আইডিয়া নিন'}
                </button>
             </label>
             <textarea 
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder="আপনার শিরোনাম লিখুন..."
               className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
               rows={3}
             />
           </div>

           {/* Font Controls */}
           <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">কালার</label>
                <div className="flex items-center gap-2">
                   <input 
                      type="color" 
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                   />
                   <span className="text-xs text-slate-400">{textColor}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">ফন্ট সাইজ</label>
                <input 
                  type="range" 
                  min="20" 
                  max="120" 
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
           </div>
        </div>

        {/* Download Actions */}
        <div className="mt-auto space-y-3">
          <button 
             onClick={() => handleDownload('png')}
             className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> PNG ডাউনলোড (স্বচ্ছ)
          </button>
          <button 
             onClick={() => handleDownload('jpg')}
             className="w-full bg-slate-100 text-slate-700 border border-slate-300 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-all"
          >
             JPG ডাউনলোড
          </button>
          <p className="text-center text-[10px] text-slate-400">
             High Quality Export • Unlimited Free
          </p>
        </div>
      </div>
    </div>
  );
};

export default Editor;
