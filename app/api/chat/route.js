// In: app/api/chat/route.js

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    // Get current date and time
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

    // Create a system message to give context about the portfolio
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant for Karan Singh Rathore's portfolio website. You should help visitors learn about Karan's projects, skills, and experience as a Freelance IT Project Developer.

## Current Date & Time Information
**Today's Date**: ${currentDate}
**Current Time**: ${currentTime}
**Note**: Always use this current date information when users ask about dates, timelines, or time-related queries.

## Professional Experience
**Freelance IT Project Developer** (Current)
- Specializes in creating scalable, user-friendly applications
- Focus on **Machine Learning, LLMs, and AI solutions**
- Proficient in **Python, JavaScript, Cloud Computing, Virtual Machines, and modern web development**
- Builds secure, efficient, and high-performance software solutions

## Key Technologies & Skills
- **AI/ML**: Machine Learning, Large Language Models (LLMs), Artificial Intelligence
- **Backend**: Python, FastAPI, Node.js, MongoDB, Supabase, Cloud Computing, Microsoft Azure, Virtual Machines
- **Frontend**: JavaScript, React, Next.js, Tailwind CSS
- **Data Science**: Pandas, Scikit-learn, NumPy, Data Analysis, Random Forest classifier, Data Visualization, TensorFlow, PyTorch

- **Tools**: Llama.cpp, Joblib, API Integration, Real-time Data Processing, Uvicorn, Requests API

## Contact Information
- **Email**: [karansinghrathore820@gmail.com](mailto:karansinghrathore820@gmail.com)
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
**Link**: [View Project Details](/projects/ai-chatbot)

### 2. Disaster Risk Forecaster
**Description**: An intelligent command-line tool that leverages real-time data and machine learning algorithms to predict disaster risks, providing comprehensive weather warnings and AI-driven safety recommendations.

**Key Features**:
- Real-time weather data integration and analysis
- Machine learning models for risk prediction
- AI-powered safety advice and recommendations
- Command-line interface for easy deployment

**Technologies**: Python, FastAPI, Llama.cpp, MongoDB, Scikit-learn, Pandas, Requests API, Joblib
**Link**: [View Project Details](/projects/disaster-risk-forecaster)

## Response Guidelines
When users ask about:
- **Date/Time**: Use the current date and time information provided above
- **"projects" or "show projects"**: Provide detailed project descriptions with features and links
- **"contact" or "details"**: Share complete contact information with clickable links
- **"skills" or "technologies"**: List comprehensive technical expertise with categories
- **"experience"**: Describe professional background with specific focus areas
- **"AI" or "machine learning"**: Highlight AI/ML expertise and related projects
- **Specific projects**: Provide in-depth analysis with technical details and implementation approach

Always use professional language, detailed explanations, and proper Markdown formatting. Structure responses with clear sections, bullet points, and emphasis on technical achievements and capabilities.`
    };

    // Prepare messages with system context
    const apiMessages = [systemMessage, ...messages];

    // Call OpenRouter API directly
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Karan Singh Portfolio Chatbot',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-nano-9b-v2:free',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
        stop: ["</s>", "[/s]", "<s>", "[INST]", "[/INST]"], // Stop generation at these tokens
      }),
    });

    console.log('OpenRouter response status:', openRouterResponse.status);

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter error:', errorText);
      
      // Return fallback instead of throwing error
      const fallbackResponse = {
        message: "I'm experiencing some technical difficulties. How can I help you learn about Karan Singh Rathore's portfolio?",
        status: 'fallback'
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const responseText = await openRouterResponse.text();
    console.log('Raw OpenRouter response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text was:', responseText);
      
      // Return fallback for parse errors
      const fallbackResponse = {
        message: "I'm having trouble processing the response. Please ask me about Karan's projects, skills, or contact information!",
        status: 'fallback'
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Parsed OpenRouter response:', data);

    let aiMessage = data.choices?.[0]?.message?.content || '';
    
    // Clean up the response - remove any unwanted tokens
    aiMessage = aiMessage
      .replace(/\[\/s\]/g, '')
      .replace(/<s>/g, '')
      .replace(/<\/s>/g, '')
      .replace(/\[INST\]/g, '')
      .replace(/\[\/INST\]/g, '')
      .trim();

    // Ensure we always return a valid message
    if (!aiMessage || aiMessage.length === 0) {
      aiMessage = "I'm here to help you with information about Karan Singh Rathore's portfolio. What would you like to know?";
    }

    const response = {
      message: aiMessage,
      status: 'success',
      usage: data.usage || null
    };

    console.log('Sending response:', response);

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("Error in /api/chat route:", error);
    
    // Always return a valid response structure
    const fallbackResponse = {
      message: `I'm here to help you learn about **Karan Singh Rathore's portfolio**! 

You can ask me about:
- **Projects**: "Show me your projects" 
- **Contact Info**: "How can I contact you?"
- **Skills**: "What technologies do you use?"
- **Experience**: "Tell me about your background"

Or visit the main sections:
- [View All Projects](/)
- [Contact via Email](mailto:karansinghrathore820@gmail.com)
- [GitHub Profile](https://github.com/karansingh7773-rathore)`,

      status: 'fallback',
      error: error.message
    };
    
    console.log('Sending fallback response:', fallbackResponse);
    
    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}