import React, { useEffect, useRef } from 'react';
import Message from './Message';
import { Message as MessageType } from '../types';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-neutral-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-neutral-500">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="text-xl font-medium mb-2">Welcome to our Customer Support Chat</h2>
          <p className="text-center max-w-md">
            I'm your AI assistant, ready to help with your questions. Feel free to ask anything!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-white border border-neutral-200 text-neutral-500 max-w-[85%] shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <div className="text-sm">AI is thinking...</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;