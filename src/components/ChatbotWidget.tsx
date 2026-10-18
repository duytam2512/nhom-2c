import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Coffee, 
  Bot, 
  ChevronDown, 
  RefreshCw, 
  Plus, 
  Flame, 
  Tag, 
  Zap,
  CornerDownLeft
} from 'lucide-react';
import { MenuItem } from '../types/coffee';
import { MENU_ITEMS } from '../data/coffeeData';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  recommendedItemId?: string;
  timestamp: string;
}

interface ChatbotWidgetProps {
  onSelectItem: (item: MenuItem) => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ onSelectItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Chào bạn! Mình là Barista AI của Go & Grab Coffee ☕ Bạn đang tìm một ly cà phê đậm đà giúp tỉnh táo buổi sáng, hay một ly trà trái cây thanh mát cho buổi chiều?',
      timestamp: 'Vừa xong',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    { label: '🔥 Món bán chạy nhất?', query: 'Quán có những món nào bán chạy nhất?' },
    { label: '☕ Cà phê muối có vị gì?', query: 'Cà phê muối xứ Huế của quán có gì đặc biệt?' },
    { label: '🏷️ Mã giảm giá hôm nay', query: 'Hôm nay có những mã voucher ưu đãi nào?' },
    { label: '🌿 Đồ uống thanh mát ít ngọt', query: 'Gợi ý cho mình đồ uống thanh mát, ít ngọt hoặc ít calo' },
    { label: '⚡ Cách nhận hàng 5 phút', query: 'Làm sao để ghé lấy cà phê trong 5 phút không phải chờ?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  // Match drink name in message to attach quick order button
  const detectRecommendedItem = (text: string): MenuItem | undefined => {
    const lower = text.toLowerCase();
    return MENU_ITEMS.find((item) => 
      lower.includes(item.name.toLowerCase()) || 
      (item.vietnameseName && lower.includes(item.vietnameseName.toLowerCase()))
    );
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          message: query,
        }),
      });

      if (!response.ok) {
        throw new Error('API response not ok');
      }

      const data = await response.json();
      const replyText = data.reply || 'Cảm ơn bạn đã nhắn tin! Barista Go & Grab chúc bạn một ngày tràn đầy năng lượng.';
      const recommended = detectRecommendedItem(replyText);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: replyText,
          recommendedItemId: recommended ? recommended.id : undefined,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      // Local fallback with barista logic
      let fallbackReply = 'Dạ mình là Barista AI của Go & Grab. Bạn có thể thử ly Cà Phê Muối Xứ Huế (39k) hoặc Bạc Xỉu 3 Tầng (35k) rất được yêu thích! Đừng quên nhập mã GRAB20 để được giảm 20% nhé.';
      const qLower = query.toLowerCase();

      if (qLower.includes('muối')) {
        fallbackReply = 'Cà Phê Muối Xứ Huế (39.000đ) là món Signature bán chạy số 1 của Go & Grab! Cốt Robusta Cầu Đất đậm đà kết hợp với lớp kem sữa muối biển mềm mịn, vị ngọt béo mằn mặn hòa quyện cực kỳ lôi cuốn.';
      } else if (qLower.includes('mã') || qLower.includes('giảm giá') || qLower.includes('voucher') || qLower.includes('khuyến mãi')) {
        fallbackReply = 'Hiện quán đang có 3 mã ưu đãi siêu hời:\n• GRAB20: Giảm 20% cho đơn từ 50k\n• FREESHIP: Miễn phí giao hàng tới 18k cho đơn từ 80k\n• BANMOI15: Giảm ngay 15k cho khách thân thiết!';
      } else if (qLower.includes('ít ngọt') || qLower.includes('thanh mát') || qLower.includes('calo') || qLower.includes('healthy')) {
        fallbackReply = 'Nếu bạn thích thanh mát nhẹ nhàng, mình khuyên bạn nên thử: Cold Brew Cam Vàng Sả (46k - ủ lạnh 24h chỉ 55 kcal) hoặc Oatly Vanilla Latte (52k - sữa yến mạch thuần chay không đường lactose).';
      } else if (qLower.includes('5 phút') || qLower.includes('lấy') || qLower.includes('nhận hàng')) {
        fallbackReply = 'Với dịch vụ Go & Grab, bạn chỉ cần đặt món và thanh toán qua VietQR trên website trước khi xuất phát 5 phút. Khi tới quầy, đồ uống đã sẵn sàng tại tủ giữ nhiệt/kệ ưu tiên, bạn chỉ cần đọc mã đơn là lấy ngay!';
      }

      const recommended = detectRecommendedItem(fallbackReply);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          recommendedItemId: recommended ? recommended.id : undefined,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderRecommended = (itemId: string) => {
    const found = MENU_ITEMS.find((it) => it.id === itemId);
    if (found) {
      onSelectItem(found);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 left-5 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#2c140a] via-[#3a1d0f] to-[#1c0c06] hover:from-amber-900 hover:to-stone-900 text-white font-bold text-xs sm:text-sm shadow-2xl ring-2 ring-amber-500/40 hover:ring-amber-400 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Chat với Barista AI"
          >
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>

            {/* Icon */}
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30 group-hover:rotate-12 transition-transform">
              <Bot className="w-4 h-4 text-amber-300" />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-bold text-xs tracking-tight text-white flex items-center gap-1">
                Barista AI
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <span className="text-[10px] text-amber-200/80 font-normal hidden sm:inline">
                Tư vấn chọn cà phê
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-5 left-5 z-50 w-[92vw] sm:w-[400px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#2c140a] via-[#3a1d0f] to-[#1c0c06] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-amber-800 border border-amber-600/40 flex items-center justify-center text-amber-200">
                  <Coffee className="w-5 h-5 text-amber-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#2c140a]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm font-display tracking-tight text-white">
                    Barista AI Go & Grab
                  </h4>
                  <span className="text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded">
                    GPT-Gemini
                  </span>
                </div>
                <p className="text-[10px] text-amber-200/80">Trực tuyến • Trợ lý tư vấn đồ uống 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([
                  {
                    id: 'welcome-reset',
                    role: 'assistant',
                    content: 'Chào bạn! Mình có thể giúp gì cho bạn về menu đồ uống, mã ưu đãi hoặc thời gian lấy cà phê?',
                    timestamp: 'Vừa xong',
                  }
                ])}
                className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition"
                title="Làm mới hội thoại"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition"
                title="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/60">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              const recommendedItem = msg.recommendedItemId 
                ? MENU_ITEMS.find((it) => it.id === msg.recommendedItemId) 
                : undefined;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs shrink-0 mt-1 shadow-2xs">
                      ☕
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2 ${isAssistant ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs whitespace-pre-line ${
                        isAssistant
                          ? 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-sm'
                          : 'bg-amber-800 text-white rounded-tr-sm font-medium'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Interactive Recommended Drink Card within Assistant reply */}
                    {isAssistant && recommendedItem && (
                      <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-left animate-in fade-in">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={recommendedItem.image}
                            alt={recommendedItem.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="truncate">
                            <h5 className="font-bold text-xs text-stone-900 truncate">
                              {recommendedItem.name}
                            </h5>
                            <span className="text-[11px] font-extrabold text-amber-900">
                              {recommendedItem.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOrderRecommended(recommendedItem.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-2xs transition"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Đặt món</span>
                        </button>
                      </div>
                    )}

                    <span className="text-[9px] text-stone-400 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-stone-500">
                <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs shrink-0">
                  ☕
                </div>
                <div className="bg-white border border-stone-200 p-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 text-[11px] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-stone-400 pl-1">Barista đang suy nghĩ...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-stone-100/70 border-t border-stone-200 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.query)}
                className="text-[10px] sm:text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 transition font-medium shrink-0 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-stone-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Hỏi Barista: vị cà phê, lượng calo, mã giảm..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white flex items-center justify-center transition shadow-2xs shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
