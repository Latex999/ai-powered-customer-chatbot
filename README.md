# AI-Powered Customer Chatbot

A complete AI-powered chatbot application that answers customer queries using OpenAI's GPT API. This full-stack application includes a modern React frontend and a Node.js/Express backend.

## Features

- 🤖 Intelligent responses powered by OpenAI's GPT API
- 💬 Real-time chat interface with message history
- 🧠 Context awareness for more relevant responses
- 🔒 Secure API key management
- 📱 Responsive design for desktop and mobile
- 🌈 Modern and intuitive user interface
- 📝 Conversation history persistence

## Tech Stack

- **Frontend**: React, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **AI**: OpenAI GPT API
- **Database**: MongoDB (for message history)

## Project Structure

```
/
├── client/                  # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/      # React components
│       ├── context/         # React context for state management
│       ├── hooks/           # Custom React hooks
│       ├── styles/          # CSS and style files
│       └── types/           # TypeScript type definitions
├── server/                  # Backend Node.js application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── app.ts           # Express application
│   └── package.json         # Backend dependencies
└── package.json             # Root package.json for scripts
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Latex999/ai-powered-customer-chatbot.git
   cd ai-powered-customer-chatbot
   ```

2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the server directory with the following:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     OPENAI_API_KEY=your_openai_api_key
     CLIENT_URL=http://localhost:3000
     ```

4. Start the development servers:
   ```bash
   # Start both client and server in development mode
   cd ..
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Deployment

The application can be deployed to various platforms:

- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Heroku, Render, or AWS
- Database: MongoDB Atlas

Detailed deployment instructions are available in the [DEPLOYMENT.md](DEPLOYMENT.md) file.

## Customization

You can customize the chatbot for different use cases:

- Modify the prompt templates in `server/src/services/openai.service.ts`
- Adjust the UI components in the `client/src/components/` directory
- Configure different OpenAI models or parameters

## License

MIT

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the GPT API
- [React](https://reactjs.org/) for the frontend library
- [Express](https://expressjs.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling