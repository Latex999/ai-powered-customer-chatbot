import mongoose, { Schema, Document } from 'mongoose';

// Message role enum
export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system'
}

// Message interface
export interface IMessage extends Document {
  role: MessageRole;
  content: string;
  sessionId: string;
  timestamp: Date;
}

// Message schema
const MessageSchema: Schema = new Schema({
  role: {
    type: String,
    enum: Object.values(MessageRole),
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for better query performance
MessageSchema.index({ sessionId: 1, timestamp: 1 });

// Export the model
export default mongoose.model<IMessage>('Message', MessageSchema);