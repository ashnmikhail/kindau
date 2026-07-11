"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Message = {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
  sender?: {
    name?: string;
  };
};

export default function Chat({
  conversationId,
  conversation,
}: {
  conversationId: string;
  conversation: any;
}) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load messages on mount
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/conversations/${conversationId}/messages`
      );
      const data = await res.json();
      setMessages(data.messages || []);
    }
    load();
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const res = await fetch(
      `/api/conversations/${conversationId}/message`,
      {
        method: "POST",
        body: JSON.stringify({ body: input }),
      }
    );

    const data = await res.json();

    if (data.message) {
      setMessages((prev) => [...prev, data.message]);
      setInput("");
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">
          Conversation with{" "}
          {conversation?.professional?.name ||
            conversation?.user?.name ||
            "Unknown"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;

          return (
            <div
              key={msg.id}
              className={`max-w-[70%] p-3 rounded-lg ${
                isMe
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <div>{msg.body}</div>
              <div className="text-xs opacity-70 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
