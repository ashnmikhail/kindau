import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type Message = {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
  fileUrl?: string;
};

type MessagingPanelProps = {
  messages: Message[];
  currentUserId: string;
  conversationId: string;
  senderId: string;
  onSend: (body: string, file?: File) => void;
};

export function MessagingPanel({
  messages,
  currentUserId,
  conversationId,
  senderId,
  onSend,
}: MessagingPanelProps) {
  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] bg-white">
      <MessageList messages={messages} currentUserId={currentUserId} />

      <MessageInput
        conversationId={conversationId}
        senderId={senderId}
        onSend={onSend}
      />
    </div>
  );
}
