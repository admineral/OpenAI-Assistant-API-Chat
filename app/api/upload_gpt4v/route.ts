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
  const promptText = customPrompt || "Examine and articulate a detailed description of the presented image, focusing on clarity and context. Pay close attention to visual elements such as color schemes, object details, the positioning and expressions of people, and the overall environment. For textual content within the image, provide a verbatim transcription, framed as ‘Content: “[Exact Text]”’, and note textual attributes like font size, style, and color. The objective is to deliver a comprehensive, nuanced depiction of the scene, ensuring all visual and textual components are accurately and thoroughly represented.?";
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
