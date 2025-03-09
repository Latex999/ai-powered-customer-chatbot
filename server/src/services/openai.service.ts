import OpenAI from 'openai';
import { ApiError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';
import { MessageRole } from '../models/message.model';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Interface for chat messages
interface ChatMessage {
  role: string;
  content: string;
}

class OpenAIService {
  // Default system prompt for the chatbot
  private defaultSystemPrompt = `You are a helpful customer support assistant for our company. 
Your goal is to provide accurate, concise, and helpful responses to customer queries. 
Use a friendly and professional tone, and try to resolve the customer's issue as efficiently as possible.
If you don't know the answer to a question, admit it honestly rather than making up information.
Always ask clarifying questions if you need more information to provide an accurate response.`;

  // Function to generate a response using OpenAI
  async generateResponse(messages: ChatMessage[], customSystemPrompt?: string): Promise<string> {
    try {
      // Build the messages array for OpenAI
      const systemMessage = {
        role: 'system',
        content: customSystemPrompt || this.defaultSystemPrompt,
      };
      
      const apiMessages = [systemMessage, ...messages];
      
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // Extract and return the response
      const responseMessage = completion.choices[0]?.message?.content;
      
      if (!responseMessage) {
        throw new ApiError(500, 'Failed to get a response from OpenAI');
      }
      
      return responseMessage;
    } catch (error: any) {
      logger.error('Error calling OpenAI API:', error);
      
      // Handle different types of errors
      if (error.status === 429) {
        throw new ApiError(429, 'Rate limit exceeded. Please try again later.');
      } else if (error instanceof ApiError) {
        throw error;
      } else {
        throw new ApiError(
          500,
          `Failed to generate response: ${error.message || 'Unknown error'}`,
          true
        );
      }
    }
  }

  // Function to transform messages for OpenAI format
  transformMessages(messages: any[]): ChatMessage[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  // Function to generate an initial greeting message
  generateGreeting(): ChatMessage {
    return {
      role: MessageRole.Assistant,
      content: "Hello! I'm your customer support assistant. How can I help you today?"
    };
  }
}

export default new OpenAIService();