# 🧠 Next.js AI Chat App with LangChain, Clerk, and Streaming

A modern starter template for building an AI-powered chat application using:

- ✅ **Next.js 15 (App Router)**
- 🔐 **Clerk Authentication**
- 🤖 **LangChain with OpenAI**
- 📡 **Streaming API routes**
- 💬 **Live Chat Interface**
- 🧑‍💻 **TypeScript**

---

## 🏁 Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/your-username/nextjs-langchain-chat.git
cd nextjs-langchain-chat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file and configure the following:

```env
# Clerk
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

> 🔒 Get your OpenAI key from https://platform.openai.com/account/api-keys  
> 🔐 Get your Clerk keys from https://dashboard.clerk.com/

---

## 🚀 Features

### ✅ Authentication

Uses [Clerk](https://clerk.com) to handle login, signup, and user session management.

### ⚙️ LangChain + OpenAI

Integrates LangChain’s `ChatOpenAI` model for prompt handling and chaining logic.

### 🔁 Streaming Chat API

Built-in streaming support via `ReadableStream` for fast, incremental AI responses.

### 💬 Chat UI

A clean React-based chat interface with real-time assistant message rendering.

---

## 🧱 Folder Structure

```
/
├── app/
│   └── api/chat/route.ts        # Streaming API route
│   └── (auth)/                  # Clerk auth wrapper
│   └── page.tsx                 # Chat interface
├── components/
│   └── ChatMessage.tsx
│   └── ChatInput.tsx
├── lib/
│   └── utils.ts                 # Stream reader helpers, etc.
├── types/
│   └── message.ts               # Shared TypeScript interfaces
├── .env.local
├── package.json
└── README.md
```

---

## 🧪 Development

```bash
npm run dev
```

Visit `http://localhost:3000` to use the app.

> You’ll be prompted to sign in with Clerk first.

---

## 📦 Build & Deploy

```bash
npm run build
npm start
```

Supports deployment to:

- **Vercel** (recommended)
- **Netlify**
- **Docker**

---

## 📚 Tech Stack

| Tech         | Usage                         |
|--------------|-------------------------------|
| Next.js 15   | App routing & rendering       |
| Clerk        | Authentication & user sessions |
| LangChain    | AI chat logic + OpenAI        |
| TypeScript   | Type safety everywhere         |
| Fetch API    | Streaming API endpoints        |

---

## 🤝 Credits

- [Clerk](https://clerk.dev)
- [LangChain](https://js.langchain.com/)
- [OpenAI](https://platform.openai.com/)
- [Next.js](https://nextjs.org)

---

## 📄 License

MIT — feel free to use and adapt!
