import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea based on content
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end border-t p-3 bg-white">
      <div className="flex-grow relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="resize-none w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 max-h-32"
          rows={1}
          disabled={isLoading}
        />
        <div className="text-xs text-neutral-500 mt-1 px-1">
          Press Enter to send, Shift+Enter for a new line
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className={`ml-2 p-3 rounded-full flex items-center justify-center ${
          message.trim() && !isLoading
            ? 'bg-primary-500 text-white hover:bg-primary-600'
            : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
        } transition-colors`}
      >
        <FaPaperPlane size={16} />
      </button>
    </form>
  );
};

export default ChatInput;