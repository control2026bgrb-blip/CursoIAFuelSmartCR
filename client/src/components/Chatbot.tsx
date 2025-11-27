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
  "¿Cómo ahorro combustible?",
  "¿Cuál es mi eco score?",
  "Gasolineras cercanas",
  "Agendar mantenimiento",
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "¡Hola! Soy tu asistente FuelSmart. ¿Cómo puedo ayudarte hoy? Puedes preguntarme sobre eficiencia de combustible, encontrar gasolineras cercanas o recibir consejos de eco-conducción.",
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
        "¿Cómo ahorro combustible?":
          "Aquí van algunos consejos para ahorrar combustible:\n\n1. Mantén velocidades constantes en autopista\n2. Evita aceleraciones bruscas\n3. Mantén llantas infladas correctamente\n4. Usa el aire acondicionado moderadamente\n5. Planifica rutas para evitar presas",
        "¿Cuál es mi eco score?":
          "Tu Eco Score actual es 78/100 - ¡Bueno! Has mejorado 5 puntos este mes. Sigue manteniendo velocidades constantes para subir más.",
        "Gasolineras cercanas":
          "Encontré 3 gasolineras cerca de ti:\n\n1. Delta (Escazú) - ₡695/L - 0.8km\n2. Uno (Santa Ana) - ₡698/L - 1.2km\n3. Total (Guachipelín) - ₡692/L - 2.5km\n\n¿Te gustaría direcciones a alguna?",
        "Agendar mantenimiento":
          "Según tu kilometraje (45,320 km), te recomiendo:\n\n• Cambio de aceite - En 500km\n• Rotación de llantas - En 2,000km\n\n¿Quieres que busque talleres cercanos?",
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          responses[messageText] ||
          "Entiendo que preguntas sobre " +
            messageText.toLowerCase() +
            ". Déjame ayudarte con eso. ¿Hay algo específico que quieras saber?",
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
            <p className="text-sm font-medium">Asistente FuelSmart</p>
            {!isMinimized && (
              <p className="text-xs opacity-80">En línea • Listo para ayudar</p>
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
                      <AvatarFallback>CR</AvatarFallback>
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
                placeholder="Escribe un mensaje..."
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
