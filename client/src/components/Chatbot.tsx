import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Fuel,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// todo: remove mock functionality
const quickReplies = [
  "How can I save on fuel?",
  "What's my eco score?",
  "Nearby gas stations",
  "Schedule maintenance",
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your FuelSmart assistant. How can I help you today? You can ask me about fuel efficiency, find nearby stations, or get eco-driving tips.",
    timestamp: new Date(),
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "How can I save on fuel?":
          "Here are some tips to save fuel:\n\n1. Maintain steady speeds on highways\n2. Avoid aggressive acceleration\n3. Keep tires properly inflated\n4. Use cruise control when possible\n5. Plan routes to avoid traffic",
        "What's my eco score?":
          "Your current Eco Score is 78/100 - Good! You've improved by 5 points this month. Keep maintaining steady speeds to boost it further.",
        "Nearby gas stations":
          "I found 3 stations near you:\n\n1. Shell (Main St) - $1.35/L - 0.8km\n2. Chevron (Oak Ave) - $1.38/L - 1.2km\n3. Costco - $1.29/L - 3.5km\n\nWould you like directions to any of these?",
        "Schedule maintenance":
          "Based on your mileage (45,320 km), I recommend:\n\n• Oil change - Due in 500km\n• Tire rotation - Due in 2,000km\n\nWould you like me to find nearby service centers?",
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          responses[messageText] ||
          "I understand you're asking about " +
            messageText.toLowerCase() +
            ". Let me help you with that. Is there anything specific you'd like to know?",
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        data-testid="button-open-chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-lg border bg-card shadow-xl transition-all ${
        isMinimized ? "h-14 w-80" : "h-[500px] w-96"
      }`}
      data-testid="chatbot-panel"
    >
      <div className="flex items-center justify-between gap-2 border-b bg-primary p-3 text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
            <Fuel className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">FuelSmart Assistant</p>
            {!isMinimized && (
              <p className="text-xs opacity-80">Online • Ready to help</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
            data-testid="button-minimize-chatbot"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
            data-testid="button-close-chatbot"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${message.id}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1">
              {quickReplies.map((reply) => (
                <Button
                  key={reply}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => handleSend(reply)}
                  data-testid={`quick-reply-${reply.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {reply}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1"
                data-testid="input-chat-message"
              />
              <Button
                size="icon"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
