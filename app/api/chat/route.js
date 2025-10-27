// In: app/api/chat/route.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================
// API CONFIGURATION
// ============================================

// NVIDIA API (Primary) - Load from environment variables
const NVIDIA_API_URL = process.env.NVIDIA_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';

// OpenRouter API (Fallback)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';

// ============================================

// System prompt with portfolio context
const SYSTEM_PROMPT = `You are Karan Singh Rathore's AI portfolio assistant. You help visitors learn about Karan's professional background, skills, and projects.

Key information about Karan:
- Full-stack developer specializing in React, Next.js, Node.js
- Experience with modern web technologies and cloud platforms
- Strong focus on user experience and performance optimization
- Available for freelance projects and collaborations

When answering questions:
- Be professional yet friendly
- Provide specific details when available
- Direct users to relevant portfolio sections
- Keep responses concise and helpful`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let apiUsed = 'none';

        try {
          // Try NVIDIA API first (only if API key exists)
          if (NVIDIA_API_KEY && NVIDIA_API_URL) {
            console.log('🚀 Attempting NVIDIA API...');
            console.log('URL:', NVIDIA_API_URL);
            console.log('Model:', NVIDIA_MODEL);
            
            const nvidiaResponse = await fetch(NVIDIA_API_URL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${NVIDIA_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: NVIDIA_MODEL,
                messages: [
                  { role: 'system', content: SYSTEM_PROMPT },
                  ...messages
                ],
                stream: true,
                temperature: 0.7,
                max_tokens: 500,
                top_p: 1,
              })
            });

            if (nvidiaResponse.ok) {
              console.log('✅ Using NVIDIA API');
              apiUsed = 'nvidia';
              await processStream(nvidiaResponse, controller, encoder);
              return; // Success, exit
            } else {
              const errorText = await nvidiaResponse.text();
              console.error('❌ NVIDIA API failed:', nvidiaResponse.status, errorText);
              throw new Error(`NVIDIA API error: ${nvidiaResponse.status}`);
            }
          } else {
            console.log('⚠️ NVIDIA API key not configured, skipping...');
            throw new Error('NVIDIA API key not configured');
          }

        } catch (nvidiaError) {
          console.error('❌ NVIDIA API error:', nvidiaError.message);
          console.log('🔄 Falling back to OpenRouter...');

          try {
            // Fallback to OpenRouter
            const openRouterResponse = await fetch(OPENROUTER_API_URL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                'X-Title': 'Karan Portfolio Chatbot'
              },
              body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                  { role: 'system', content: SYSTEM_PROMPT },
                  ...messages
                ],
                stream: true,
                temperature: 0.7,
                max_tokens: 500
              })
            });

            if (!openRouterResponse.ok) {
              const errorText = await openRouterResponse.text();
              console.error('❌ OpenRouter failed:', openRouterResponse.status, errorText);
              throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
            }

            console.log('✅ Using OpenRouter (Fallback)');
            apiUsed = 'openrouter';
            await processStream(openRouterResponse, controller, encoder);

          } catch (fallbackError) {
            console.error('❌ Both APIs failed:', fallbackError);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              error: 'Both API services are unavailable. Please try again later.' 
            })}\n\n`));
            controller.close();
          }
        }

        async function processStream(response, controller, encoder) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                controller.close();
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n').filter(line => line.trim() !== '');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6).trim();
                  
                  if (data === '[DONE]') {
                    controller.close();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;

                    if (content) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }
                  } catch (parseError) {
                    console.error('Parse error:', parseError, 'Data:', data);
                  }
                }
              }
            }
          } catch (streamError) {
            console.error('Stream processing error:', streamError);
            controller.close();
          }
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API route error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}