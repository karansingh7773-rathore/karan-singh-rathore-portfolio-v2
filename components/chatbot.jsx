// In: components/chatbot.jsx

'use client';

import { useState } from 'react';
// This hook provides everything we need: messages, input, and the handleSubmit function
import { useChat } from '@ai-sdk/react';

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // This hook now manages all the chat logic correctly
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      {isChatOpen && (
        <div className="w-80 h-96 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col mb-4">
          <div className="p-3 bg-slate-700 rounded-t-lg">
            <h3 className="text-white font-semibold">AI Assistant</h3>
          </div>
          <div className="flex-grow p-3 overflow-y-auto">
            {messages.map(m => (
              <div key={m.id} className={`text-white text-sm py-1.5 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-600'}`}>
                  {m.content}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700 flex items-center">
            <input
              className="flex-grow p-2 bg-slate-600 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              placeholder="Ask me anything..."
              onChange={handleInputChange} // useChat provides this function
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md disabled:bg-slate-500"
              disabled={!input}
            >
              Send
            </button>
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