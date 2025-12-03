import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface Props {
  onImageSelect: (base64: string) => void;
}

const ImageUploader: React.FC<Props> = ({ onImageSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-purple-300 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer p-10 flex flex-col items-center justify-center text-center h-64"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleFileChange}
      />
      <div className="bg-purple-200 p-4 rounded-full mb-4">
        <Upload className="w-8 h-8 text-purple-700" />
      </div>
      <h3 className="text-xl font-bold text-purple-900 mb-2">ছবি আপলোড করুন</h3>
      <p className="text-purple-600">ক্লিক করুন অথবা ড্র্যাগ এবং ড্রপ করুন</p>
      <p className="text-xs text-purple-400 mt-2">JPG, PNG supported</p>
    </div>
  );
};

export default ImageUploader;
