'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

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

    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Create bot message placeholder
    const botMessageId = Date.now() + 1;
    const botMessage = {
      id: botMessageId,
      role: 'assistant',
      content: ''
    };

    setMessages(prev => [...prev, botMessage]);

    try {
      const currentMessages = [...messages, newUserMessage];
      
      // Create abort controller for cleanup
      abortControllerRef.current = new AbortController();

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
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsLoading(false);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            try {
              const parsed = JSON.parse(data);
              
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              
              if (parsed.content) {
                accumulatedContent += parsed.content;
                
                // Update the bot message in real-time
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId 
                    ? { ...msg, content: accumulatedContent }
                    : msg
                ));
              }
            } catch (parseError) {
              console.error('Parse error:', parseError);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error in chat:', error);
      
      // Remove the empty bot message and add error message
      setMessages(prev => prev.filter(msg => msg.id !== botMessageId));
      
      const errorMessage = {
        id: Date.now() + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try asking again.`
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window with Animations */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-96 h-[500px] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative p-3 bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg flex justify-between items-center border-b border-slate-600"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                  className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
                />
                <h3 className="text-white font-semibold">Portfolio Assistant</h3>
              </div>
              <button 
                onClick={() => {
                  setMessages([]);
                }}
                className="text-slate-300 hover:text-white text-sm transition-colors"
                title="Clear chat"
              >
                Clear
              </button>
            </motion.div>

            {/* Messages Area */}
            <div className="relative flex-grow p-3 overflow-y-auto space-y-2 chatbot-messages">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-slate-400 text-sm space-y-2"
                >
                  <div> Hi! I'm Karan's portfolio assistant. I can help you with:</div>
                  <div className="text-xs space-y-1 ml-2">
                    <div>• "Show me projects" - View all projects</div>
                    <div>• "Contact details" - Get contact info</div>
                    <div>• "What skills does he have?" - Technical expertise</div>
                    <div>• "Tell me about his experience" - Background info</div>
                  </div>
                  <div className="mt-2">What would you like to know?</div>
                </motion.div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id || index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm break-words overflow-wrap-anywhere relative overflow-hidden ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'bg-slate-700/80 text-white backdrop-blur-sm border border-slate-600/50'
                      }`}>
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 -left-full hover:left-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 pointer-events-none" />
                        
                        <div className="relative z-10">
                          {message.role === 'assistant' ? (
                            <div className="prose prose-sm prose-invert max-w-none overflow-hidden">
                              <ReactMarkdown
                                components={{
                                  a: ({ href, children }) => (
                                    <a 
                                      href={href} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-300 hover:text-blue-200 underline transition-colors break-all"
                                      onClick={(e) => {
                                        if (href?.startsWith('/')) {
                                          e.preventDefault();
                                          window.location.href = href;
                                        }
                                      }}
                                    >
                                      {children}
                                    </a>
                                  ),
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
                                {message.content || ' '}
                              </ReactMarkdown>
                              {/* Cursor removed - no blinking cursor */}
                            </div>
                          ) : (
                            <div className="break-words overflow-wrap-anywhere whitespace-pre-wrap">
                              {message.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
              
              {/* Typing Indicator - Only show when starting */}
              {isLoading && messages.length > 0 && !messages[messages.length - 1].content && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-700/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-slate-600/50">
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Form */}
            <motion.form
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="relative p-3 border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm"
            >
              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 bg-slate-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all border border-slate-600/50"
                  value={inputValue}
                  placeholder="Type your message..."
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
                >
                  {isLoading ? '...' : 'Send'}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button with Animations */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isChatOpen 
            ? '0 0 0 0 rgba(59, 130, 246, 0)' 
            : ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 20px rgba(59, 130, 246, 0)'],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          },
        }}
        className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform duration-200 ml-auto border-2 border-slate-700/50"
        aria-label="Toggle Chat"
      >
        <motion.div
          animate={{ rotate: isChatOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isChatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <img
              src="/styles/icons8-jasper-ai-30-white.png"
              alt="Jasper AI Logo"
              width={32}
              height={32}
              style={{ display: 'block' }}
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </motion.div>
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-slate-300 mt-1 font-medium select-none"
      >
        Ask me
      </motion.div>
    </div>
  );
}