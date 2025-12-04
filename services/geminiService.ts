// No external API imports needed
// We use native Browser Canvas API for local processing

export const generateTransformation = async (
  imageBase64: string,
  promptSuffix: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error("Canvas context not supported"));
        return;
      }

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Apply filters based on the prompt/style keywords
      // This simulates the "Style" transformation locally
      ctx.save();
      
      if (promptSuffix.includes('cyberpunk') || promptSuffix.includes('neon')) {
        // Cyberpunk: Cool purple tint, high contrast
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = '#a855f7'; // Purple
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        
        // Add some noise or lines if possible, but simple filter for now
        ctx.filter = 'contrast(1.2) brightness(1.1) hue-rotate(15deg)';
        ctx.drawImage(canvas, 0, 0); // Re-draw to apply filter
      } 
      else if (promptSuffix.includes('professional') || promptSuffix.includes('suit')) {
        // Professional: Clean, slightly cool, sharp
        ctx.filter = 'contrast(1.1) saturate(0.8) brightness(1.05)';
        ctx.drawImage(canvas, 0, 0);
      }
      else if (promptSuffix.includes('saree') || promptSuffix.includes('punjabi') || promptSuffix.includes('gold')) {
        // Ethnic/Royal: Warm, golden glow
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillStyle = '#fbbf24'; // Amber/Gold
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.filter = 'contrast(1.1) saturate(1.2) sepia(0.2)';
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(canvas, 0, 0);
      }
      else if (promptSuffix.includes('fashion') || promptSuffix.includes('vogue')) {
        // Model: High contrast B&W or Dramtic
        ctx.filter = 'contrast(1.3) grayscale(0.2)';
        ctx.drawImage(canvas, 0, 0);
      }
      
      ctx.restore();

      // Return processed image as Base64
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = (err) => {
      reject(new Error("Failed to load image for processing"));
    };

    img.src = imageBase64;
  });
};

export const suggestThumbnailTitles = async (topic: string): Promise<string[]> => {
  // Return static mock data since we cannot use LLM API for free/offline
  // Simulating AI response
  const suggestions = [
    "🔥 সেরা ভাইরাল লুক!",
    "✨ নতুন স্টাইল ২০২৫",
    "📸 প্রফেশনাল ফটো এডিটিং",
    "😲 অবিশ্বাস্য পরিবর্তন দেখুন",
    "🎨 অসাধারণ ডিজাইন টিপস"
  ];
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return suggestions;
}