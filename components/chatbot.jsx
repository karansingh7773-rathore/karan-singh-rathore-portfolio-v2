'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const currentMessages = [...messages, newUserMessage];
      console.log('Sending request to /api/chat');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', data);

      // Check if we have a valid message
      if (data && typeof data.message === 'string' && data.message.trim()) {
        const botMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.message.trim()
        };
        
        console.log('Adding bot message:', botMessage);
        setMessages(prev => {
          const updated = [...prev, botMessage];
          console.log('Updated messages:', updated);
          return updated;
        });
      } else {
        console.error('Invalid or empty message in response:', data);
        throw new Error('Empty or invalid response from AI');
      }

    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage = {
        id: Date.now() + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try asking again.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  console.log('Current messages state:', messages); // Debug log

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window - Increased size */}
      {isChatOpen && (
        <div className="w-96 h-[500px] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col mb-4">
          <div className="p-3 bg-slate-700 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-semibold">Portfolio Assistant</h3>
            <button 
              onClick={() => {
                setMessages([]);
                console.log('Messages cleared');
              }}
              className="text-slate-300 hover:text-white text-sm"
              title="Clear chat"
            >
              Clear
            </button>
          </div>
          <div className="flex-grow p-3 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <div className="text-slate-400 text-sm space-y-2">
                <div>👋 Hi! I'm Karan's portfolio assistant. I can help you with:</div>
                <div className="text-xs space-y-1 ml-2">
                  <div>• "Show me projects" - View all projects</div>
                  <div>• "Contact details" - Get contact info</div>
                  <div>• "What skills does he have?" - Technical expertise</div>
                  <div>• "Tell me about his experience" - Background info</div>
                </div>
                <div className="mt-2">What would you like to know?</div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  console.log('Rendering message:', message, 'at index:', index);
                  return (
                    <div key={message.id || index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm break-words overflow-wrap-anywhere ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-600 text-white'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm prose-invert max-w-none overflow-hidden">
                            <ReactMarkdown
                              components={{
                                // Custom link component with better wrapping
                                a: ({ href, children }) => (
                                  <a 
                                    href={href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-300 hover:text-blue-200 underline transition-colors break-all"
                                    onClick={(e) => {
                                      // Handle internal links differently
                                      if (href?.startsWith('/')) {
                                        e.preventDefault();
                                        window.location.href = href;
                                      }
                                    }}
                                  >
                                    {children}
                                  </a>
                                ),
                                // Style other markdown elements with proper wrapping
                                p: ({ children }) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-white break-words">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 break-words">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 break-words">{children}</ol>,
                                li: ({ children }) => <li className="text-slate-200 break-words">{children}</li>,
                                h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2 break-words">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-bold text-white mb-1 break-words">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-bold text-white mb-1 break-words">{children}</h3>,
                                code: ({ children }) => <code className="bg-slate-700 px-1 py-0.5 rounded text-blue-300 text-xs break-all">{children}</code>,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="break-words overflow-wrap-anywhere whitespace-pre-wrap">
                            {message.content}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-600 text-white px-3 py-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 bg-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={inputValue}
                placeholder="Type your message..."
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-md transition-colors text-sm font-medium"
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110 ml-auto"
        aria-label="Toggle Chat"
      >
        {isChatOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>
    </div>
  );
}