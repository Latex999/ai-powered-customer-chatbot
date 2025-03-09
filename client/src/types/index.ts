// Message role enum
export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system'
}

// Message interface
export interface Message {
  _id?: string;
  role: MessageRole;
  content: string;
  sessionId: string;
  timestamp: Date | string;
}

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Chat context state interface
export interface ChatState {
  sessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// API service error interface
export interface ApiError {
  status: number;
  message: string;
  details?: string;
}