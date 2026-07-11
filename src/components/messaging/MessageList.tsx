import { useEffect, useRef } from "react";

type Message = {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
  fileUrl?: string;
};

export default function MessageList({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.senderId === currentUserId ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg max-w-xs ${
              msg.senderId === currentUserId
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.body}

            {msg.fileUrl && (
              <img
                src={msg.fileUrl}
                className="mt-2 rounded-lg max-h-48 object-cover"
              />
            )}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
