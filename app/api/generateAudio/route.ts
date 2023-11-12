/**
 * API Route - Generate Audio from Text
 *
 * This route creates audio from provided text using a selected TTS model and voice.
 * The output is an audio file generated from the input text.
 *
 * Path: /api/generateAudio
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});

export async function POST(req) {
  const { model, input, voice, speed, format } = req.body;

  try {
    const response = await openai.audio.speech.create({
      model: model || 'tts-1',
      input,
      voice,
      response_format: format || 'mp3',
      speed: speed || 1
    });
    return response;
  } catch (error) {
    console.error('Error creating speech:', error);
  }
}
