import React, { useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { useChat } from './context/ChatContext';

const App: React.FC = () => {
  const { state, initializeSession, sendMessage, clearChat } = useChat();
  const { messages, isLoading, error } = state;

  // Initialize chat session on component mount
  useEffect(() => {
    initializeSession();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-neutral-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="py-4 px-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary-600">
              AI-Powered Customer Chatbot
            </h1>
            <a 
              href="https://github.com/Latex999/ai-powered-customer-chatbot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-neutral-500 hover:text-neutral-700"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-soft overflow-hidden border border-neutral-200 flex flex-col">
          <ChatHeader onClearChat={clearChat} />
          
          {error && (
            <div className="p-3 bg-red-50 border-b border-red-100 text-red-800 text-center">
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => initializeSession()}
                className="text-xs underline mt-1 text-red-600 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          )}
          
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
          />
          
          <ChatInput 
            onSendMessage={sendMessage} 
            isLoading={isLoading} 
          />
        </div>
      </main>

      <footer className="bg-white border-t py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-neutral-500">
          <p>Powered by OpenAI's GPT API</p>
          <p className="mt-1">© {new Date().getFullYear()} AI-Powered Customer Chatbot</p>
        </div>
      </footer>
    </div>
  );
};

export default App;