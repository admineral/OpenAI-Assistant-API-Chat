/**
 * API Route - Upload Files
 * 
 * This API route is designed for initiating a chat session within an application.
 * It handles the processing and uploading of a file necessary for starting a chat session
 * with the OpenAI API. The route manages the receipt of a file through POST request,
 * temporarily saves it, and then uploads it to OpenAI, ultimately returning the
 * file ID for use in further chat-related operations.
 * 
 * Path: /api/upload
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { createReadStream } from 'fs';
import OpenAI from "openai";

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Logging the start of the upload process
  console.log(`Upload API call started`);

  // Retrieving the file from the form data
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  // Check if a file was provided in the request
  if (!file) {
    console.log('No file found in the request');
    return NextResponse.json({ success: false });
  }

  // Convert file to buffer and write to a temporary location
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const path = `/tmp/${file.name}`;
  await writeFile(path, buffer);
  console.log(`File written to ${path}`);

  try {
    // Uploading the file to OpenAI
    console.log('Starting file upload to OpenAI');
    const fileForRetrieval = await openai.files.create({
      file: createReadStream(path),
      purpose: "assistants",
    });
    console.log(`File uploaded, ID: ${fileForRetrieval.id}`);

    // Respond with the file ID
    return NextResponse.json({ success: true, fileId: fileForRetrieval.id });
  } catch (error) {
    // Log and respond to any errors during the upload process
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Error uploading file' });
  }
}