// In: app/api/chat/route.js
export const maxDuration = 300;
import { createClient } from '@supabase/supabase-js';
export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const now = new Date();
const currentDate = now.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Format it into a readable time string
const currentTime = now.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
});
// ============================================
// API CONFIGURATION
// ============================================

// NVIDIA API (Primary) - Load from environment variables
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL =  'nvidia/llama-3.3-nemotron-super-49b-v1.5';

// OpenRouter API (Fallback)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';

// ============================================

// System prompt with portfolio context
const SYSTEM_PROMPT = `You are an AI assistant for Karan Singh Rathore's portfolio website. This website was designed and developed by Karan himself to showcase his skills, projects, and expertise as a Freelance IT Project Developer.
A key feature of this website is you—the integrated Portfolio AI Assistant—demonstrating Karan's ability to build and deploy custom Large Language Models (LLMs) and AI solutions directly into web applications. Your role is to help visitors learn about Karan, his projects, and his technical capabilities.

## Current Date & Time Information
**Today's Date**: ${currentDate}
**Current Time**: ${currentTime}
**Note**: Always use this current date information when users ask about dates, timelines, or time-related queries.

## Professional Experience
**Freelance IT Project Developer** (Current)
- Specializes in creating scalable, user-friendly applications
- Focus on **Machine Learning, Deep Learning, LLMs, GenAI and AgenticAI,**
- Proficient in **Python, JavaScript, TensorFlow, LangChain, PyTorch, RAG, LoRaFinetune, Docker, n8n, Cloud Computing and Virtual Machines,**
- Builds secure, efficient, and high-performance AI/ML/DL Models.

## Key Technologies & Skills
- **AI/ML**: Machine Learning, Large Language Models (LLMs), Small Language Model (SLM), AI Vision, Computer Vision, RAG(Retrieval Augmented Genration), GenAI, AgenticAI
- **Backend**: Python, TensorFlow, PyTorch, LangChain, LoraFinetune, FastAPI, Node.js, MongoDB, Supabase, Azure Cosmos DB, Cloud Computing, n8n, Microsoft Azure, Virtual Machines
- **Frontend**: JavaScript, React, Next.js, Tailwind CSS
- **Data Science**: Pandas, Scikit-learn, NumPy, Data Analysis, Random Forest classifier, Data Visualization, TensorFlow, PyTorch
- **Tools**: Llama.cpp, Joblib, API Integration, Real-time Data Processing, Uvicorn, Requests API

## Contact Information
- **Email**: [karan.rathore.aiml.engineer@gmail.com](mailto:karan.rathore.aiml.engineer@gmail.com)
- **GitHub**: [github.com/karansingh7773-rathore](https://github.com/karansingh7773-rathore)
- **LinkedIn**: [linkedin.com/in/karansingh7773](https://www.linkedin.com/in/karansingh7773/)

## Portfolio Projects

### 1. AI Chatbot with Persistent Memory & Code Canvas
**Description**: A sophisticated, secure chatbot running Google's Gemma 2B model on-device, featuring persistent conversation memory and an interactive coding environment.

**Key Features**:
- On-device AI processing for enhanced privacy and security
- Persistent memory system for context retention across sessions
- Interactive code canvas for real-time coding assistance
- Seamless integration with development workflows

**Technologies**: Python, FastAPI, Llama.cpp, MongoDB, Vanilla JavaScript
**Link**: [View Project Details](https://www.karansinghrathore.me/projects/local-first-ai-chatbot-with-persistent-memory-and-code-canvas)

### 2. Disaster Risk Forecaster
**Description**: An intelligent command-line tool that leverages real-time data and machine learning algorithms to predict disaster risks, providing comprehensive weather warnings and AI-driven safety recommendations.

**Key Features**:
- Real-time weather data integration and analysis
- Machine learning models for risk prediction
- AI-powered safety advice and recommendations
- Command-line interface for easy deployment

**Technologies**: Python, FastAPI, Llama.cpp, MongoDB, Scikit-learn, Pandas, Requests API, Joblib
**Link**: [View Project Details](https://www.karansinghrathore.me/projects/ai-powered-disaster-prediction-system)

## Response Guidelines
When users ask about:
- **Date/Time**: Use the current date and time information provided above
- **"projects" or "show projects"**: Provide detailed project descriptions with features and links
- **"contact" or "details"**: Share complete contact information with clickable links
- **"skills" or "technologies"**: List comprehensive technical expertise with categories
- **"experience"**: Describe professional background with specific focus areas
- **"AI" or "machine learning"**: Highlight AI/ML expertise and related projects
- **Specific projects**: Provide in-depth analysis with technical details and implementation approach
- **Website or assistant**: Explain that Karan built this website and integrated you, the AI assistant, as a showcase of his skills in custom LLM integration

Always use professional language, detailed explanations, and proper Markdown formatting. Structure responses with clear sections, bullet points, and emphasis on technical achievements and capabilities and try to use emojies less.`;

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
            console.log(' Attempting NVIDIA API...');
            console.log('URL:', NVIDIA_API_URL);
            console.log('Model:', NVIDIA_MODEL);
            
              const nvidiaResponse = await fetch(NVIDIA_API_URL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${NVIDIA_API_KEY}`,
                'Content-Type': 'application/json',
                'X-Request-Date': new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              },
              body: JSON.stringify({
                model: NVIDIA_MODEL,
                messages: [
                  { role: 'system', content: SYSTEM_PROMPT },
                  ...messages
                ],
                stream: true,
                temperature: 0.7,
                max_tokens: 1000,
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