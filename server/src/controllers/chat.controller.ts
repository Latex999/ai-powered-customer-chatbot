import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import chatService from '../services/chat.service';
import { ApiError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

// Input validation schemas
const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

const sessionIdSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID format'),
});

export default {
  // Create a new chat session
  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = await chatService.createSession();
      const messages = await chatService.getSessionMessages(sessionId);
      
      res.status(201).json({
        success: true,
        data: {
          sessionId,
          messages
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Get all messages for a session
  async getSessionMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      
      // Validate session ID
      const result = sessionIdSchema.safeParse({ sessionId });
      if (!result.success) {
        throw new ApiError(400, 'Invalid session ID format');
      }
      
      const messages = await chatService.getSessionMessages(sessionId);
      
      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Send a message and get a response
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;
      
      // Validate input
      const sessionResult = sessionIdSchema.safeParse({ sessionId });
      const messageResult = messageSchema.safeParse({ message });
      
      if (!sessionResult.success) {
        throw new ApiError(400, 'Invalid session ID format');
      }
      
      if (!messageResult.success) {
        throw new ApiError(400, 'Message validation failed: ' + messageResult.error.message);
      }
      
      // Process message
      const response = await chatService.processMessage(sessionId, message);
      
      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      logger.error('Error in sendMessage controller:', error);
      next(error);
    }
  },
  
  // Clear chat session
  async clearSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      
      // Validate session ID
      const result = sessionIdSchema.safeParse({ sessionId });
      if (!result.success) {
        throw new ApiError(400, 'Invalid session ID format');
      }
      
      const success = await chatService.clearSession(sessionId);
      const messages = await chatService.getSessionMessages(sessionId);
      
      res.status(200).json({
        success,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Delete chat session
  async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      
      // Validate session ID
      const result = sessionIdSchema.safeParse({ sessionId });
      if (!result.success) {
        throw new ApiError(400, 'Invalid session ID format');
      }
      
      const success = await chatService.deleteSession(sessionId);
      
      res.status(200).json({
        success,
        message: success 
          ? 'Session deleted successfully' 
          : 'Session not found or already deleted'
      });
    } catch (error) {
      next(error);
    }
  }
};