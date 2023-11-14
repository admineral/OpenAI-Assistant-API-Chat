import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log('Starting the image processing API call');

  // Retrieving the file and optional prompt from the request body
  const { file: base64Image, prompt: customPrompt } = await request.json();

  // Check for the presence of the file in the request
  if (!base64Image) {
    console.error('No file found in the request');
    return NextResponse.json({ success: false, message: 'No file found' });
  }

  console.log('Received image in base64 format');

  // Use the provided custom prompt or a default prompt if not provided
  const promptText = customPrompt || "Analyze and describe the image in detail. Focus on visual elements like colors, object details, people's positions and expressions, and the environment. Transcribe any text as 'Content: “[Text]”', noting font attributes. Aim for a clear, thorough representation of all visual and textual aspects.";


  console.log(`Using prompt: ${promptText}`);

  // Send the image and prompt to OpenAI for processing
  console.log('Sending request to OpenAI');
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptText },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ]
    });
  
    console.log('Received response from OpenAI');
    console.log('Response:', JSON.stringify(response, null, 2)); // Log the response for debugging
  
    // Extract the analysis from the response
    const analysis = response?.choices[0]?.message?.content;
  
    // Log the analysis
    console.log('Analysis:', analysis);
  
    // Return the analysis
    return NextResponse.json({ success: true, analysis: analysis });
  } catch (error) {
    console.error('Error sending request to OpenAI:', error);
    return NextResponse.json({ success: false, message: 'Error sending request to OpenAI' });
  }
}