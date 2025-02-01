import React, { useState, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadPreviewProps {
  maxSizeInMB?: number;
  onImageUpload?: (file: File) => void;
  onImageRemove?: () => void;
}

const ImageUpload: React.FC<ImageUploadPreviewProps> = ({
  maxSizeInMB = 5,
  onImageUpload,
  onImageRemove
}) => {
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`Image size should be less than ${maxSizeInMB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageUpload?.(file);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (): void => {
    setPreview('');
    setError('');
    onImageRemove?.();
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-4">
        {!preview ? (
          <div className="relative">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white/10"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to {maxSizeInMB}MB
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative w-full h-50 overlfow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-50 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;