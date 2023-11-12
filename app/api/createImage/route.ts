/**
 * API Route - Create Image with DALL-E
 *
 * This route enables the creation of images using the DALL-E model via the OpenAI API.
 * It takes a textual description and generates images that match the provided prompt.
 * The endpoint accepts POST requests with parameters like prompt, model, quality, size, and style.
 * The response includes a list of generated image objects, typically provided as URLs.
 *
 * Path: /api/createImage
 * Method: POST
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is securely configured
});

export async function createImage(prompt, model = 'dall-e-3', quality = 'standard', size = '1024x1024', style = 'vivid', n = 1) {
  try {
    // Log the prompt for debugging
    console.log(`Generating image for prompt: ${prompt}`);

    // Make the API call to create an image
    const generatedImage = await openai.images.generate({
      model,
      prompt,
      n,
      quality,
      size,
      style
    });

    // Log the generated image for debugging
    console.log('Generated Image:', generatedImage.data);

    return generatedImage.data;
  } catch (error) {
    // Log and handle errors appropriately
    console.error(`Error while generating image: ${error}`);
    throw new Error('Failed to generate image');
  }
}

// Example usage
(async () => {
  try {
    const prompt = 'A cute baby sea otter'; // Example prompt
    const images = await createImage(prompt);
    console.log('Generated Images:', images);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
