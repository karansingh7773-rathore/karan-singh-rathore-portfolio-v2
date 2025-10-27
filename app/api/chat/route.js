export const maxDuration = 300;
export const runtime = 'edge';

// Format current date and time
const now = new Date();
const currentDate = now.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const currentTime = now.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
});

// ============================================
// API CONFIGURATION
// ============================================

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1.5';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';

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

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Try NVIDIA API first
          if (NVIDIA_API_KEY && NVIDIA_API_URL) {
            console.log('🚀 Attempting NVIDIA API...');
            
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
              await processStream(nvidiaResponse, controller, encoder);
              return;
            } else {
              const errorText = await nvidiaResponse.text();
              console.error('❌ NVIDIA failed:', nvidiaResponse.status, errorText);
              throw new Error('NVIDIA API unavailable');
            }
          } else {
            throw new Error('NVIDIA API key not configured');
          }

        } catch (nvidiaError) {
          console.error('❌ NVIDIA error:', nvidiaError.message);
          console.log('🔄 Falling back to OpenRouter...');

          try {
            const openRouterResponse = await fetch(OPENROUTER_API_URL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.karansinghrathore.me',
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
              throw new Error('OpenRouter API unavailable');
            }

            console.log('✅ Using OpenRouter');
            await processStream(openRouterResponse, controller, encoder);

          } catch (fallbackError) {
            console.error('❌ All APIs failed:', fallbackError);
            
            const errorMsg = JSON.stringify({ 
              content: 'Sorry, the AI service is temporarily unavailable. Please try again later.' 
            });
            controller.enqueue(encoder.encode(`data: ${errorMsg}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        }

        async function processStream(response, controller, encoder) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                if (buffer.trim()) {
                  processLine(buffer, controller, encoder);
                }
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                break;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.trim()) {
                  processLine(line, controller, encoder);
                }
              }
            }
          } catch (streamError) {
            console.error('Stream error:', streamError);
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        }

        function processLine(line, controller, encoder) {
          if (!line.startsWith('data: ')) return;
          
          const data = line.slice(6).trim();
          
          if (data === '[DONE]') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            return;
          }

          if (!data) return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              const payload = JSON.stringify({ content });
              controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
            }
          } catch (parseError) {
            console.warn('Skipped malformed chunk:', data.substring(0, 50));
          }
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (error) {
    console.error('❌ API route error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}