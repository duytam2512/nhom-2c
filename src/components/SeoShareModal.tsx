import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Globe, 
  Code2, 
  X,
  Sparkles,
  Info,
  CheckCircle2,
  FileCode2,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SeoShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoShareModal: React.FC<SeoShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gsc' | 'social' | 'preview' | 'tags' | 'schema'>('gsc');
  
  // Google Site Verification Code
  const [gscCode, setGscCode] = useState<string>('nrAVFB15M9l_r9TXRbhoGsaeHsW1Kwz0AdvR1trLhCM');
  const [isSavedGsc, setIsSavedGsc] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gsc_verification_code');
      if (saved) {
        setGscCode(saved);
      } else {
        const meta = document.querySelector('meta[name="google-site-verification"]');
        if (meta) {
          const val = meta.getAttribute('content');
          if (val) setGscCode(val);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://gocoffee.vn';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://gocoffee.vn/';
  const sitemapUrl = `${currentOrigin}/sitemap.xml`;
  const robotsUrl = `${currentOrigin}/robots.txt`;

  const displayTitle = "Go Coffee | Đặt Cà Phê Trực Tuyến & Thanh Toán Nhanh";
  const displayDesc = "Go Coffee - Đặt cà phê Phin Sữa Đá Cầu Đất, Cà Phê Muối Cố Đô, Freeze Trà Xanh mát lạnh, Trà Sen Vàng và đặt bàn trực tuyến tiện lợi. Chuẩn bị sau 5 phút, thanh toán VietQR & MoMo.";
  const previewImg = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&h=630&q=85";

  const copyWithFeedback = (text: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSaveGscCode = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gsc_verification_code', gscCode);
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', gscCode);
    }
    setIsSavedGsc(true);
    setTimeout(() => setIsSavedGsc(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b22830] text-white flex items-center justify-center shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 text-base sm:text-lg">Google Search Console & SEO Suite</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                  Google Index
                </span>
              </div>
              <p className="text-xs text-stone-500">Khai báo website lên Google Search Console, xác minh quyền sở hữu & gửi Sitemap</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
            aria-label="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick URL Bar */}
        <div className="px-4 py-3 bg-amber-50/60 border-b border-amber-100/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto truncate">
            <span className="font-bold text-amber-950 shrink-0">🌐 URL Website của bạn:</span>
            <code className="bg-white px-2.5 py-1 rounded-lg border border-amber-200/80 text-stone-800 font-mono text-[11px] truncate select-all">
              {currentOrigin}/
            </code>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => copyWithFeedback(`${currentOrigin}/`, 'url')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/80 border border-amber-300 text-amber-900 font-semibold flex items-center gap-1.5 transition text-xs cursor-pointer shadow-2xs"
            >
              {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
              <span>{copiedType === 'url' ? 'Đã sao chép!' : 'Sao chép URL'}</span>
            </button>

            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#b22830] hover:bg-[#8c141c] text-white font-bold flex items-center gap-1.5 transition text-xs shadow-sm cursor-pointer"
            >
              <span>Vào Google Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200/80 px-4 sm:px-6 bg-stone-50/50 gap-1 sm:gap-2 pt-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('gsc')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gsc'
                ? 'border-[#b22830] text-[#b22830]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Search Console (4 Bước)</span>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'social'
                ? 'border-[#b22830] text-[#b22830]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia Sẻ Zalo / FB / GitHub</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'border-[#b22830] text-[#b22830]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Mô Phỏng Google SERP</span>
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tags'
                ? 'border-[#b22830] text-[#b22830]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Thẻ Meta Tags</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'schema'
                ? 'border-[#b22830] text-[#b22830]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Schema.org JSON-LD</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: GOOGLE SEARCH CONSOLE INSTRUCTIONS & ACTIONS */}
          {activeTab === 'gsc' && (
            <div className="space-y-5">
              {/* Overview Box */}
              <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-blue-950">Đưa Website Lên Google Search Console</h4>
                    <p className="text-xs text-blue-800/90 mt-0.5 leading-relaxed">
                      Giúp Googlebot cào dữ liệu nhanh hơn, lập chỉ mục thực đơn & hiển thị quán của bạn trên kết quả tìm kiếm Google (SERP).
                    </p>
                  </div>
                </div>

                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center justify-center gap-2 transition text-xs shrink-0 cursor-pointer shadow-sm"
                >
                  <span>Mở Google Search Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                    Bước 1: Thêm tài sản mới & Chọn "Tiền tố URL" (URL prefix)
                  </h5>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed pl-8">
                  Truy cập vào <strong>Google Search Console</strong> bằng tài khoản Google của bạn. Bấm <em>Thêm tài sản (Add Property)</em>, chọn ô bên phải <strong>Tiền tố URL</strong> và dán địa chỉ website sau:
                </p>
                <div className="pl-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 font-mono text-stone-900 text-xs select-all truncate">
                    {currentOrigin}/
                  </div>
                  <button
                    onClick={() => copyWithFeedback(`${currentOrigin}/`, 'step1')}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedType === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'step1' ? 'Đã sao chép' : 'Sao chép URL'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                      Bước 2: Xác minh quyền sở hữu website (Verify Ownership)
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã cấu hình sẵn
                  </span>
                </div>

                <div className="pl-8 space-y-3">
                  {/* Method A: HTML Tag */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-amber-800" />
                        Cách 1: Thẻ HTML (HTML tag) — Khuyên dùng
                      </span>
                      <button
                        onClick={() => copyWithFeedback(`<meta name="google-site-verification" content="${gscCode}" />`, 'tag')}
                        className="text-amber-800 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedType === 'tag' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedType === 'tag' ? 'Đã chép thẻ HTML' : 'Sao chép thẻ HTML'}
                      </button>
                    </div>
                    <code className="block bg-stone-900 text-amber-200 p-2.5 rounded-lg text-[11px] font-mono select-all overflow-x-auto">
                      {`<meta name="google-site-verification" content="${gscCode}" />`}
                    </code>

                    {/* Custom verification code input if user has a specific code */}
                    <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] text-stone-500 font-semibold mb-1">
                          Nếu Google cấp cho bạn mã riêng, dán mã vào đây để cập nhật ngay:
                        </label>
                        <input
                          type="text"
                          value={gscCode}
                          onChange={(e) => setGscCode(e.target.value.trim())}
                          placeholder="Nhập mã content trong thẻ HTML (vd: nrAVFB15M9...)"
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-mono bg-white focus:ring-2 focus:ring-amber-800 outline-none"
                        />
                      </div>
                      <button
                        onClick={handleSaveGscCode}
                        className="sm:self-end px-3 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer shrink-0"
                      >
                        {isSavedGsc ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : null}
                        <span>{isSavedGsc ? 'Đã lưu thẻ!' : 'Lưu mã xác minh'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Method B: HTML File auto-handler */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Cách 2: Tệp HTML (HTML file) — Tự động 100%
                    </span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Máy chủ web đã tích hợp bộ bắt tự động mọi tệp xác minh dạng <code>/google[mã].html</code>. Bạn có thể chọn cách xác minh bằng Tệp HTML trên Google Search Console và bấm nút <strong>XÁC MINH</strong> ngay mà không cần tải lên thủ công!
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                    Bước 3: Gửi Sơ đồ trang web (Sitemap.xml)
                  </h5>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed pl-8">
                  Tại thanh điều hướng bên trái của Google Search Console, bấm vào mục <strong>Sơ đồ trang web (Sitemaps)</strong>. Trong ô "Thêm sơ đồ trang web mới", chỉ cần nhập chữ: <strong className="text-stone-900 font-mono">sitemap.xml</strong> và bấm <strong>Gửi</strong>.
                </p>
                <div className="pl-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 font-mono text-stone-900 text-xs select-all truncate">
                    {sitemapUrl}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyWithFeedback('sitemap.xml', 'sitemap_short')}
                      className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer text-xs"
                    >
                      {copiedType === 'sitemap_short' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'sitemap_short' ? 'Đã sao chép' : 'Sao chép "sitemap.xml"'}</span>
                    </button>
                    <a
                      href={sitemapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold flex items-center justify-center gap-1 transition text-xs"
                      title="Mở xem tệp sitemap.xml thực tế"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem file</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 4: Robots.txt */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-black flex items-center justify-center">
                    4
                  </span>
                  <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                    Bước 4: Kiểm tra tệp Robots.txt (Đã mở quyền cào dữ liệu)
                  </h5>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed pl-8">
                  Tệp <code>robots.txt</code> đã được cấu hình cho phép mọi bot của Google cào dữ liệu đầy đủ (<code>User-agent: * Allow: /</code>) và đính kèm đường dẫn Sitemap.
                </p>
                <div className="pl-8 flex items-center gap-2">
                  <a
                    href={robotsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Kiểm tra tệp {robotsUrl}</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SOCIAL CARD PREVIEW */}
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
                    alt="Go Coffee Preview" 
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
                    GOCOFFEE.VN
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
                  {`[![Go Coffee](https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&h=630&q=85)](${currentUrl})`}
                </code>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE SEARCH PREVIEW */}
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
                  <div className="w-5 h-5 rounded-full bg-[#b22830] text-white flex items-center justify-center text-[10px] font-bold">
                    ☕
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-stone-900 text-[11px]">Go Coffee Specialty</span>
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
                  <span>Mức giá: 25.000đ - 55.000đ</span>
                  <span className="text-emerald-700 font-semibold">● Đang mở cửa</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RAW HTML META TAGS */}
          {activeTab === 'tags' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">Các thẻ Meta Tags đã được nhúng trong mã nguồn HTML:</p>
              <pre className="bg-stone-900 text-amber-200 p-3.5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`<!-- Primary SEO Tags -->
<title>Go Coffee | Đặt Cà Phê Trực Tuyến & Thanh Toán Nhanh</title>
<meta name="description" content="${displayDesc}" />
<meta name="robots" content="index, follow" />
<meta name="google-site-verification" content="${gscCode}" />
<meta name="theme-color" content="#b22830" />

<!-- OpenGraph / Facebook / Zalo -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Go Coffee" />
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

          {/* TAB 5: SCHEMA.ORG JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-600">
                Cấu trúc dữ liệu <strong className="text-stone-900">Schema.org JSON-LD</strong> giúp bot Google hiểu rõ đây là Quán cà phê với danh mục món và giá tiền để xuất hiện ở Google Knowledge Graph:
              </div>
              <pre className="bg-stone-900 text-emerald-300 p-3.5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "Go Coffee",
  "servesCuisine": ["Vietnamese Coffee", "Phin Sữa Đá", "Cà Phê Muối", "Freeze Trà Xanh"],
  "priceRange": "$$",
  "currenciesAccepted": "VND",
  "paymentAccepted": "Cash, VietQR, MoMo, ZaloPay, Apple Pay",
  "openingHours": "Mo-Su 06:30-23:00",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "7 Công Trường Lam Sơn",
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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sitemap, Robots.txt & Thẻ xác thực Google Console đã sẵn sàng
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
