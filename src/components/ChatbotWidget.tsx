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
  ExternalLink,
  GripHorizontal,
  Move
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

  // Position & Draggable state (Flexible dragging on screen, default on the LEFT)
  const [launcherPos, setLauncherPos] = useState<{ x: number; y: number } | null>(null);
  const [chatWindowPos, setChatWindowPos] = useState<{ x: number; y: number } | null>(null);

  const launcherDragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  } | null>(null);

  const windowDragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherBtnRef = useRef<HTMLButtonElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

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

  // Handle Dragging Launcher Button
  const handleLauncherPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const btn = launcherBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    launcherDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: launcherPos ? launcherPos.x : rect.left,
      origY: launcherPos ? launcherPos.y : rect.top,
      hasMoved: false,
    };
    try {
      btn.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleLauncherPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!launcherDragRef.current) return;
    const dx = e.clientX - launcherDragRef.current.startX;
    const dy = e.clientY - launcherDragRef.current.startY;
    if (!launcherDragRef.current.hasMoved && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      launcherDragRef.current.hasMoved = true;
    }
    if (launcherDragRef.current.hasMoved) {
      const btnWidth = launcherBtnRef.current?.offsetWidth || 180;
      const btnHeight = launcherBtnRef.current?.offsetHeight || 52;
      const nextX = Math.max(8, Math.min(window.innerWidth - btnWidth - 8, launcherDragRef.current.origX + dx));
      const nextY = Math.max(8, Math.min(window.innerHeight - btnHeight - 8, launcherDragRef.current.origY + dy));
      setLauncherPos({ x: nextX, y: nextY });
    }
  };

  const handleLauncherPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!launcherDragRef.current) return;
    const moved = launcherDragRef.current.hasMoved;
    launcherDragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Only toggle chat if user clicked/tapped without dragging
    if (!moved) {
      onToggle();
    }
  };

  // Handle Dragging Main Chat Window via Header
  const handleWindowPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't drag if clicking buttons inside the header
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const win = chatWindowRef.current;
    if (!win) return;
    const rect = win.getBoundingClientRect();
    windowDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: chatWindowPos ? chatWindowPos.x : rect.left,
      origY: chatWindowPos ? chatWindowPos.y : rect.top,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleWindowPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!windowDragRef.current) return;
    const dx = e.clientX - windowDragRef.current.startX;
    const dy = e.clientY - windowDragRef.current.startY;
    const winWidth = chatWindowRef.current?.offsetWidth || 380;
    const winHeight = chatWindowRef.current?.offsetHeight || 500;
    const nextX = Math.max(8, Math.min(window.innerWidth - winWidth - 8, windowDragRef.current.origX + dx));
    const nextY = Math.max(8, Math.min(window.innerHeight - winHeight - 8, windowDragRef.current.origY + dy));
    setChatWindowPos({ x: nextX, y: nextY });
  };

  const handleWindowPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    windowDragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Reset to default left corner
  const handleResetPosition = () => {
    setLauncherPos(null);
    setChatWindowPos(null);
  };

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
        content: `Dạ hiện tại máy chủ AI đang tải nhiều lượt yêu cầu cùng lúc. Bạn có thể thử ngay 2 món bán chạy nhất quán là **Cà Phê Muối Xứ Huế** (39k) hoặc **Cold Brew Cam Sả** (46k), áp dụng mã **GOCOFFEE20** để được giảm 20% nhé!`,
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
      {/* Floating Launcher Button - Positioned on LEFT by default, freely draggable */}
      <div 
        className={
          launcherPos 
            ? 'fixed z-40' 
            : 'fixed bottom-18 left-4 sm:bottom-6 sm:left-6 z-40'
        }
        style={
          launcherPos 
            ? { left: launcherPos.x, top: launcherPos.y, right: 'auto', bottom: 'auto' } 
            : undefined
        }
      >
        <button
          ref={launcherBtnRef}
          onPointerDown={handleLauncherPointerDown}
          onPointerMove={handleLauncherPointerMove}
          onPointerUp={handleLauncherPointerUp}
          aria-label="Mở Chat với Barista . Go Coffee (Có thể kéo di chuyển)"
          title="Bấm để mở chat • Giữ để kéo linh hoạt khắp màn hình"
          className="relative group flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#8c141c] via-[#b22830] to-[#8c141c] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 ring-2 ring-amber-300/60 cursor-grab active:cursor-grabbing select-none touch-none"
        >
          {/* Glowing Aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-red-600 opacity-30 blur-sm group-hover:opacity-75 transition duration-500 animate-pulse pointer-events-none" />

          {/* Drag Grip Indicator */}
          <div className="hidden sm:flex items-center text-amber-300/70 group-hover:text-amber-200">
            <GripHorizontal className="w-3.5 h-3.5" />
          </div>

          {/* Icon */}
          <div className="relative w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-inner shrink-0">
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
            <div className="text-xs font-bold leading-tight text-white flex items-center gap-1">
              <span>Barista Go Coffee</span>
            </div>
          </div>

          {/* Mobile Badge */}
          <span className="relative sm:hidden text-xs font-bold text-amber-100 flex items-center gap-1">
            <span>Barista AI</span>
          </span>
        </button>
      </div>

      {/* Main Chatbot Window - Positioned on LEFT by default, freely draggable */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className={`chatbot-window fixed z-50 shadow-2xl rounded-2xl overflow-hidden border border-amber-900/20 bg-stone-50 flex flex-col ${
            chatWindowPos 
              ? '' 
              : isMinimized 
                ? 'bottom-20 left-4 sm:bottom-24 sm:left-6' 
                : 'bottom-18 left-4 sm:bottom-24 sm:left-6'
          } ${
            isMinimized 
              ? 'w-72 h-14' 
              : 'w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[82dvh] sm:max-h-[82vh]'
          }`}
          style={
            chatWindowPos 
              ? { left: chatWindowPos.x, top: chatWindowPos.y, right: 'auto', bottom: 'auto' } 
              : undefined
          }
        >
          {/* Header with Draggable Handle - Highlands Crimson Red Styling */}
          <div 
            onPointerDown={handleWindowPointerDown}
            onPointerMove={handleWindowPointerMove}
            onPointerUp={handleWindowPointerUp}
            title="Giữ thanh tiêu đề để kéo cửa sổ di chuyển linh hoạt"
            className="bg-gradient-to-r from-[#7a1218] via-[#9e1c24] to-[#7a1218] text-white p-3 sm:p-3.5 flex items-center justify-between shadow-md shrink-0 border-b border-amber-500/20 cursor-grab active:cursor-grabbing select-none touch-none"
          >
            <div className="flex items-center gap-2">
              {/* Drag Handle Icon */}
              <div className="p-1 rounded bg-white/10 text-amber-200/80 hover:text-white" title="Kéo để di chuyển">
                <GripHorizontal className="w-4 h-4" />
              </div>

              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-stone-950 flex items-center justify-center font-black shadow-md shrink-0">
                <Coffee className="w-4 h-4 text-stone-900" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1.5 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    Barista . Go Coffee
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-amber-400 text-stone-950 shadow-2xs">
                    Gemini AI
                  </span>
                </div>
                <div className="text-[10px] text-amber-200/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Trực tuyến 24/7 • Kéo linh hoạt</span>
                </div>
              </div>
            </div>

            {/* Actions: Reset Position, Reset Chat, Minimize, Close */}
            <div className="flex items-center gap-1 text-white/80">
              {(chatWindowPos || launcherPos) && (
                <button
                  onClick={handleResetPosition}
                  title="Đặt lại về góc trái mặc định"
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white text-[10px] font-bold flex items-center gap-0.5 transition cursor-pointer"
                >
                  <Move className="w-3 h-3" />
                  <span className="hidden sm:inline">Góc trái</span>
                </button>
              )}
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
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-gradient-to-b from-stone-100/60 to-white text-xs">
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
                    className="flex-1 px-3.5 py-2.5 text-[15px] sm:text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b22830]/40 focus:border-[#b22830] placeholder:text-stone-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#9e1c24] to-[#b22830] text-white hover:opacity-95 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Subtext info */}
                <div className="mt-1.5 text-center flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>Kéo thanh tiêu đề để di chuyển • Trực tuyến 24/7</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
