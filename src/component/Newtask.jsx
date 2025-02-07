import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAePiccZIrwErCU3eFi-qWelEq9GeLmB0c";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const Newtask = () => {
  const initialMessage = {
    message: "Xin chào, bạn cần giải quyết vấn đề gì?",
    sentTime: "just now",
    sender: "Gemini",
  };

  const [conversations, setConversations] = useState([
    { id: 1, messages: [initialMessage] },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const updatedConversations = conversations.map((conv) =>
      conv.id === currentConversationId
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    );

    setConversations(updatedConversations);

    setIsTyping(true);
    await processMessageToGemini(updatedConversations);
  };

  async function processMessageToGemini(updatedConversations) {
    try {
      const currentConversation = updatedConversations.find(
        (conv) => conv.id === currentConversationId
      );
      const prompt = currentConversation.messages
        .map((msg) => msg.message)
        .join(" ");

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const newMessage = {
        message: responseText,
        sender: "Gemini",
      };

      const finalConversations = updatedConversations.map((conv) =>
        conv.id === currentConversationId
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      );

      setConversations(finalConversations);
      setIsTyping(false);
    } catch (error) {
      console.error("API Error:", error);
      alert("Error: " + error.message);
      setIsTyping(false);
    }
  }

  const startNewConversation = () => {
    const newConversationId = conversations.length + 1;
    setConversations([
      ...conversations,
      { id: newConversationId, messages: [initialMessage] },
    ]);
    setCurrentConversationId(newConversationId);
  };

  const switchConversation = (id) => {
    setCurrentConversationId(id);
  };

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-gray-300 p-4 bg-gray-100 overflow-y-auto">
          <button
            onClick={startNewConversation}
            className="w-full mb-4 p-2 text-black bg-white rounded-2xl shadow-lg transition duration-300"
          >
            Bắt đầu cuộc trò chuyện mới
          </button>
          <ul>
            {conversations.map((conv) => (
              <li
                key={conv.id}
                onClick={() => switchConversation(conv.id)}
                className={`p-2 mb-2 cursor-pointer transition duration-300 bg-white rounded-2xl shadow-lg ${
                  conv.id === currentConversationId
                    ? "bg-blue-200"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cuộc trò chuyện {conv.id}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex-1 p-4 flex flex-col">
          <MainContainer className="flex-1 bg-white rounded-2xl shadow-lg">
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? <TypingIndicator content="Nghĩ cái đã" /> : null
                }
              >
                {currentConversation.messages.map((message, i) => (
                  <Message key={i} model={message} />
                ))}
              </MessageList>
              <MessageInput placeholder="Đặt câu hỏi" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
};

export default Newtask;
