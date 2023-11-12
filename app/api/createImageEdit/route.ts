/**
 * API Route - Create Image Edit
 *
 * This route allows for creating edited or extended images based on an original image and a textual prompt.
 * It utilizes the DALL-E model to apply the described edits to the original image.
 * The endpoint accepts POST requests with an image file, an optional mask file, and a prompt in the request body.
 * The response includes a list of the edited image objects, typically provided as URLs.
 *
 * Path: /api/createImageEdit
 * Method: POST
 */

import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function createImageEdit(imagePath, maskPath, prompt) {
  try {
    // Log the image path and prompt for debugging
    console.log(`Creating image edit for prompt: ${prompt}`);

    // Read the image and mask files
    const image = fs.createReadStream(imagePath);
    const mask = maskPath ? fs.createReadStream(maskPath) : null;

    // Make the API call to create an image edit
    const editedImage = await openai.images.edit({
      image,
      mask,
      prompt
    });

    // Log the edited image for debugging
    console.log('Edited Image:', editedImage.data);

    return editedImage.data;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while creating image edit: ${error}`);
    throw new Error('Failed to create image edit');
  }
}

// Example usage
(async () => {
  try {
    const imagePath = 'otter.png'; // Replace with the actual path to your image
    const maskPath = 'mask.png'; // Replace with the actual path to your mask (optional)
    const prompt = 'A cute baby sea otter wearing a beret'; // Example prompt

    const images = await createImageEdit(imagePath, maskPath, prompt);
    console.log('Generated Image Edits:', images);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
