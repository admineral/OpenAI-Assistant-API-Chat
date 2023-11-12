/**
 * API Route - Translate Audio to English
 *
 * This route translates the provided audio file into English using the Whisper model.
 * It accepts an audio file and returns its English translation.
 *
 * Path: /api/translateAudio
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});

export async function POST(req) {
  const { audioFile, model } = req.body;

  try {
    const translation = await openai.audio.translations.create({
      model: model || 'whisper-1',
      file: audioFile
    });
    return translation.text;
  } catch (error) {
    console.error('Error translating audio:', error);
  }
}
