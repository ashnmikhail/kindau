import { useState, useRef } from "react";

type MessageInputProps = {
  conversationId: string;
  senderId: string;
  onSend: (body: string, file?: File) => void;
};

export default function MessageInput({
  conversationId,
  senderId,
  onSend,
}: MessageInputProps) {
  const [body, setBody] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSend() {
    if (!body.trim()) return;
    onSend(body);
    setBody("");
  }

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2"
        />

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-black text-white rounded-lg active:scale-95 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
