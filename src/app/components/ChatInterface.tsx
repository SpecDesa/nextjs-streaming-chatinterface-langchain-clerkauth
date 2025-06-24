"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  MessageSquare,
  User,
  Bot,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const systemMessage = `Du er en hjælpsom AI-assistent.`;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hej! Hvordan kan jeg hjælpe dig i dag?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Getting Started with AI",
      lastMessage: "Hej! Hvordan kan jeg hjælpe dig i dag?",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "Web Development Questions",
      lastMessage: "Can you help me with React?",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      title: "Data Analysis Project",
      lastMessage: "I need help analyzing this dataset",
      timestamp: new Date(Date.now() - 7200000),
    },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
  const inputText = inputValue.trim();
  if (!inputText) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    content: inputText,
    role: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsTyping(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemMessage },
          ...messages.map(({ role, content }) => ({ role, content })),
          { role: "user", content: inputText },
        ],
      }),
    });

    if (!res.ok || !res.body) throw new Error("Failed to fetch response");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let assistantText = "";
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      assistantText += chunk;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: assistantText }
            : msg
        )
      );
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }

  setIsTyping(false);
};


  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSendMessage();
  //   }
  // };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      lastMessage: "",
      timestamp: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([
      {
        id: "1",
        content: "Hej! Hvordan kan jeg hjælpe dig i dag?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    setSidebarOpen(false);
  };

  const selectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    // In a real app, you'd load messages for this conversation
    setSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatConversationTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-30 w-80 h-full transition-all duration-300 ease-in-out ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-r`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Tilbudssamtaler
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300 hover:text-gray-100"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                }`}
                title={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`lg:hidden p-2 rounded-md transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Plus size={20} />
              Ny samtale
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-4 space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => selectConversation(conversation.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    currentConversationId === conversation.id
                      ? darkMode
                        ? "bg-gray-700 border border-gray-600"
                        : "bg-blue-50 border border-blue-200"
                      : darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare
                      size={18}
                      className={`mt-1 flex-shrink-0 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium truncate text-sm ${
                          darkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {conversation.title}
                      </h3>
                      <p
                        className={`text-xs truncate mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {formatConversationTime(conversation.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Profile */}
          <div
            className={`border-t p-4 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div> */}
              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {
                    <div className="flex items-center gap-2">
                      <UserButton />
                      {/* {user && <span>{user.firstName || user.username  || user.fullName || user.emailAddresses[0]?.emailAddress}</span>} */}
                    </div>
                  }
                </div>
                {/* <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Powered by Clerk Auth
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className={`border-b px-4 py-3 flex items-center justify-between ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-md transition-colors ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Bot size={24} className="text-blue-600" />
              <h1
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Tilbuds-AI Assistenten
              </h1>
            </div>
          </div>
          <div
            className={`hidden sm:flex items-center gap-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          ></div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-3xl ${
                    message.role === "user" ? "order-first" : ""
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      message.role === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : darkMode
                        ? "bg-gray-700 border border-gray-600 text-gray-100"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-2 mt-2 text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="max-w-3xl">
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          darkMode ? "bg-gray-400" : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          darkMode ? "bg-gray-400" : "bg-gray-400"
                        }`}
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          darkMode ? "bg-gray-400" : "bg-gray-400"
                        }`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div
          className={`border-t px-4 py-4 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyUp={handleKeyPress}
                placeholder="Skriv din besked her..."
                className={`w-full px-4 py-3 pr-12 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 max-h-32 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                rows={1}
                style={{
                  minHeight: "48px",
                  height: "auto",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </div>
            <p
              className={`text-xs mt-2 text-center ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tryk på enter for at sende, Shift + Enter for ny linje.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
