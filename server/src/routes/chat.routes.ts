import express from 'express';
import chatController from '../controllers/chat.controller';

const router = express.Router();

/**
 * @route   POST /api/chat/session
 * @desc    Create a new chat session
 * @access  Public
 */
router.post('/session', chatController.createSession);

/**
 * @route   GET /api/chat/session/:sessionId
 * @desc    Get all messages for a chat session
 * @access  Public
 */
router.get('/session/:sessionId', chatController.getSessionMessages);

/**
 * @route   POST /api/chat/session/:sessionId/message
 * @desc    Send a message to the chat and get AI response
 * @access  Public
 */
router.post('/session/:sessionId/message', chatController.sendMessage);

/**
 * @route   DELETE /api/chat/session/:sessionId/clear
 * @desc    Clear all messages in a chat session but keep the session
 * @access  Public
 */
router.delete('/session/:sessionId/clear', chatController.clearSession);

/**
 * @route   DELETE /api/chat/session/:sessionId
 * @desc    Delete a chat session and all its messages
 * @access  Public
 */
router.delete('/session/:sessionId', chatController.deleteSession);

export { router as chatRoutes };