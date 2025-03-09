import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { ChatState, Message, MessageRole } from '../types';
import apiService from '../services/api.service';

// Initial state for the chat context
const initialState: ChatState = {
  sessionId: null,
  messages: [],
  isLoading: false,
  error: null,
};

// Action types
type ChatAction =
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

// Chat reducer function
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_SESSION_ID':
      return {
        ...state,
        sessionId: action.payload,
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

// Create the chat context
const ChatContext = createContext<{
  state: ChatState;
  initializeSession: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => Promise<void>;
}>({
  state: initialState,
  initializeSession: async () => {},
  sendMessage: async () => {},
  clearChat: async () => {},
});

// Chat provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Initialize chat session
  const initializeSession = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await apiService.createSession();
      
      if (response.success && response.data) {
        const { sessionId, messages } = response.data;
        dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
        dispatch({ type: 'SET_MESSAGES', payload: messages });
      }
    } catch (error: any) {
      console.error('Error initializing session:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to initialize chat session' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Send message to the chat
  const sendMessage = async (message: string) => {
    try {
      if (!state.sessionId) {
        await initializeSession();
      }

      if (!state.sessionId) {
        throw new Error('Failed to create session');
      }

      // Optimistically add user message to UI
      const userMessage: Message = {
        role: MessageRole.User,
        content: message,
        sessionId: state.sessionId,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      
      // Set loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Send message to API
      const response = await apiService.sendMessage(state.sessionId, message);
      
      if (response.success && response.data) {
        // Add AI response to the chat
        dispatch({ type: 'ADD_MESSAGE', payload: response.data });
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to send message' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear the chat
  const clearChat = async () => {
    try {
      if (state.sessionId) {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const response = await apiService.clearSession(state.sessionId);
        
        if (response.success && response.data) {
          dispatch({ type: 'SET_MESSAGES', payload: response.data });
        }
      }
    } catch (error: any) {
      console.error('Error clearing chat:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to clear chat' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        initializeSession,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);