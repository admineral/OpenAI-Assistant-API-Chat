import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { LoadingCircle } from '../icons';
import React, { useState } from 'react';

const statusToProgress = {
  'Initializing chat assistant...': 5,
  'Starting upload...': 10,
  'Preparing file for upload...': 15,
  'File is an image, getting description...': 20,
  'Converting image to base64...': 25,
  'Getting image description...': 30,
  'Creating description file...': 35,
  'Uploading description file...': 40,
  'Description file uploaded successfully. File ID: ': 45,
  'Uploading file...': 50,
  'File uploaded successfully. File ID: ': 55,
  'Upload complete..': 60,
  'Create Assistant...': 65,
  'Assistant created...': 70,
  'Creating thread...': 75,
  'Received thread_ID...': 80,
  'Running assistant...': 85,
  'Received Run_ID..': 90,
  'checking status...': 95,
  'Run completed...': 100,
  'Received messages...': 105,
  'Adding messages to chat...': 110,
  'Done': 115,
};

const WelcomeForm = ({
  assistantName,
  setAssistantName,
  assistantDescription,
  setAssistantDescription,
  assistantModel,
  setAssistantModel,
  file,
  handleFileChange,
  startChatAssistant,
  isButtonDisabled,
  isStartLoading,
  statusMessage,
}) => {
  const [lastProgress, setLastProgress] = useState(0);
  const baseStatusMessage = statusMessage.replace(/ \(\d+ seconds elapsed\)$/, '');
  let progress = statusToProgress[baseStatusMessage] || 0;

  // If the current progress is 0 and the last progress is not 0,
  // use the last progress value
  if (progress === 0 && lastProgress !== 0) {
    progress = lastProgress;
  } else if (progress !== lastProgress) {
    setLastProgress(progress);
  }
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
              //######################################
              //just delete the disabled prop to enable GPT4
              //disabled GPT4 because its expensive in the Demo
              disabled={process.env.NEXT_PUBLIC_DEMO_MODE === 'true'}
              //######################################
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

          <div
            className="drop-area border-2 border-dashed border-gray-400 rounded-md p-4 text-center"
            onClick={() => {
              const fileInput = document.getElementById('file-input');
              if (fileInput) {
                fileInput.click();
              }
            }}
          >
            <input
              id="file-input"
              type="file"
              accept=".c,.cpp,.csv,.docx,.html,.java,.json,.md,.pdf,.pptx,.txt,.tex,image/jpeg,image/png"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              required
              style={{ display: 'none' }}
            />
            {file ? (
              <>
                <FontAwesomeIcon icon={faFileUpload} className="text-green-500 mb-2" />
                <p className="text-gray-700 text-lg font-bold">{file.name}</p>
              </>
            ) : (
              <p className="text-gray-500">Select a File</p>
            )}
          </div>

          <button
  type="button"
  onClick={startChatAssistant}
  disabled={isButtonDisabled || !assistantName || !assistantDescription || !file}
  className={`p-2 rounded-md flex justify-center items-center relative overflow-hidden ${isButtonDisabled ? 'bg-gray-500 text-gray-300' : 'bg-green-500 text-white'}`}
>
  <div 
    style={{ 
      position: 'absolute', 
      left: 0, 
      top: 0, 
      height: '100%', 
      width: `${progress}%`, 
      background: 'rgba(0, 0, 0, 0.2)' 
    }} 
  />
  {isStartLoading ? (
    <div className="flex flex-col items-center space-y-2">
      <LoadingCircle />
      <p className="text-sm text-gray-700">{statusMessage}</p>
    </div>
  ) : "Start"}
</button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeForm;
