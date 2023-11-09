// app/api/startChat/route.ts

// This file defines the API route for starting a chat session in an application.
// It handles POST requests for uploading a file to the OpenAI API for a chat session.
// The route processes the file from the request, saves it temporarily, and then
// uploads it to OpenAI, returning the file ID for further operations.

import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { createReadStream } from 'fs'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Logging the start of the upload process
  console.log(`Upload API call started`)

  // Retrieving the file from the form data
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  // Handle the case where no file is found in the request
  if (!file) {
    console.log('No file found in the request')
    return NextResponse.json({ success: false })
  }

  // Convert file to buffer and write to a temporary location
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const path = `/tmp/${file.name}`
  await writeFile(path, buffer)
  console.log(`File written to ${path}`)

  try {
    // Start uploading the file to OpenAI
    console.log('Starting file upload to OpenAI')
    const fileForRetrieval = await openai.files.create({
      file: createReadStream(path),
      purpose: "assistants",
    });
    console.log(`File uploaded, ID: ${fileForRetrieval.id}`)

    // Respond with success and the file ID
    return NextResponse.json({ success: true, fileId: fileForRetrieval.id })
  } catch (error) {
    // Log and handle any errors during file upload
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Error uploading file' });
  }
}