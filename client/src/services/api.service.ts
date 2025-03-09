import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiError, ApiResponse, Message } from '../types';

// Create Axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const err = {
      status: error.response?.status || 500,
      message: 'An unexpected error occurred',
      details: '',
    } as ApiError;

    if (error.response?.data) {
      const data = error.response.data as any;
      err.message = data.message || err.message;
      err.details = data.stack || '';
    }

    return Promise.reject(err);
  }
);

// API service class
class ApiService {
  // Create a new chat session
  async createSession(): Promise<ApiResponse<{sessionId: string, messages: Message[]}>> {
    const response = await apiClient.post<ApiResponse<{sessionId: string, messages: Message[]}>>(
      '/chat/session'
    );
    return response.data;
  }

  // Get all messages for a session
  async getSessionMessages(sessionId: string): Promise<ApiResponse<Message[]>> {
    const response = await apiClient.get<ApiResponse<Message[]>>(
      `/chat/session/${sessionId}`
    );
    return response.data;
  }

  // Send a message to the chat
  async sendMessage(sessionId: string, message: string): Promise<ApiResponse<Message>> {
    const response = await apiClient.post<ApiResponse<Message>>(
      `/chat/session/${sessionId}/message`,
      { message }
    );
    return response.data;
  }

  // Clear a session's messages
  async clearSession(sessionId: string): Promise<ApiResponse<Message[]>> {
    const response = await apiClient.delete<ApiResponse<Message[]>>(
      `/chat/session/${sessionId}/clear`
    );
    return response.data;
  }

  // Delete a session
  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/chat/session/${sessionId}`
    );
    return response.data;
  }
}

export default new ApiService();