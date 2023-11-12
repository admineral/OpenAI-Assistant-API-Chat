// pages/api/retrieveAssistantFile.js

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      // Extract assistantId and fileId from the request body
      const { assistantId, fileId } = req.body;

      // Log the received assistant ID and file ID for debugging
      console.log(`Received request with assistantId: ${assistantId} and fileId: ${fileId}`);

      // Retrieve the file associated with the assistant using the OpenAI API
      const assistantFile = await openai.beta.assistants.files.retrieve(assistantId, fileId);

      // Log the retrieved assistant file for debugging
      console.log(`Retrieved assistant file: ${assistantFile}`);

      // Return the retrieved assistant file as a JSON response
      res.status(200).json({ file: assistantFile });
    } else {
      // Handle any non-POST requests
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Log any errors that occur during the process and return a server error response
    console.error(`Error occurred: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
