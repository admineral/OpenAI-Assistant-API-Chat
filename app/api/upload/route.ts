import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { createReadStream } from 'fs'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log(`Upload API call started`)
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    console.log('No file found in the request')
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const path = `/tmp/${file.name}`
  await writeFile(path, buffer)
  console.log(`File written to ${path}`)

  try {
    console.log('Starting file upload to OpenAI')
    const fileForRetrieval = await openai.files.create({
      file: createReadStream(path),
      purpose: "assistants",
    });
    console.log(`File uploaded, ID: ${fileForRetrieval.id}`)

    return NextResponse.json({ success: true, fileId: fileForRetrieval.id })
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Error uploading file' });
  }
}