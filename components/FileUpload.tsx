
import React, { useState } from 'react';

interface FileUploadProps {
  onFileChange: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleInputFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      onFileChange(filesArray);
    }
  };

  return (
    <div className="space-y-6">
      <label className="block group cursor-pointer">
        <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-brand-border rounded-3xl bg-transparent transition-all group-hover:border-brand-red/50 group-hover:bg-white/5">
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-12 h-12 bg-brand-dark border border-brand-border rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:bg-brand-red">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-300">Suelta tus archivos aquí</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">PDF · CSV · IMÁGENES</p>
          </div>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            multiple 
            onChange={handleInputFiles}
            accept=".pdf,.csv,.png,.jpg,.jpeg"
          />
        </div>
      </label>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-brand-dark border border-brand-border rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-red/10 rounded-lg text-brand-red">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                   </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-200 truncate max-w-[180px]">{file.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-brand-red animate-pulse"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
