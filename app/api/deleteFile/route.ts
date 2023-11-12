/**
 * API Route - Delete File
 *
 * This route provides the functionality to delete a specific file from the OpenAI API.
 * Deleting a file removes it permanently from the API, making it inaccessible for future use.
 * The endpoint accepts DELETE requests with the 'fileId' as a path parameter.
 * The response confirms the deletion status of the file, indicating whether the operation was successful.
 *
 * Path: /api/deleteFile
 * Method: DELETE
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function deleteFile(fileId) {
  try {
    // Log the file ID for debugging
    console.log(`Deleting file with ID: ${fileId}`);

    // Make the API call to delete the file
    const deletedFile = await openai.files.del(fileId);

    // Log the deletion status for debugging
    console.log('Deleted File:', deletedFile);

    return deletedFile;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while deleting file: ${error}`);
    throw new Error('Failed to delete file');
  }
}

// Example usage
(async () => {
  try {
    const fileId = 'file-abc123'; // Replace with the actual file ID to be deleted

    const result = await deleteFile(fileId);
    console.log('File Deletion Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
