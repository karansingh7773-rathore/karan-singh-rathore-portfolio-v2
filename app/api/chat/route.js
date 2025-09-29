// In: app/api/chat/route.js

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

const openai = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // Your key must be in .env.local
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('mistralai/mistral-7b-instruct:free'),
      messages,
    });

    // This is the correct V3 response helper that was previously failing
    return result.toAIStreamResponse();

  } catch (error) {
    console.error("Error in /api/chat route:", error);
    const errorMessage = error.message || "An internal server error occurred.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}