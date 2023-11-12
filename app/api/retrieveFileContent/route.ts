/**
 * API Route - Retrieve File Content
 *
 * This route enables the retrieval of the contents of a specific file stored in the OpenAI API.
 * It is useful for accessing the data within a file for further processing or display.
 * The endpoint accepts GET requests with the 'fileId' as a path parameter.
 * The response includes the file's content, which could be text, JSON, or other formats depending on the file type.
 *
 * Path: /api/retrieveFileContent
 * Method: GET
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function retrieveFileContent(fileId) {
  try {
    // Log the file ID for debugging
    console.log(`Retrieving content for file ID: ${fileId}`);

    // Make the API call to retrieve the file content
    const fileContent = await openai.files.retrieveContent(fileId);

    // Log the retrieved file content for debugging
    console.log('Retrieved File Content:', fileContent);

    return fileContent;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while retrieving file content: ${error}`);
    throw new Error('Failed to retrieve file content');
  }
}

// Example usage
(async () => {
  try {
    const fileId = 'file-abc123'; // Replace with the actual file ID whose content is to be retrieved

    const content = await retrieveFileContent(fileId);
    console.log('File Content:', content);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
