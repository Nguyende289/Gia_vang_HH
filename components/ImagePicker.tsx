
import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { fileToBase64, compressImage } from '../utils/imageUtils';

interface ImagePickerProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  required?: boolean;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ label, value, onChange, required }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const rawBase64 = await fileToBase64(file);
      const compressed = await compressImage(rawBase64);
      onChange(compressed);
    } catch (err) {
      console.error("Error processing image", err);
      alert("Lỗi xử lý ảnh. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      // Reset inputs to allow re-selecting same file if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      
      {/* Hidden Inputs */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
      {/* Input specifically for camera capture */}
      <input 
        ref={cameraInputRef}
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        onChange={handleFileChange}
      />

      <div className={`
          relative w-full aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors
          ${value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
        `}
      >
        {loading ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm">Đang xử lý ảnh...</span>
          </div>
        ) : value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors z-10"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 w-full h-full p-4">
             <p className="text-xs text-gray-400 mb-1">Chọn phương thức tải ảnh</p>
             <div className="flex gap-4 w-full justify-center">
                <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-xl transition-colors flex-1 max-w-[100px]"
                >
                    <Camera size={24} />
                    <span className="text-xs font-bold">Chụp ảnh</span>
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl transition-colors flex-1 max-w-[100px]"
                >
                    <ImageIcon size={24} />
                    <span className="text-xs font-bold">Thư viện</span>
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePicker;
