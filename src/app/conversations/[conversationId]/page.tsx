"use client";

import { useEffect, useState, useRef } from "react";

export default function ChatPage({ params }: { params: { conversationId: string } }) {
  const { conversationId } = params;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadMessages() {
    const res = await fetch(`/api/conversations/${conversationId}/messages`);
    const json = await res.json();
    setMessages(json.messages);
  }

  async function sendMessage() {
    if (!input.trim()) return;

    await fetch(`/api/conversations/${conversationId}/message`, {
      method: "POST",
      body: JSON.stringify({ body: input }),
    });

    setInput("");
    loadMessages();
  }

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Conversation</h1>

      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            <p className="text-sm text-gray-600">{msg.sender.name}</p>
            <div className="bg-white p-3 rounded shadow-sm inline-block">
              {msg.body}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
