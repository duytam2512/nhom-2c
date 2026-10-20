import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Coffee, 
  Flame, 
  Tag, 
  Calendar, 
  RotateCcw, 
  Minimize2, 
  Maximize2,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedAction?: {
    type: 'menu' | 'booking' | 'cart';
    label: string;
  };
}

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenTableBooking?: () => void;
  onScrollToMenu?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: `Dạ chào bạn! Mình là **Barista AI** của **Go Coffee** ☕✨

Rất vui được đồng hành cùng bạn hôm nay! Bạn muốn tìm ly **Phin Sữa Đá Cầu Đất** đậm đà tỉnh táo, ly **Cà Phê Muối Cố Đô** béo ngậy vị biển, ly **Cold Brew Cam Sả** thanh mát giải nhiệt, hay món đá xay **Freeze Trà Xanh** thạch giòn sần sật?

💡 **Ưu đãi hôm nay:** Nhập mã **GOCOFFEE20** để được giảm ngay 20% khi đặt món mang đi hoặc giao tận nơi nhé!`,
    timestamp: new Date(),
  },
];

const QUICK_SUGGESTIONS = [
  { label: '🔥 Best-seller Go Coffee?', query: 'Go Coffee có những món nào bán chạy và được yêu thích nhất?' },
  { label: '☕ Phin sữa đá vs PhinDi?', query: 'Cà phê Phin Sữa Đá và dòng PhinDi Hạnh Nhân khác nhau như thế nào?' },
  { label: '🍵 Freeze Trà Xanh có gì ngon?', query: 'Freeze Trà Xanh của quán có những thành phần và topping gì?' },
  { label: '🌿 Trà Sen Vàng ít ngọt?', query: 'Trà Sen Vàng hạt sen có vị như thế nào, mình muốn uống ít ngọt có được không?' },
  { label: '🎟️ Mã giảm giá Go Coffee', query: 'Hôm nay Go Coffee có những voucher mã giảm giá nào?' },
  { label: '🪑 Đặt bàn & Google Sheet', query: 'Làm sao để đặt bàn giữ chỗ trước tại Go Coffee và đồng bộ Google Sheet?' },
];

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onToggle,
  onOpenTableBooking,
  onScrollToMenu,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation payload for backend /api/chat
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          message: text,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || 'Dạ Barista AI đã ghi nhận yêu cầu của bạn!';

      // Detect actions in bot response
      let suggestedAction: ChatMessage['suggestedAction'] = undefined;
      const lowerReply = botReply.toLowerCase();
      if (lowerReply.includes('đặt bàn') || lowerReply.includes('giữ chỗ') || lowerReply.includes('khung giờ')) {
        suggestedAction = { type: 'booking', label: '🪑 Đặt Bàn Ngay' };
      } else if (lowerReply.includes('thực đơn') || lowerReply.includes('món') || lowerReply.includes('cà phê muối') || lowerReply.includes('cold brew')) {
        suggestedAction = { type: 'menu', label: '☕ Xem Thực Đơn Đầy Đủ' };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: new Date(),
        suggestedAction,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err: any) {
      console.error('Lỗi gọi Barista AI:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        content: `Dạ hiện tại máy chủ AI đang tải nhiều lượt yêu cầu cùng lúc. Bạn có thể thử ngay 2 món bán chạy nhất quán là **Cà Phê Muối Xứ Huế** (39k) hoặc **Cold Brew Cam Sả** (46k), áp dụng mã **GRAB20** để được giảm 20% nhé!`,
        timestamp: new Date(),
        suggestedAction: { type: 'menu', label: '☕ Xem Menu & Đặt Món' },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const formatMessageText = (content: string) => {
    // Basic Markdown bold parser for clean display
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-stone-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={onToggle}
          aria-label="Mở Chat với Barista . Go Coffee"
          className="relative group flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#8c141c] via-[#b22830] to-[#8c141c] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-amber-300/60 cursor-pointer"
        >
          {/* Glowing Aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-red-600 opacity-30 blur-sm group-hover:opacity-75 transition duration-500 animate-pulse" />

          {/* Icon */}
          <div className="relative w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-stone-900 animate-spin-slow" />
            {hasUnread && !isOpen && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-ping" />
            )}
          </div>

          {/* Text on Desktop */}
          <div className="relative text-left hidden sm:block">
            <div className="text-[10px] uppercase font-black tracking-wider text-amber-200 flex items-center gap-1">
              <span>Google Gemini AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xs font-bold leading-tight text-white">
              Chat với Barista . Go Coffee
            </div>
          </div>

          {/* Mobile Badge */}
          <span className="relative sm:hidden text-xs font-bold text-amber-100">
            Chat với Barista
          </span>
        </button>
      </div>

      {/* Main Chatbot Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-in-out shadow-2xl rounded-2xl overflow-hidden border border-amber-900/20 bg-stone-50 flex flex-col ${
            isMinimized 
              ? 'bottom-20 right-5 sm:bottom-24 sm:right-6 w-72 h-14' 
              : 'bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[82vh]'
          }`}
        >
          {/* Header - Highlands Crimson Red Styling */}
          <div className="bg-gradient-to-r from-[#7a1218] via-[#9e1c24] to-[#7a1218] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md shrink-0 border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-stone-950 flex items-center justify-center font-black shadow-md">
                <Coffee className="w-5 h-5 text-stone-900" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1.5 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Chat với Barista . Go Coffee
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-400 text-stone-950 shadow-2xs">
                    Gemini 3.8
                  </span>
                </div>
                <div className="text-[11px] text-amber-200/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Trực tuyến 24/7 • Tư vấn món hợp khẩu vị</span>
                </div>
              </div>
            </div>

            {/* Actions: Reset, Minimize, Close */}
            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleResetChat}
                title="Làm mới cuộc trò chuyện"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Phóng to' : 'Thu nhỏ'}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onToggle}
                title="Đóng chat"
                className="p-1.5 rounded-lg hover:bg-white/20 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* If minimized, hide body */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-stone-100/60 to-white text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#9e1c24] to-[#b22830] text-white rounded-tr-xs'
                          : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {formatMessageText(msg.content)}
                      </div>

                      {/* Interactive Button in AI response */}
                      {msg.suggestedAction && (
                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-2">
                          {msg.suggestedAction.type === 'booking' && (
                            <button
                              onClick={() => {
                                onOpenTableBooking?.();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] shadow-xs transition cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{msg.suggestedAction.label}</span>
                            </button>
                          )}
                          {msg.suggestedAction.type === 'menu' && (
                            <button
                              onClick={() => {
                                onScrollToMenu?.();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b22830] hover:bg-[#8c141c] text-white font-bold text-[11px] shadow-xs transition cursor-pointer"
                            >
                              <Coffee className="w-3.5 h-3.5" />
                              <span>{msg.suggestedAction.label}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-stone-400 mt-1 px-1">
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(msg.timestamp)}
                    </span>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-[10px] shrink-0">
                      ☕
                    </div>
                    <div className="bg-white border border-stone-200/80 rounded-2xl rounded-tl-xs p-3 text-stone-600 shadow-xs flex items-center gap-2">
                      <span className="text-xs font-medium text-amber-900">Barista AI đang suy nghĩ</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="px-3 py-2 bg-stone-100/90 border-t border-stone-200/60 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
                {QUICK_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug.query)}
                    disabled={isLoading}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-amber-50 text-stone-700 hover:text-[#b22830] border border-stone-200 hover:border-amber-300 transition shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-white border-t border-stone-200/80">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Hỏi Barista AI về món, giá, mã giảm giá..."
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b22830]/40 focus:border-[#b22830] placeholder:text-stone-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#9e1c24] to-[#b22830] text-white hover:opacity-95 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Subtext info */}
                <div className="mt-1.5 text-center flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>Powered by Google Gemini API • Trả lời tức thì 24/7</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
