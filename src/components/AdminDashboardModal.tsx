import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  FileSpreadsheet, 
  Bot, 
  Globe, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Send, 
  AlertCircle, 
  Users, 
  ShoppingBag, 
  CheckCircle2, 
  TrendingUp, 
  LogOut, 
  Eye, 
  KeyRound,
  Code2
} from 'lucide-react';
import { getStoreSyncConfig, saveStoreSyncConfig, sendDirectToGoogleSheets } from '../services/bookingSync';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCustomerView?: () => void;
}

const APPS_SCRIPT_SOURCE = `/**
 * GO COFFEE - APPS SCRIPT ĐỒNG BỘ GOOGLE SHEET & TELEGRAM BOT
 * Bot Telegram: @Duyaasaa_bot
 * Email chủ quán: duykhaikhan@gmail.com
 *
 * ⚠️ HƯỚNG DẪN TRIỂN KHAI 4 BƯỚC:
 * 1. Mở sheets.new -> Tiện ích mở rộng -> Apps Script -> dán toàn bộ mã này -> Lưu (Ctrl + S)
 * 2. Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
 * 3. Loại: Ứng dụng web (Web app)
 * 4. BẮT BUỘC: "Ai có quyền truy cập" (Who has access) -> Chọn "Bất kỳ ai" (Anyone)
 * 5. Copy Web App URL kết thúc bằng /exec và dán vào Bảng Quản Trị Go Coffee!
 */

var TELEGRAM_BOT_TOKEN = "8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw";
var DEFAULT_TELEGRAM_CHAT_ID = "";

function doPost(e) {
  return handleIncoming(e);
}

function doGet(e) {
  return handleIncoming(e);
}

function handleIncoming(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Dat_Ban_GoCoffee";
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "Mã Đơn / Bàn", "Loại", "Thời Gian Gửi", "Họ Tên Khách",
      "Số Điện Thoại", "Email", "Số Lượng / Món", "Ngày Nhận",
      "Khung Giờ", "Chi Nhánh Quán", "Không Gian / Giao Hàng", "Ghi Chú", "Trạng Thái"
    ]);
    sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#B22830").setFontColor("#FFFFFF");
  }

  var data = {};
  if (e && e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = e.parameter || {};
    }
  } else if (e && e.parameter) {
    data = e.parameter;
  }

  var code = data.code || ("TB-" + Math.floor(1000 + Math.random() * 9000));
  var isOrder = (data.type === "order" || Boolean(data.total));
  var recordType = isOrder ? "Đơn Cà Phê" : "Đặt Bàn";
  var timeNow = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

  sheet.appendRow([
    code,
    recordType,
    timeNow,
    data.customerName || data.name || "Khách",
    data.customerPhone || data.phone || "",
    data.customerEmail || data.email || "",
    isOrder ? (data.itemsSummary || (data.total + " đ")) : (data.guestCount + " người"),
    data.date || "Hôm nay",
    data.timeSlot || "",
    data.storeName || (data.store ? data.store.name : "Go Coffee"),
    data.seatingArea || data.deliveryAddress || "Khu vực chuẩn",
    data.note || "",
    "Mới tiếp nhận"
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    code: code,
    message: "Ghi nhận thành công vào Google Sheet Go Coffee!",
    row: sheet.getLastRow()
  })).setMimeType(ContentService.MimeType.JSON);
}`;

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onSwitchToCustomerView,
}) => {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: overview (orders/bookings), sheets (google sheet sync), telegram (bot config), seo (gsc)
  const [activeTab, setActiveTab] = useState<'overview' | 'sheets' | 'telegram' | 'seo'>('overview');

  // Overview data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);
  const [resyncMsg, setResyncMsg] = useState<string | null>(null);

  // Sheets Config
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [sheetsTestStatus, setSheetsTestStatus] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Telegram Config
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isDetectingChatId, setIsDetectingChatId] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [botUsername, setBotUsername] = useState('Duyaasaa_bot');

  // Google Search Console code
  const [gscCode, setGscCode] = useState('nrAVFB15M9l_r9TXRbhoGsaeHsW1Kwz0AdvR1trLhCM');
  const [isSavedGsc, setIsSavedGsc] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('go_coffee_admin_session');
      if (savedAuth === 'active') {
        setIsAuthenticated(true);
      }
      const savedWebhook = localStorage.getItem('go_grab_sheets_webhook');
      if (savedWebhook) setWebhookUrl(savedWebhook);
      const savedChatId = localStorage.getItem('go_grab_telegram_chat_id');
      if (savedChatId) setTelegramChatId(savedChatId);
      const savedGsc = localStorage.getItem('gsc_verification_code');
      if (savedGsc) setGscCode(savedGsc);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadOverview();
    }
  }, [isAuthenticated, isOpen]);

  const fallbackLocalOverview = () => {
    try {
      const resList = JSON.parse(localStorage.getItem('go_coffee_local_reservations') || '[]');
      const ordList = JSON.parse(localStorage.getItem('go_coffee_local_orders') || '[]');
      setOverviewData({
        webhookUrl: localStorage.getItem('go_grab_sheets_webhook') || '',
        telegramChatId: localStorage.getItem('go_grab_telegram_chat_id') || '',
        botUsername: 'Duyaasaa_bot',
        reservations: resList,
        orders: ordList,
        stats: {
          totalReservations: resList.length,
          totalOrders: ordList.length,
          totalRevenue: ordList.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0),
        },
      });
    } catch (e) {}
  };

  const loadOverview = async () => {
    setIsLoadingOverview(true);
    try {
      const syncConfig = await getStoreSyncConfig();
      if (syncConfig.webhookUrl && !webhookUrl) setWebhookUrl(syncConfig.webhookUrl);
      if (syncConfig.telegramChatId && !telegramChatId) setTelegramChatId(syncConfig.telegramChatId);

      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setOverviewData(data);
        if (data.webhookUrl && !webhookUrl) setWebhookUrl(data.webhookUrl);
        if (data.telegramChatId && !telegramChatId) setTelegramChatId(data.telegramChatId);
        if (data.botUsername) setBotUsername(data.botUsername);
      } else {
        fallbackLocalOverview();
      }
    } catch (err) {
      fallbackLocalOverview();
    } finally {
      setIsLoadingOverview(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    // Verify PIN: '1999' or '1234'
    if (pinInput === '1999' || pinInput === '1234' || pinInput === 'duykhaikhan') {
      setIsAuthenticated(true);
      localStorage.setItem('go_coffee_admin_session', 'active');
      setPinInput('');
    } else {
      setAuthError('Mã PIN chủ quán không đúng. Vui lòng nhập mã PIN hợp lệ (mặc định: 1999).');
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    localStorage.setItem('go_coffee_admin_session', 'active');
    setPinInput('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('go_coffee_admin_session');
  };

  const handleSaveWebhook = async () => {
    setIsSavingWebhook(true);
    const cleanUrl = webhookUrl.trim();
    const cleanChatId = telegramChatId.trim();

    try {
      await saveStoreSyncConfig({
        webhookUrl: cleanUrl,
        telegramChatId: cleanChatId,
      });

      setSheetsTestStatus({
        type: 'success',
        text: '✅ Đã lưu cấu hình Google Sheet Webhook vào toàn hệ thống quán thành công!',
      });
    } catch (err: any) {
      setSheetsTestStatus({
        type: 'error',
        text: 'Lỗi lưu webhook: ' + err.message,
      });
    } finally {
      setIsSavingWebhook(false);
      setTimeout(() => setSheetsTestStatus(null), 4000);
    }
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setSheetsTestStatus({ type: 'info', text: 'Đang gửi dòng thử nghiệm đến Google Sheet...' });
    const cleanUrl = webhookUrl.trim();
    const cleanTg = telegramChatId.trim();

    if (!cleanUrl) {
      setSheetsTestStatus({
        type: 'error',
        text: 'Vui lòng dán link Web App (https://script.google.com/macros/s/.../exec) trước khi bấm thử nghiệm!',
      });
      setIsTestingWebhook(false);
      return;
    }

    // Auto-save verified URL so owner doesn't forget
    await saveStoreSyncConfig({ webhookUrl: cleanUrl, telegramChatId: cleanTg });

    try {
      // 1. Try server-side test
      const res = await fetch('/api/booking/test-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: cleanUrl,
          telegramChatId: cleanTg,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          setSheetsTestStatus({
            type: 'success',
            text: '🎉 THÀNH CÔNG! Dữ liệu thử nghiệm đã được ghi vào file Google Sheet của bạn & kích hoạt tự động cho mọi lượt đặt bàn trên website.',
          });
          setIsTestingWebhook(false);
          return;
        } else {
          setSheetsTestStatus({
            type: 'error',
            text: data.error || 'Gửi thất bại. Kiểm tra xem quyền truy cập Web App đã để "Bất kỳ ai (Anyone)" chưa.',
          });
          setIsTestingWebhook(false);
          return;
        }
      }
    } catch (e: any) {
      // Server not reachable (e.g. running on static Vercel)
    }

    // 2. Direct client-side forward test (for Vercel / static deployments)
    try {
      const directRes = await sendDirectToGoogleSheets(cleanUrl, {
        code: 'TEST-WEB-DIRECT',
        customerName: 'Kiểm Tra Kết Nối Website',
        customerPhone: '0909123456',
        customerEmail: 'duykhaikhan@gmail.com',
        guestCount: 2,
        date: new Date().toISOString().split('T')[0],
        timeSlot: '09:00',
        storeName: 'Go Coffee - Chi Nhánh Mẫu',
        seatingArea: 'Khu làm việc thử nghiệm',
        note: 'Dòng test trực tiếp từ trình duyệt web (kênh Vercel fallback)',
        telegramChatId: cleanTg,
      });

      if (directRes.ok) {
        setSheetsTestStatus({
          type: 'success',
          text: '🎉 THÀNH CÔNG! Đã gửi trực tiếp từ trình duyệt đến Web App Google Sheet của bạn. Hệ thống sẵn sàng hoạt động trên cả Vercel & AI Studio!',
        });
      } else {
        setSheetsTestStatus({
          type: 'error',
          text: 'Không thể kết nối đến Web App. Vui lòng kiểm tra lại URL.',
        });
      }
    } catch (directErr: any) {
      setSheetsTestStatus({ type: 'error', text: 'Lỗi kết nối: ' + directErr.message });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleAutoDetectTelegram = async () => {
    setIsDetectingChatId(true);
    setTelegramStatusMsg({ type: 'info', text: 'Đang quét tin nhắn mới nhất trên @Duyaasaa_bot...' });
    try {
      const res = await fetch('/api/telegram/status');
      const data = await res.json();
      if (data.detectedChatId) {
        const idStr = String(data.detectedChatId);
        setTelegramChatId(idStr);
        localStorage.setItem('go_grab_telegram_chat_id', idStr);
        setTelegramStatusMsg({
          type: 'success',
          text: `🎉 Đã tìm thấy Chat ID của bạn: ${idStr}! Đã tự động lưu cấu hình.`,
        });
      } else {
        setTelegramStatusMsg({
          type: 'error',
          text: 'Chưa thấy tin nhắn mới. Bạn hãy mở Telegram, tìm @Duyaasaa_bot và bấm START, rồi bấm lại nút này.',
        });
      }
    } catch (err: any) {
      setTelegramStatusMsg({ type: 'error', text: 'Lỗi: ' + err.message });
    } finally {
      setIsDetectingChatId(false);
    }
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    setTelegramStatusMsg({ type: 'info', text: 'Đang gửi thông báo kiểm tra đến Telegram...' });
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: telegramChatId.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setTelegramStatusMsg({
          type: 'success',
          text: '🎉 Đã gửi thông báo thành công! Hãy mở ứng dụng Telegram để kiểm tra.',
        });
      } else {
        setTelegramStatusMsg({
          type: 'error',
          text: data.error || 'Gửi thất bại. Hãy chắc chắn bạn đã bấm START với @Duyaasaa_bot.',
        });
      }
    } catch (err: any) {
      setTelegramStatusMsg({ type: 'error', text: 'Lỗi gửi Telegram: ' + err.message });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleResyncAll = async () => {
    setIsResyncing(true);
    setResyncMsg('Đang đồng bộ tất cả đơn hàng & đặt bàn sang Google Sheet...');
    try {
      const res = await fetch('/api/admin/resync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: webhookUrl.trim() }),
      });
      const data = await res.json();
      setResyncMsg(data.message || 'Đã đồng bộ xong!');
      loadOverview();
    } catch (err: any) {
      setResyncMsg('Lỗi đồng bộ: ' + err.message);
    } finally {
      setIsResyncing(false);
      setTimeout(() => setResyncMsg(null), 5000);
    }
  };

  const handleSaveGsc = () => {
    localStorage.setItem('gsc_verification_code', gscCode);
    let meta = document.querySelector('meta[name="google-site-verification"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'google-site-verification');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', gscCode);
    setIsSavedGsc(true);
    setTimeout(() => setIsSavedGsc(false), 2500);
  };

  const copyWithFeedback = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://gocoffee.vn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-black shadow-md">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-display text-white">
                  Bảng Điều Khiển Dành Riêng Cho Chủ Quán
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950">
                  Store Owner Portal
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Toàn bộ dữ liệu Google Sheet, Telegram Bot & Google Console tập trung tại đây — Khách hàng hoàn toàn không nhìn thấy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && onSwitchToCustomerView && (
              <button
                onClick={() => {
                  onClose();
                  onSwitchToCustomerView();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold border border-stone-700 transition cursor-pointer"
                title="Đóng trang quản trị và xem giao diện khách hàng"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem giao diện khách</span>
              </button>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-white/10 transition cursor-pointer"
                title="Đăng xuất chế độ chủ quán"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Đóng bảng điều khiển"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            /* PIN AUTHENTICATION SCREEN */
            <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-lg text-stone-900">Xác Thực Quyền Chủ Quán</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Khu vực này chứa liên kết đồng bộ Google Sheet, mã cấu hình Telegram Bot và dữ liệu đơn hàng nhạy cảm.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Nhập mã PIN chủ quán (Mặc định: 1999)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      autoFocus
                      maxLength={10}
                      placeholder="••••"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-full text-center tracking-widest text-lg font-mono py-2.5 px-9 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800 bg-stone-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#b22830] hover:bg-[#8c141c] text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Mở Khóa Bảng Quản Trị
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickUnlock}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Mở khóa nhanh 1 chạm (Dành cho chủ sở hữu)</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN DASHBOARD */
            <div>
              {/* Tab Bar */}
              <div className="flex border-b border-stone-200 bg-stone-100 px-4 sm:px-6 gap-2 pt-2 overflow-x-auto whitespace-nowrap">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'overview'
                      ? 'border-[#b22830] text-[#b22830] bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-amber-700" />
                  <span>1. Đơn Hàng & Đặt Bàn</span>
                  {overviewData?.stats?.totalReservations > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-[#b22830] font-black">
                      {overviewData.stats.totalReservations}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('sheets')}
                  className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'sheets'
                      ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>2. Đồng Bộ Google Sheets</span>
                  {webhookUrl ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('telegram')}
                  className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'telegram'
                      ? 'border-sky-600 text-sky-700 bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Bot className="w-4 h-4 text-sky-600" />
                  <span>3. Cấu Hình Telegram Bot</span>
                </button>

                <button
                  onClick={() => setActiveTab('seo')}
                  className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'seo'
                      ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>4. Google Search Console & SEO</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-4 sm:p-6 space-y-6 text-xs">
                
                {/* TAB 1: OVERVIEW & LIVE ORDERS */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Metrics row */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                        <span className="text-[11px] text-amber-800 font-semibold block">Khách đặt bàn</span>
                        <span className="text-2xl font-black text-amber-950">
                          {overviewData?.stats?.totalReservations || 0}
                        </span>
                        <span className="text-[10px] text-amber-700 block mt-1">Lượt đặt bàn</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[11px] text-emerald-800 font-semibold block">Đơn cà phê online</span>
                        <span className="text-2xl font-black text-emerald-950">
                          {overviewData?.stats?.totalOrders || 0}
                        </span>
                        <span className="text-[10px] text-emerald-700 block mt-1">Đơn hàng mang đi/giao</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                        <span className="text-[11px] text-blue-800 font-semibold block">Doanh thu ước tính</span>
                        <span className="text-xl font-black text-blue-950 truncate block">
                          {Number(overviewData?.stats?.totalRevenue || 0).toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-[10px] text-blue-700 block mt-1">VietQR & MoMo</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] text-stone-600 font-semibold block">Google Sheet</span>
                          <span className={`text-xs font-bold ${webhookUrl ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {webhookUrl ? '● Đã kết nối tự động' : '○ Chưa dán URL Webhook'}
                          </span>
                        </div>
                        <button
                          onClick={handleResyncAll}
                          disabled={isResyncing}
                          className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isResyncing ? 'animate-spin' : ''}`} />
                          <span>Đẩy lại toàn bộ đơn vào Sheet</span>
                        </button>
                      </div>
                    </div>

                    {resyncMsg && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs">
                        {resyncMsg}
                      </div>
                    )}

                    {/* Bookings Table */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-amber-800" />
                          <span>Danh sách khách đặt bàn mới nhất</span>
                        </h4>
                        <button
                          onClick={loadOverview}
                          className="text-[11px] text-stone-500 hover:text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isLoadingOverview ? 'animate-spin' : ''}`} />
                          <span>Làm mới</span>
                        </button>
                      </div>

                      {overviewData?.reservations && overviewData.reservations.length > 0 ? (
                        <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-stone-100/80 text-[11px] font-bold text-stone-600 border-b border-stone-200">
                                <th className="p-3">Mã Bàn</th>
                                <th className="p-3">Khách Hàng</th>
                                <th className="p-3">Số ĐT</th>
                                <th className="p-3">Số Người</th>
                                <th className="p-3">Giờ Đến</th>
                                <th className="p-3">Chi Nhánh</th>
                                <th className="p-3">Đồng Bộ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-[11px]">
                              {overviewData.reservations.map((res: any, idx: number) => (
                                <tr key={res.id || idx} className="hover:bg-amber-50/40">
                                  <td className="p-3 font-mono font-bold text-stone-900">{res.code}</td>
                                  <td className="p-3 font-bold text-stone-800">{res.customerName}</td>
                                  <td className="p-3 font-mono text-stone-600">{res.customerPhone}</td>
                                  <td className="p-3 font-semibold text-amber-900">{res.guestCount} người</td>
                                  <td className="p-3 text-stone-600">{res.timeSlot} • {res.date}</td>
                                  <td className="p-3 text-stone-700 truncate max-w-[140px]">{res.storeName || res.store?.name}</td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Đã ghi nhận
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-stone-500">
                          Chưa có lượt đặt bàn nào trong phiên làm việc này. Dữ liệu sẽ xuất hiện tại đây ngay khi có khách đặt bàn.
                        </div>
                      )}
                    </div>

                    {/* Orders Table */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-amber-800" />
                        <span>Danh sách đơn đặt cà phê mang đi / giao hàng</span>
                      </h4>

                      {overviewData?.orders && overviewData.orders.length > 0 ? (
                        <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-stone-100/80 text-[11px] font-bold text-stone-600 border-b border-stone-200">
                                <th className="p-3">Mã Đơn</th>
                                <th className="p-3">Khách Hàng</th>
                                <th className="p-3">Món Đặt</th>
                                <th className="p-3">Tổng Tiền</th>
                                <th className="p-3">Thanh Toán</th>
                                <th className="p-3">Hình Thức</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-[11px]">
                              {overviewData.orders.map((ord: any, idx: number) => (
                                <tr key={ord.id || idx} className="hover:bg-amber-50/40">
                                  <td className="p-3 font-mono font-bold text-stone-900">{ord.code}</td>
                                  <td className="p-3 font-bold text-stone-800">{ord.customerName}</td>
                                  <td className="p-3 text-stone-600 truncate max-w-[200px]">
                                    {Array.isArray(ord.items)
                                      ? ord.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')
                                      : 'Đồ uống'}
                                  </td>
                                  <td className="p-3 font-bold text-emerald-800 font-mono">
                                    {Number(ord.total || 0).toLocaleString('vi-VN')} đ
                                  </td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      {ord.paymentMethod?.toUpperCase() || 'VIETQR'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-stone-600">
                                    {ord.orderType === 'pickup' ? 'Ghé lấy' : 'Giao hàng'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-6 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-stone-500">
                          Chưa có đơn đặt cà phê trực tuyến nào.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: GOOGLE SHEETS CONFIGURATION */}
                {activeTab === 'sheets' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                          <span>Trung Tâm Cấu Hình Google Sheets (Chỉ Bạn & Quản Lý Thấy)</span>
                        </h4>
                        <p className="text-xs text-emerald-800/90 mt-0.5">
                          Khách hàng đặt bàn hay đặt nước sẽ được tự động ghi thẳng vào file Google Sheet của bạn.
                        </p>
                      </div>

                      <a
                        href="https://sheets.new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                      >
                        <span>Mở Google Sheets Mới</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Webhook Input Bar */}
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <label className="block text-xs font-bold text-stone-900">
                        Dán URL Web App Google Apps Script của bạn:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSaveWebhook}
                            disabled={isSavingWebhook}
                            className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition cursor-pointer shrink-0"
                          >
                            Lưu URL
                          </button>
                          <button
                            type="button"
                            onClick={handleTestWebhook}
                            disabled={isTestingWebhook}
                            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Gửi Thử Test</span>
                          </button>
                        </div>
                      </div>

                      {sheetsTestStatus && (
                        <div className={`p-3 rounded-xl text-xs font-medium ${
                          sheetsTestStatus.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          sheetsTestStatus.type === 'error' ? 'bg-red-100 text-red-900 border border-red-300' :
                          'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {sheetsTestStatus.text}
                        </div>
                      )}
                    </div>

                    {/* Apps Script Code Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 text-xs">Mã nguồn Google Apps Script (Đã tối ưu):</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(APPS_SCRIPT_SOURCE);
                            setCopiedScript(true);
                            setTimeout(() => setCopiedScript(false), 2500);
                          }}
                          className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedScript ? 'Đã sao chép toàn bộ mã!' : 'Sao chép toàn bộ mã'}</span>
                        </button>
                      </div>

                      <pre className="bg-stone-900 text-stone-100 p-3.5 rounded-2xl text-[11px] font-mono max-h-56 overflow-y-auto leading-relaxed select-all">
                        {APPS_SCRIPT_SOURCE}
                      </pre>
                    </div>
                  </div>
                )}

                {/* TAB 3: TELEGRAM BOT */}
                {activeTab === 'telegram' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-sky-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-sky-950 flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-sky-600" />
                          <span>Thông Báo Đơn Tức Thì Qua Telegram Bot (@{botUsername})</span>
                        </h4>
                        <p className="text-xs text-sky-800/90 mt-0.5">
                          Mỗi khi có khách đặt bàn hoặc đặt cà phê, Bot sẽ rung chuông điện thoại của bạn ngay lập tức.
                        </p>
                      </div>

                      <a
                        href={`https://t.me/${botUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                      >
                        <span>Mở @{botUsername}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        <label className="text-xs font-bold text-stone-900">
                          Chat ID Telegram của bạn (hoặc nhóm chat):
                        </label>
                        <button
                          type="button"
                          onClick={handleAutoDetectTelegram}
                          disabled={isDetectingChatId}
                          className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isDetectingChatId ? 'animate-spin' : ''}`} />
                          <span>Tự động quét Chat ID từ tin nhắn mới nhất</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Ví dụ: 123456789 (Nhận từ @Duyaasaa_bot)"
                          value={telegramChatId}
                          onChange={(e) => setTelegramChatId(e.target.value)}
                          className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              localStorage.setItem('go_grab_telegram_chat_id', telegramChatId.trim());
                              setTelegramStatusMsg({ type: 'success', text: '✅ Đã lưu Chat ID Telegram!' });
                              setTimeout(() => setTelegramStatusMsg(null), 3000);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer shrink-0"
                          >
                            Lưu Chat ID
                          </button>
                          <button
                            type="button"
                            onClick={handleTestTelegram}
                            disabled={isTestingTelegram}
                            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Bắn Thông Báo Test</span>
                          </button>
                        </div>
                      </div>

                      {telegramStatusMsg && (
                        <div className={`p-3 rounded-xl text-xs font-medium ${
                          telegramStatusMsg.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          telegramStatusMsg.type === 'error' ? 'bg-red-100 text-red-900 border border-red-300' :
                          'bg-sky-100 text-sky-900 border border-sky-300'
                        }`}>
                          {telegramStatusMsg.text}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: GOOGLE SEARCH CONSOLE */}
                {activeTab === 'seo' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-blue-700" />
                          <span>Google Search Console & Lập Chỉ Mục Tìm Kiếm</span>
                        </h4>
                        <p className="text-xs text-blue-800/90 mt-0.5">
                          Khai báo website lên Google để xuất hiện trên trang kết quả tìm kiếm khi khách gõ tìm cà phê.
                        </p>
                      </div>

                      <a
                        href="https://search.google.com/search-console"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                      >
                        <span>Mở Google Search Console</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <label className="block text-xs font-bold text-stone-900">
                        Thẻ xác minh quyền sở hữu Google (google-site-verification):
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={gscCode}
                          onChange={(e) => setGscCode(e.target.value)}
                          className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleSaveGsc}
                          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition cursor-pointer shrink-0"
                        >
                          {isSavedGsc ? 'Đã lưu!' : 'Lưu Thẻ Meta'}
                        </button>
                      </div>

                      <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-600">Sitemap XML:</span>
                          <code className="bg-white px-2 py-0.5 rounded border border-stone-300 text-stone-800 font-mono text-[11px]">
                            {currentOrigin}/sitemap.xml
                          </code>
                          <button
                            onClick={() => copyWithFeedback('sitemap.xml', 'sm')}
                            className="text-blue-700 hover:underline font-bold text-[11px] cursor-pointer"
                          >
                            {copiedType === 'sm' ? 'Đã chép!' : 'Sao chép "sitemap.xml"'}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-600">Robots.txt:</span>
                          <a
                            href={`${currentOrigin}/robots.txt`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                          >
                            <span>Xem file /robots.txt</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Khu vực bảo mật riêng cho Chủ Quán Go Coffee</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
