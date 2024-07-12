// components/ImageUpload.tsx
import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImageSelect(null);
      setPreview(null);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2">Upload Bill Image (optional)</label>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <button 
        type="button" 
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        Select Image
      </button>
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Bill preview" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
}