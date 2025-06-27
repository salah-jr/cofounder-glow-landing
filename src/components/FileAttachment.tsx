
import React, { useRef } from "react";
import { Paperclip, X } from "lucide-react";
import { Button } from "./ui/button";

export interface FileItem {
  id: string;
  file: File;
  preview: string | null;
}

interface FileAttachmentProps {
  files: FileItem[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (fileId: string) => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const filesArray = Array.from(e.target.files);
      onAddFiles(filesArray);
      
      // Clear input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderPreview = (file: FileItem) => {
    if (file.preview && file.file.type.startsWith('image/')) {
      return (
        <div className="relative w-10 h-10 rounded-md overflow-hidden">
          <img 
            src={file.preview} 
            alt={file.file.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    return (
      <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center">
        <span className="text-xs text-white/70">{file.file.name.split('.').pop()}</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-4 w-4 mr-1" />
          <span className="text-xs">Attach</span>
        </Button>
        
        {files.length > 0 && (
          <div className="ml-2 text-xs text-white/60">
            {files.length} file{files.length !== 1 ? 's' : ''} attached
          </div>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-black/20 rounded-md">
          {files.map(file => (
            <div 
              key={file.id} 
              className="flex items-center bg-white/5 p-1 pr-2 rounded-md"
            >
              {renderPreview(file)}
              <div className="ml-2 flex flex-col overflow-hidden">
                <span className="text-xs font-medium text-white/90 truncate max-w-[120px]">
                  {file.file.name}
                </span>
                <span className="text-[10px] text-white/60 truncate">
                  {(file.file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onRemoveFile(file.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
