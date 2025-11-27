import { Chatbot } from "../Chatbot";

export default function ChatbotExample() {
  return (
    <div className="relative h-[600px] w-full bg-background p-4">
      <p className="text-sm text-muted-foreground">Click the chat button in the bottom right corner</p>
      <Chatbot />
    </div>
  );
}
