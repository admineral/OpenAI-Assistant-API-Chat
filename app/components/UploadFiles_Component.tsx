// app/components/UploadFiles_Configure.tsx
import { prepareUploadFile, deleteUploadedFile } from '../modules/assistantModules';
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger,} from "@/components/ui/tooltip";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Define the structure of the file data
interface FileData {
  name: string;
  fileId?: string;
  status?: 'uploading' | 'uploaded' | 'failed';
}

interface UploadFilesProps {
  onFileIdUpdate: (fileId: string) => void;
  setActiveFileIds: (activeFileIds: string[]) => void; 
}

const UploadFiles_Configure: React.FC<UploadFilesProps> = ({ onFileIdUpdate, setActiveFileIds }) => {  
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [files, setFiles] = useState<FileData[]>([]); // Move files state here

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
  
    const originalFiles: File[] = Array.from(selectedFiles);
    originalFiles.forEach(file => {
      const fileData: FileData = { name: file.name, status: 'uploading' };
      setFiles(currentFiles => [...currentFiles, fileData]);
  
      prepareUploadFile(file, setStatusMessage)
        .then(fileId => {
          if (fileId) {
            setFiles(currentFiles =>
              currentFiles.map(f =>
                f.name === fileData.name ? { ...f, fileId, status: 'uploaded' } : f
              )
            );
            onFileIdUpdate(fileId); 
          } else {
            throw new Error('File ID is undefined');
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          setFiles(currentFiles =>
            currentFiles.map(f =>
              f.name === fileData.name ? { ...f, status: 'failed' } : f
            )
          );
        });
    });
  
    event.target.value = '';
  }, []);

  const handleDelete = useCallback((fileId: string) => {
    const fileIndex = files.findIndex(f => f.fileId === fileId);
    if (fileIndex === -1) return;

    deleteUploadedFile(fileId, setStatusMessage)
      .then(() => {
        setFiles(currentFiles => currentFiles.filter(f => f.fileId !== fileId));
        const newFileIds = files.filter(f => f.fileId !== fileId).map(f => f.fileId as string);
        setActiveFileIds(newFileIds);

        setStatusMessage(`File deleted successfully.`);
      })
      .catch(error => {
        console.error('Error deleting file:', error);
        setStatusMessage(`Failed to delete file.`);
      });
  }, [files]);


  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-6 bg-whitetext-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Knowledge</h1>
          <div></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {files.map((file, index) => (
            <div key={index} className="bg-gray-400 rounded-lg p-4 relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 flex-grow">
                  <span className={`h-3 w-3 rounded-full ${file.status === 'uploading' ? 'bg-orange-500' : file.fileId ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <div className="truncate w-0 flex-grow">
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="font-medium truncate">{file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        {`Filename: ${file.name}`}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                {file.fileId && file.status === 'uploaded' && (
                  <div className="flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => file.fileId && navigator.clipboard.writeText(file.fileId)}
                        >
                          Copy file ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => file.fileId && handleDelete(file.fileId)}
                        >
                          Delete file
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            className="bg-gray-200 text-gray-800 uppercase font-bold text-sm px-6 py-2 rounded shadow hover:bg-gray-300"
            onClick={() => document.getElementById('fileUpload')?.click()}
          >
            Upload files
          </button>
          <input
            id="fileUpload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UploadFiles_Configure;
