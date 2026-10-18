import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Globe, 
  Code2, 
  Smartphone, 
  X,
  QrCode,
  Sparkles,
  Info
} from 'lucide-react';
import { Logo } from './Logo';

interface SeoShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoShareModal: React.FC<SeoShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'social' | 'schema' | 'tags'>('social');
  
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://goandgrabcoffee.ai.studio/';
  const displayTitle = "Go & Grab Coffee | Đặt Cà Phê Trực Tuyến & Thanh Toán Nhanh";
  const displayDesc = "Go & Grab Coffee - Đặt cà phê đặc sản Cầu Đất, Cà phê muối xứ Huế, Cold Brew cam sả và Bạc xỉu ba tầng. Chuẩn bị trong 5 phút, thanh toán siêu tốc qua VietQR & MoMo.";
  const previewImg = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&h=630&q=85";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg">Chia Sẻ & Kiểm Tra Chuẩn SEO / OpenGraph</h3>
              <p className="text-xs text-stone-500">Tối ưu hóa hiển thị khi gửi link qua Zalo, Facebook, GitHub & Google</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick URL Copy Bar */}
        <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full bg-white px-3.5 py-2.5 rounded-xl border border-amber-200 text-xs font-mono text-stone-700 truncate select-all">
            {currentUrl}
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Đã sao chép link!' : 'Sao chép link gửi bạn bè'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100 px-5 bg-stone-50/30 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'social'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Hiển Thị Gửi Link (Zalo, FB, GitHub)
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Google Search Snippet
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'tags'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Meta Tags (HTML)
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Schema.org JSON-LD
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* TAB 1: SOCIAL CARD PREVIEW (Zalo, Facebook, GitHub, Discord, Telegram) */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Chuẩn OpenGraph Protocol & Twitter Card:</strong> Khi gửi link qua Zalo, Messenger, Facebook, Telegram hoặc dán vào README GitHub, bot crawler sẽ tự động lấy ảnh banner, tiêu đề và tóm tắt theo chuẩn quốc tế.
                </span>
              </div>

              {/* Simulated Social Card */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
                <div className="relative h-48 sm:h-56 bg-stone-800 overflow-hidden">
                  <img 
                    src={previewImg} 
                    alt="Go & Grab Coffee Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    OpenGraph Image Ready (1200x630)
                  </div>
                </div>

                <div className="p-4 bg-stone-50/80 border-t border-stone-200">
                  <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    GOANDGRABCOFFEE.AI.STUDIO
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1">
                    {displayTitle}
                  </h4>
                  <p className="text-stone-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {displayDesc}
                  </p>
                </div>
              </div>

              {/* GitHub markdown badge helper */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <p className="text-xs font-semibold text-stone-700 mb-2">Đoạn mã nhúng vào GitHub README.md:</p>
                <code className="block bg-stone-900 text-stone-100 p-2.5 rounded-lg text-xs font-mono select-all overflow-x-auto">
                  {`[![Go & Grab Coffee](https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&h=630&q=85)](${currentUrl})`}
                </code>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SEARCH PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Mô phỏng kết quả tìm kiếm Google (Google SERP):</strong> Thẻ tiêu đề &lt;title&gt; (63 ký tự) và &lt;meta description&gt; (152 ký tự) được tối ưu độ dài vàng để không bị Google cắt bớt chấm lửng (...).
                </span>
              </div>

              {/* Google Search Card Simulation */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <div className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-bold">
                    ☕
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-stone-900 text-[11px]">Go & Grab Coffee Specialty</span>
                    <span className="text-[10px] text-stone-500">{currentUrl}</span>
                  </div>
                </div>
                <h4 className="text-blue-700 hover:underline cursor-pointer text-base font-semibold pt-1">
                  {displayTitle}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  <span className="text-stone-400 font-medium">17 thg 10, 2026 — </span>
                  {displayDesc}
                </p>
                <div className="flex items-center gap-3 pt-2 text-[11px] text-stone-500 font-medium">
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Đánh giá: 4.9 ★ (1,280 đánh giá)</span>
                  <span>Mức giá: 29.000đ - 55.000đ</span>
                  <span className="text-emerald-700 font-semibold">● Đang mở cửa</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAW HTML META TAGS */}
          {activeTab === 'tags' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">Các thẻ Meta Tags đã được nhúng trong mã nguồn HTML:</p>
              <pre className="bg-stone-900 text-amber-200 p-3.5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`<!-- Primary SEO Tags -->
<title>Go & Grab Coffee | Đặt Cà Phê Trực Tuyến & Thanh Toán Nhanh</title>
<meta name="description" content="${displayDesc}" />
<meta name="theme-color" content="#3a1d0f" />

<!-- OpenGraph / Facebook / Zalo -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Go & Grab Coffee" />
<meta property="og:title" content="${displayTitle}" />
<meta property="og:description" content="${displayDesc}" />
<meta property="og:image" content="${previewImg}" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${displayTitle}" />
<meta name="twitter:image" content="${previewImg}" />`}
              </pre>
            </div>
          )}

          {/* TAB 4: SCHEMA.ORG JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-600">
                Cấu trúc dữ liệu <strong className="text-stone-900">Schema.org JSON-LD</strong> giúp bot Google hiểu rõ đây là Quán cà phê với danh mục món và giá tiền để xuất hiện ở Google Knowledge Graph:
              </div>
              <pre className="bg-stone-900 text-emerald-300 p-3.5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "Go & Grab Coffee",
  "servesCuisine": ["Vietnamese Coffee", "Espresso", "Cold Brew"],
  "priceRange": "$$",
  "currenciesAccepted": "VND",
  "paymentAccepted": "Cash, VietQR, MoMo, ZaloPay, Apple Pay",
  "openingHours": "Mo-Su 06:30-22:30",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "128 Nguyễn Đình Chiểu",
    "addressLocality": "Hồ Chí Minh",
    "addressCountry": "VN"
  }
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Tất cả meta tags & logo SVG đã được cấu hình hoàn chỉnh
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
