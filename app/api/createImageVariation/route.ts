/**
 * API Route - Create Image Variation
 *
 * This route allows for creating variations of a given image using the DALL-E model via the OpenAI API.
 * It generates new images that are variations of the provided original image.
 * The endpoint accepts POST requests with the original image file and optional parameters like model, size, and n.
 * The response includes a list of the generated image variation objects, typically provided as URLs.
 *
 * Path: /api/createImageVariation
 * Method: POST
 */

import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function createImageVariation(imagePath, model = 'dall-e-2', n = 1, size = '1024x1024') {
  try {
    // Log the image path for debugging
    console.log(`Creating image variation for image: ${imagePath}`);

    // Read the image file
    const image = fs.createReadStream(imagePath);

    // Make the API call to create an image variation
    const imageVariation = await openai.images.createVariation({
      image,
      model,
      n,
      size
    });

    // Log the generated image variation for debugging
    console.log('Generated Image Variations:', imageVariation.data);

    return imageVariation.data;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while creating image variation: ${error}`);
    throw new Error('Failed to create image variation');
  }
}

// Example usage
(async () => {
  try {
    const imagePath = 'otter.png'; // Replace with the actual path to your image

    const variations = await createImageVariation(imagePath);
    console.log('Generated Image Variations:', variations);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
