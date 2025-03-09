import React from 'react';
import { format } from 'date-fns';
import { FaRobot, FaUser } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Message as MessageType, MessageRole } from '../types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { role, content, timestamp } = message;
  const isUser = role === MessageRole.User;
  
  // Format the timestamp
  const formattedTime = typeof timestamp === 'string' 
    ? format(new Date(timestamp), 'h:mm a')
    : format(timestamp, 'h:mm a');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[85%]`}>
        <div className="flex-shrink-0">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isUser ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700'
          } mr-2`}>
            {isUser ? <FaUser size={14} /> : <FaRobot size={14} />}
          </div>
        </div>
        
        <div className={`flex flex-col ${isUser ? 'items-end mr-2' : 'items-start ml-2'}`}>
          <div className={`p-3 rounded-lg ${
            isUser 
              ? 'bg-primary-100 text-neutral-800' 
              : 'bg-white border border-neutral-200 text-neutral-800'
          } shadow-sm`}>
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            ) : (
              <div className="text-sm markdown-content">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
          <span className="text-xs text-neutral-500 mt-1">
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;