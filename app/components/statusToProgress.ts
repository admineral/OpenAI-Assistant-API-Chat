export type StatusToProgressType = {
  [status: string]: number;
};

export const statusToProgress: StatusToProgressType = {
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