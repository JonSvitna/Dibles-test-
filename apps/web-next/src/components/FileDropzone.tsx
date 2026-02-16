'use client';

import React, { useState } from 'react';

interface FileDropzoneProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
}

export default function FileDropzone({ onFileSelect, accept = '.xlsx,.xls,.csv' }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };
  
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-4 text-6xl">📁</div>
      {selectedFile ? (
        <div>
          <p className="text-lg font-semibold text-green-700 mb-2">File Selected</p>
          <p className="text-sm text-gray-600">{selectedFile.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Drag and drop your file here
          </p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileInput}
            />
          </label>
          <p className="text-xs text-gray-500 mt-4">
            Supported formats: Excel (.xlsx, .xls) and CSV (.csv)
          </p>
        </div>
      )}
    </div>
  );
}
