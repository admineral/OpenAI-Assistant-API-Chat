import { LoadingCircle } from '../icons';
import React, { useState,useEffect } from 'react';
import UploadFiles_Configure from './UploadFiles_Configure';
import { statusToProgress as statusToProgressRecord } from './statusToProgress';

const statusToProgress: Record<string, number> = statusToProgressRecord;

interface WelcomeFormProps {
  assistantName: string;
  setAssistantName: (name: string) => void;
  assistantDescription: string;
  setAssistantDescription: (description: string) => void;
  assistantModel: string;
  setAssistantModel: (model: string) => void;
  files: File[];
  handleFilesChange: (files: File[]) => void;
  startChatAssistant: () => void;
  isButtonDisabled: boolean;
  isStartLoading: boolean;
  statusMessage: string;
}




const WelcomeForm: React.FC<WelcomeFormProps> = ({


  assistantName,
  setAssistantName,
  assistantDescription,
  setAssistantDescription,
  assistantModel,
  setAssistantModel,
  files,
  handleFilesChange,
  startChatAssistant,
  isButtonDisabled,
  isStartLoading,
  statusMessage,
}) => {
  const [lastProgress, setLastProgress] = useState(0);
  const baseStatusMessage = statusMessage.replace(/ \(\d+ seconds elapsed\)$/, '');
  let progress = 0;
  if (baseStatusMessage in statusToProgress) {
    progress = statusToProgress[baseStatusMessage];
  }

  const [fileIds, setFileIds] = useState<string[]>([]);
  



  const handleFileIdUpdate = (fileId: string) => {
    console.log("WelcomeForm: New file ID added:", fileId);
    setFileIds(currentFileIds => [...currentFileIds, fileId]);
  };
  
  
  const handleActiveFileIdsUpdate = (activeFileIds: React.SetStateAction<string[]>) => {
    setFileIds(activeFileIds);
  };
  
  // If the current progress is 0 and the last progress is not 0,
  // use the last progress value
  if (progress === 0 && lastProgress !== 0) {
    progress = lastProgress;
  } else if (progress !== lastProgress) {
    setLastProgress(progress);
  }

  useEffect(() => {
    console.log("Aktive Datei-IDs:", fileIds);
  }, [fileIds]);

  
  return (
    <div className="border-gray-500 bg-gray-200 sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border-2 sm:w-full">
      <div className="flex flex-col space-y-4 p-7 sm:p-10">
        <h1 className="text-lg font-semibold text-black">
          Welcome to Agent42!
        </h1>
        <form className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Assistant Name"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            required
            className="p-2 border border-gray-200 rounded-md"
          />
          <input
            type="text"
            placeholder="Assistant Description"
            value={assistantDescription}
            onChange={(e) => setAssistantDescription(e.target.value)}
            required
            className="p-2 border border-gray-200 rounded-md"
          />
          <div>
            <button
              type="button"
              onClick={() => setAssistantModel('gpt-4-1106-preview')}
              className={`p-1 border border-gray-400 rounded-md ${assistantModel === 'gpt-4-1106-preview' ? 'bg-blue-500 text-white' : ''}`}
              disabled={process.env.NEXT_PUBLIC_DEMO_MODE === 'true'}
            >
              GPT-4
            </button>
            <button
              type="button"
              onClick={() => setAssistantModel('gpt-3.5-turbo-1106')}
              className={`p-1 border border-gray-400 rounded-md ${assistantModel === 'gpt-3.5-turbo-1106' ? 'bg-blue-500 text-white' : ''}`}
            >
              GPT-3.5
            </button>
          </div>
        </form>
        
        <div className="upload-files-container"> 
          <UploadFiles_Configure 
            onFileIdUpdate={handleFileIdUpdate} 
            setActiveFileIds={handleActiveFileIdsUpdate} 
            files={files}
            setFiles={handleFilesChange}
          />
        </div>
        {/* Start button in its own container */}
        <div className="flex justify-center p-4">
          <button
            type="button"
            onClick={startChatAssistant}
            disabled={isButtonDisabled || !assistantName || !assistantDescription || files.length === 0}
            className="w-full p-2 rounded-md bg-green-500 text-white flex justify-center items-center relative overflow-hidden"
            style={{ 
              position: 'relative', 
              opacity: isButtonDisabled ? 0.5 : 1,
            }}
          >
            {isStartLoading ? (
              <div className="flex flex-col items-center space-y-2">
                <LoadingCircle />
                <p className="text-sm text-gray-700">{statusMessage}</p>
              </div>
            ) : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;
