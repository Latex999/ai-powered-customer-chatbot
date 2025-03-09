import React from 'react';
import { FaRobot, FaTrash, FaInfoCircle } from 'react-icons/fa';

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 mr-3">
          <FaRobot size={20} />
        </div>
        <div>
          <h1 className="text-lg font-semibold">AI Customer Support</h1>
          <p className="text-sm text-neutral-500">How can I help you today?</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          title="Chat information"
          className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <FaInfoCircle size={18} />
        </button>
        <button
          onClick={onClearChat}
          title="Clear chat"
          className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;