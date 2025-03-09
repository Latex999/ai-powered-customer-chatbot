import { v4 as uuidv4 } from 'uuid';
import Message, { MessageRole, IMessage } from '../models/message.model';
import openAIService from './openai.service';
import { ApiError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

class ChatService {
  // Create a new chat session
  async createSession(): Promise<string> {
    const sessionId = uuidv4();
    
    // Add greeting message to the session
    const greeting = openAIService.generateGreeting();
    await this.saveMessage(sessionId, greeting.role as MessageRole, greeting.content);
    
    return sessionId;
  }
  
  // Get messages for a specific chat session
  async getSessionMessages(sessionId: string): Promise<IMessage[]> {
    try {
      const messages = await Message
        .find({ sessionId })
        .sort({ timestamp: 1 })
        .lean();
      
      if (!messages.length) {
        throw new ApiError(404, `Chat session ${sessionId} not found`);
      }
      
      return messages;
    } catch (error) {
      logger.error(`Error fetching messages for session ${sessionId}:`, error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Error fetching messages: ${(error as Error).message}`);
    }
  }
  
  // Process a user message and get AI response
  async processMessage(sessionId: string, message: string): Promise<IMessage> {
    try {
      // Save user message
      await this.saveMessage(sessionId, MessageRole.User, message);
      
      // Get chat history
      const history = await this.getSessionMessages(sessionId);
      
      // Transform messages for OpenAI format
      const formattedMessages = openAIService.transformMessages(history);
      
      // Get AI response
      const aiResponse = await openAIService.generateResponse(formattedMessages);
      
      // Save AI response
      const savedResponse = await this.saveMessage(sessionId, MessageRole.Assistant, aiResponse);
      
      return savedResponse;
    } catch (error) {
      logger.error(`Error processing message for session ${sessionId}:`, error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Error processing message: ${(error as Error).message}`);
    }
  }
  
  // Save a message to the database
  async saveMessage(sessionId: string, role: MessageRole, content: string): Promise<IMessage> {
    try {
      const message = new Message({
        sessionId,
        role,
        content,
        timestamp: new Date()
      });
      
      return await message.save();
    } catch (error) {
      logger.error(`Error saving message for session ${sessionId}:`, error);
      throw new ApiError(500, `Error saving message: ${(error as Error).message}`);
    }
  }
  
  // Delete a chat session and all its messages
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const result = await Message.deleteMany({ sessionId });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error(`Error deleting session ${sessionId}:`, error);
      throw new ApiError(500, `Error deleting session: ${(error as Error).message}`);
    }
  }
  
  // Clear all messages in a session but keep the session
  async clearSession(sessionId: string): Promise<boolean> {
    try {
      await this.deleteSession(sessionId);
      
      // Add a new greeting to start fresh
      const greeting = openAIService.generateGreeting();
      await this.saveMessage(sessionId, greeting.role as MessageRole, greeting.content);
      
      return true;
    } catch (error) {
      logger.error(`Error clearing session ${sessionId}:`, error);
      throw new ApiError(500, `Error clearing session: ${(error as Error).message}`);
    }
  }
}

export default new ChatService();