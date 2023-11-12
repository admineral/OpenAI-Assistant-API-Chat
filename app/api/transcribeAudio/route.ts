/**
 * API Route - Transcribe Audio to Text
 *
 * This route transcribes the provided audio file into text using the Whisper model.
 * It accepts an audio file and returns its transcription.
 *
 * Path: /api/transcribeAudio
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});

export async function POST(req) {
  const { audioFile, model } = req.body;

  try {
    const transcript = await openai.audio.transcriptions.create({
      model: model || 'whisper-1',
      file: audioFile
    });
    return transcript.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
  }
}
