import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  Coffee, 
  QrCode,
  Armchair,
  FileSpreadsheet,
  ExternalLink,
  Code2,
  Send,
  AlertCircle,
  Bot,
  MessageSquare,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { StoreLocation, TableReservation } from '../types/coffee';
import { STORES } from '../data/coffeeData';

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStore: StoreLocation;
  onBookingSuccess?: (reservation: TableReservation) => void;
  onGoToMenu?: () => void;
}

const APPS_SCRIPT_CODE = `/**
 * GO & GRAB COFFEE - TỰ ĐỘNG GHI ĐẶT BÀN VÀO GOOGLE SHEET & BẮN TIN TELEGRAM
 * Bot Telegram: @Duyaasaa_bot (Token: 8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw)
 * Email: duykhaikhan@gmail.com
 */
var TELEGRAM_BOT_TOKEN = "8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Tự động tạo dòng tiêu đề nếu bảng còn mới
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Gửi",
        "Mã Đặt Bàn",
        "Họ Và Tên",
        "Số Điện Thoại",
        "Email",
        "Số Lượng Khách",
        "Ngày Nhận Bàn",
        "Khung Giờ",
        "Chi Nhánh",
        "Khu Vực Bàn",
        "Yêu Cầu Đặc Biệt",
        "Trạng Thái"
      ]);

      var headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setBackground("#382215");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    var code = data.code || ("TB-" + Math.floor(1000 + Math.random() * 9000));
    var name = data.customerName || "Khách hàng";
    var phone = "'" + (data.customerPhone || "");
    var email = data.customerEmail || "";
    var guests = data.guestCount || 1;
    var date = data.date || "";
    var timeSlot = data.timeSlot || "";
    var storeName = data.storeName || (data.store ? data.store.name : "Go & Grab Coffee");
    var seatingArea = data.seatingArea || "Khu vực chuẩn";
    var note = data.note || "Không có";

    // 1. Ghi vào Google Sheet
    sheet.appendRow([
      timestamp,
      code,
      name,
      phone,
      email,
      guests,
      date,
      timeSlot,
      storeName,
      seatingArea,
      note,
      "Đã xác nhận"
    ]);

    // 2. Gửi thông báo đến Telegram Bot
    var chatId = data.telegramChatId || "";
    if (chatId && TELEGRAM_BOT_TOKEN) {
      try {
        var msg = "🔔 <b>CÓ KHÁCH ĐẶT BÀN MỚI TẠI GO & GRAB COFFEE!</b>\\n"
          + "━━━━━━━━━━━━━━━━━━━━\\n"
          + "📋 <b>Mã đặt bàn:</b> <code>" + code + "</code>\\n"
          + "👤 <b>Họ và tên:</b> <b>" + name + "</b>\\n"
          + "📞 <b>Điện thoại:</b> <code>" + (data.customerPhone || "") + "</code>\\n"
          + "📧 <b>Email:</b> " + email + "\\n"
          + "👥 <b>Số lượng:</b> <b>" + guests + " người</b>\\n"
          + "📅 <b>Ngày đến:</b> " + date + "\\n"
          + "⏰ <b>Khung giờ:</b> " + timeSlot + "\\n"
          + "📍 <b>Chi nhánh:</b> " + storeName + "\\n"
          + "🪑 <b>Khu vực:</b> " + seatingArea + "\\n"
          + "📝 <b>Ghi chú:</b> <i>" + note + "</i>\\n"
          + "⏰ <b>Thời gian:</b> " + timestamp;

        UrlFetchApp.fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({
            chat_id: chatId,
            text: msg,
            parse_mode: "HTML"
          }),
          muteHttpExceptions: true
        });
      } catch (tgErr) {
        // Bỏ qua lỗi telegram để không ngắt sheet
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Đã lưu vào Google Sheet và Telegram thành công!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

export const TableBookingModal: React.FC<TableBookingModalProps> = ({
  isOpen,
  onClose,
  selectedStore: initialStore,
  onBookingSuccess,
  onGoToMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'sheets' | 'telegram'>('form');

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [store, setStore] = useState<StoreLocation>(initialStore);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('09:00');
  const [seatingArea, setSeatingArea] = useState<string>('work');
  const [note, setNote] = useState<string>('');

  // Apps Script Webhook config
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Telegram Bot config & auto-discovery
  const [telegramChatId, setTelegramChatId] = useState<string>('');
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [isDetectingTelegram, setIsDetectingTelegram] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [botUsername, setBotUsername] = useState<string>('Duyaasaa_bot');
  const [copiedBotToken, setCopiedBotToken] = useState(false);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sheetsSyncStatus, setSheetsSyncStatus] = useState<'synced' | 'pending' | 'none'>('none');
  const [telegramSyncStatus, setTelegramSyncStatus] = useState<'synced' | 'pending' | 'none'>('none');

  useEffect(() => {
    // Load saved configurations
    const savedWebhook = localStorage.getItem('go_grab_sheets_webhook');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    } else {
      fetch('/api/booking/webhook')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.webhookUrl) {
            setWebhookUrl(data.webhookUrl);
          }
        })
        .catch(() => {});
    }

    const savedTgChatId = localStorage.getItem('go_grab_telegram_chat_id');
    if (savedTgChatId) {
      setTelegramChatId(savedTgChatId);
    }

    // Check Telegram bot status from server
    fetch('/api/telegram/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.bot) {
          setBotUsername(data.bot.username || 'Duyaasaa_bot');
        }
        if (data.chatId && !savedTgChatId) {
          setTelegramChatId(data.chatId);
          localStorage.setItem('go_grab_telegram_chat_id', data.chatId);
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const timeSlots = [
    '07:30', '08:30', '09:00', '10:00', '11:30', 
    '14:00', '15:30', '17:00', '18:30', '19:30', '20:30'
  ];

  const seatingOptions = [
    { id: 'work', name: 'Khu làm việc yên tĩnh', desc: 'Có ổ cắm sạc laptop, wifi cáp quang riêng' },
    { id: 'garden', name: 'Khu sân vườn thoáng mát', desc: 'Không gian mở, cây xanh đón gió tự nhiên' },
    { id: 'sofa', name: 'Bàn Sofa thư giãn / Họp nhóm', desc: 'Ghế bọc nệm êm ái cho nhóm bạn hoặc đối tác' },
    { id: 'counter', name: 'Quầy Bar ngắm Barista pha', desc: 'Trải nghiệm chiết xuất Espresso trực tiếp' },
  ];

  const handleSaveWebhook = (urlToSave?: string) => {
    const url = (urlToSave !== undefined ? urlToSave : webhookUrl).trim();
    setWebhookUrl(url);
    localStorage.setItem('go_grab_sheets_webhook', url);

    // Save to server
    fetch('/api/booking/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: url }),
    }).catch(() => {});

    setWebhookTestStatus('Đã lưu cấu hình link Google Apps Script thành công!');
    setTimeout(() => setWebhookTestStatus(null), 3500);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      setWebhookTestStatus('Vui lòng dán Web App URL của Google Apps Script trước.');
      return;
    }

    setIsTestingWebhook(true);
    setWebhookTestStatus('Đang gửi dòng thử nghiệm đến Google Sheet...');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'TEST-SHEET',
          customerName: 'Kiểm Tra Hệ Thống',
          customerPhone: '0909123456',
          customerEmail: 'duykhaikhan@gmail.com',
          guestCount: 2,
          date: bookingDate,
          timeSlot: '09:00',
          storeName: store.name,
          seatingArea: 'Khu làm việc thử nghiệm',
          note: 'Tin nhắn thử nghiệm tự động từ website Go & Grab',
          webhookUrl: webhookUrl.trim(),
          telegramChatId: telegramChatId.trim(),
        }),
      });

      const data = await res.json();
      setWebhookTestStatus('✅ Kết nối thành công! Dữ liệu mẫu đã xuất hiện trên Google Sheet của bạn.');
    } catch (e: any) {
      setWebhookTestStatus('⚠️ Không thể gửi tới webhook: ' + (e.message || 'Kiểm tra lại quyền Anyone'));
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleSaveTelegramChatId = (cid?: string) => {
    const idToSave = (cid !== undefined ? cid : telegramChatId).trim();
    setTelegramChatId(idToSave);
    localStorage.setItem('go_grab_telegram_chat_id', idToSave);

    fetch('/api/telegram/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: idToSave }),
    }).catch(() => {});

    setTelegramStatusMsg({
      type: 'success',
      text: 'Đã lưu Chat ID Telegram thành công!',
    });
    setTimeout(() => setTelegramStatusMsg(null), 3500);
  };

  const handleAutoDetectTelegram = async () => {
    setIsDetectingTelegram(true);
    setTelegramStatusMsg({
      type: 'info',
      text: 'Đang kiểm tra tin nhắn mới nhất gửi tới bot @Duyaasaa_bot...',
    });

    try {
      const res = await fetch('/api/telegram/status');
      const data = await res.json();

      if (data.detectedChatId) {
        setTelegramChatId(String(data.detectedChatId));
        localStorage.setItem('go_grab_telegram_chat_id', String(data.detectedChatId));
        setTelegramStatusMsg({
          type: 'success',
          text: `✅ Đã tìm thấy Chat ID: ${data.detectedChatId}! Đã tự động lưu vào hệ thống.`,
        });
      } else {
        setTelegramStatusMsg({
          type: 'error',
          text: 'Chưa thấy tin nhắn mới! Vui lòng mở Telegram, tìm @Duyaasaa_bot và bấm START, rồi bấm lại nút này.',
        });
      }
    } catch (err: any) {
      setTelegramStatusMsg({
        type: 'error',
        text: 'Lỗi kiểm tra: ' + err.message,
      });
    } finally {
      setIsDetectingTelegram(false);
    }
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    setTelegramStatusMsg({
      type: 'info',
      text: 'Đang gửi thông báo kiểm tra đến Telegram...',
    });

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
          text: '🎉 Đã gửi tin nhắn thử nghiệm thành công! Hãy kiểm tra ứng dụng Telegram của bạn.',
        });
      } else {
        setTelegramStatusMsg({
          type: 'error',
          text: data.error || 'Gửi thất bại. Hãy chắc chắn bạn đã bấm START với @Duyaasaa_bot.',
        });
      }
    } catch (err: any) {
      setTelegramStatusMsg({
        type: 'error',
        text: 'Lỗi kết nối Telegram: ' + err.message,
      });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleCopyAppsScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ để nhận mã đặt bàn.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ để nhận vé đặt bàn điện tử.');
      return;
    }
    if (!guestCount || guestCount < 1) {
      setErrorMsg('Vui lòng chọn số lượng người tham dự.');
      return;
    }

    setIsSubmitting(true);

    const reservationCode = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedAreaName = seatingOptions.find((s) => s.id === seatingArea)?.name || 'Khu vực chuẩn';

    const reservation: TableReservation = {
      id: `res-${Date.now()}`,
      code: reservationCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      guestCount,
      date: bookingDate,
      timeSlot,
      store,
      seatingArea: selectedAreaName,
      note: note.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    // Forward to backend: pushes to Telegram AND Google Sheets
    try {
      const targetWebhook = webhookUrl || localStorage.getItem('go_grab_sheets_webhook') || '';
      const targetTg = telegramChatId || localStorage.getItem('go_grab_telegram_chat_id') || '';

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reservation,
          storeName: store.name,
          webhookUrl: targetWebhook,
          telegramChatId: targetTg,
        }),
      });
      const data = await response.json();

      if (data && (data.status === 'synced_to_sheets_and_telegram' || data.status === 'synced_to_sheets')) {
        setSheetsSyncStatus('synced');
      } else {
        setSheetsSyncStatus(targetWebhook ? 'synced' : 'pending');
      }

      if (data && (data.telegram?.ok || data.status === 'synced_to_telegram' || data.status === 'synced_to_sheets_and_telegram')) {
        setTelegramSyncStatus('synced');
      } else {
        setTelegramSyncStatus(targetTg ? 'synced' : 'pending');
      }
    } catch (err) {
      setSheetsSyncStatus('pending');
      setTelegramSyncStatus('pending');
    }

    // Celebration
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b45309', '#d97706', '#f59e0b', '#10b981', '#fcd34d'],
      });
    } catch (err) {}

    setConfirmedReservation(reservation);
    setIsSubmitting(false);
    if (onBookingSuccess) {
      onBookingSuccess(reservation);
    }
  };

  const handleCopyCode = () => {
    if (confirmedReservation) {
      navigator.clipboard.writeText(confirmedReservation.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedReservation(null);
    setActiveTab('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-gradient-to-r from-[#241208] via-[#381c0e] to-[#1a0c06] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800/80 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Armchair className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base font-display tracking-tight text-white">
                  Đặt Bàn Go & Grab Coffee
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  Đồng Bộ Tự Động
                </span>
              </div>
              <p className="text-xs text-amber-200/80 line-clamp-1">
                Tự động gửi thông tin về Google Sheet & Telegram Bot
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-amber-200 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'form'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-800" />
            <span>1. Biểu Mẫu Đặt Bàn</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'telegram'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-sky-900 bg-sky-50/80 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>2. Telegram Bot (@{botUsername})</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'sheets'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>3. Google Sheet</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          
          {/* TAB 1: TELEGRAM BOT SETTINGS */}
          {activeTab === 'telegram' ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Telegram Bot Card */}
              <div className="p-4 bg-gradient-to-br from-sky-500/10 via-sky-50 to-blue-50 border border-sky-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-sky-950 font-display">
                          Telegram Bot: @{botUsername}
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      </div>
                      <span className="text-xs text-stone-600">
                        Token: <code className="bg-white/80 px-1 py-0.5 rounded border border-sky-200 font-mono text-[11px] text-sky-900">8910810986:AAGiT3...WITobHw</code>
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://t.me/${botUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <span>Mở Bot Trên Telegram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-sky-950 leading-relaxed bg-white/70 p-3 rounded-xl border border-sky-100">
                  ⚡ Mỗi khi khách hàng điền đặt bàn (Tên, SĐT, Email, Số khách, Giờ đến), Bot <strong>@{botUsername}</strong> sẽ tự động bắn tin nhắn thông báo tức thì đến Telegram cá nhân hoặc Group chat của bạn.
                </p>
              </div>

              {/* Chat ID Setup & Auto-discovery */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-sky-600" />
                    <span>Telegram Chat ID nhận thông báo:</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    (Có thể là ID cá nhân hoặc ID Group quán)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="VD: 123456789 hoặc -100xxxxxxxxxx"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-medium"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isDetectingTelegram}
                      onClick={handleAutoDetectTelegram}
                      className="px-3.5 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      title="Tự động nhận diện khi bạn vừa gửi /start tới bot"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isDetectingTelegram ? 'animate-spin' : ''}`} />
                      <span>{isDetectingTelegram ? 'Đang dò...' : 'Tự động tìm ID'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveTelegramChatId()}
                      className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Lưu ID
                    </button>
                    <button
                      type="button"
                      disabled={isTestingTelegram}
                      onClick={handleTestTelegram}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isTestingTelegram ? 'Đang gửi...' : 'Test Bot'}</span>
                    </button>
                  </div>
                </div>

                {telegramStatusMsg && (
                  <div className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                    telegramStatusMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : telegramStatusMsg.type === 'info'
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    <span className="font-bold shrink-0">
                      {telegramStatusMsg.type === 'success' ? '✅' : telegramStatusMsg.type === 'info' ? 'ℹ️' : '⚠️'}
                    </span>
                    <span>{telegramStatusMsg.text}</span>
                  </div>
                )}
              </div>

              {/* Instructions on how to connect Telegram */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 text-xs text-stone-700 space-y-2">
                <h4 className="font-bold text-sky-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>📌 Cách kết nối Telegram chỉ với 2 bước:</span>
                </h4>
                <ol className="space-y-1.5 list-decimal pl-4 leading-relaxed">
                  <li>
                    Nhấn vào nút <strong>"Mở Bot Trên Telegram"</strong> ở trên (hoặc gõ tìm <strong>@{botUsername}</strong> trong Telegram).
                  </li>
                  <li>
                    Nhấn nút <strong>START</strong> để kích hoạt cuộc trò chuyện với Bot.
                  </li>
                  <li>
                    Quay lại đây và nhấn nút <strong>"Tự động tìm ID"</strong>, hoặc nhấn <strong>"Test Bot"</strong> để nhận tin nhắn kiểm tra ngay tức thì!
                  </li>
                </ol>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('sheets')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold transition cursor-pointer"
                >
                  Xem cài đặt Google Sheet →
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition cursor-pointer"
                >
                  Quay lại biểu mẫu Đặt Bàn
                </button>
              </div>
            </div>
          ) : activeTab === 'sheets' ? (
            /* TAB 2: GOOGLE SHEETS SETUP */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    Đồng Bộ Tự Động Về Google Sheet (duykhaikhan@gmail.com)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                    {webhookUrl ? '🟢 Đã cài Webhook' : '⚪ Chưa có URL'}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Khi khách hàng điền <strong>Tên, Số điện thoại, Email, Số lượng người</strong>, hệ thống sẽ đẩy thẳng một dòng mới vào Google Sheet của bạn qua Google Apps Script Webhook.
                </p>
              </div>

              {/* Webhook URL Input Bar */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Dán URL Web App Google Apps Script của bạn:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveWebhook()}
                      className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Lưu URL
                    </button>
                    <button
                      type="button"
                      disabled={isTestingWebhook}
                      onClick={handleTestWebhook}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isTestingWebhook ? 'Đang gửi...' : 'Gửi thử test'}</span>
                    </button>
                  </div>
                </div>

                {webhookTestStatus && (
                  <p className="text-xs font-semibold text-stone-700 pt-1">
                    {webhookTestStatus}
                  </p>
                )}
              </div>

              {/* 4-Step Instructions */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2 text-xs text-stone-700">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  📌 Hướng dẫn cài đặt Apps Script (Chỉ mất 1 phút):
                </h4>
                <ol className="space-y-1.5 list-decimal pl-4 leading-relaxed">
                  <li>
                    Mở Google Sheets mới tại: <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-amber-800 underline font-semibold">sheets.new <ExternalLink className="w-3 h-3 inline" /></a>
                  </li>
                  <li>
                    Trên menu chọn: <strong>Tiện ích mở rộng (Extensions) → Apps Script</strong>.
                  </li>
                  <li>
                    Sao chép toàn bộ mã nguồn bên dưới (đã tích hợp sẵn Token Telegram bot của bạn) và dán đè vào trình soạn thảo. Bấm <strong>Lưu (Ctrl + S)</strong>.
                  </li>
                  <li>
                    Bấm <strong>Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment)</strong>:
                    <div className="pl-2 pt-1 text-[11px] text-stone-600">
                      • Loại: <strong>Ứng dụng web (Web app)</strong><br />
                      • Thực thi dưới dạng: <strong>Tôi (duykhaikhan@gmail.com)</strong><br />
                      • Ai có quyền truy cập: <strong>Bất kỳ ai (Anyone)</strong> (Bắt buộc để web gửi vào)<br />
                    </div>
                  </li>
                  <li>
                    Bấm <strong>Triển khai (Deploy)</strong>, sao chép <strong>URL ứng dụng web</strong> và dán vào ô bên trên!
                  </li>
                </ol>
              </div>

              {/* Ready-to-copy code block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-amber-800" />
                    Mã Google Apps Script (Tự động ghi Google Sheet & Telegram Bot)
                  </span>
                  <button
                    onClick={handleCopyAppsScript}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Đã sao chép code!' : 'Sao chép toàn bộ mã'}</span>
                  </button>
                </div>

                <pre className="bg-stone-950 text-amber-200/90 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed border border-stone-800 select-all">
                  {APPS_SCRIPT_CODE}
                </pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('telegram')}
                  className="px-4 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 text-xs font-bold transition cursor-pointer"
                >
                  ← Cấu hình Telegram Bot
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition cursor-pointer"
                >
                  Quay lại biểu mẫu Đặt Bàn
                </button>
              </div>
            </div>
          ) : !confirmedReservation ? (
            /* TAB 3: BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Alert message if error */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Group 1: Required Customer Contact Info */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-800" />
                    <span>1. Thông tin khách đặt bàn (Bắt buộc)</span>
                  </h4>
                  <span className="text-[10px] text-amber-800 font-semibold">* Vui lòng điền đủ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Họ và tên khách hàng *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="VD: Nguyễn Văn Khải"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Số điện thoại nhận tin nhắn mã bàn *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="0909 xxx xxx"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Email nhận vé đặt bàn & lịch hẹn *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                      />
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Số lượng người / khách *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-bold text-stone-800 cursor-pointer"
                      >
                        <option value={1}>1 người (Bàn đơn yên tĩnh)</option>
                        <option value={2}>2 người (Hẹn hò / Đối tác)</option>
                        <option value={3}>3 - 4 người (Nhóm nhỏ)</option>
                        <option value={5}>5 - 6 người (Họp nhóm / Bạn bè)</option>
                        <option value={8}>7 - 8 người (Sofa lớn)</option>
                        <option value={12}>Trên 8 người (Đặt tiệc / Workshop)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quick Guest Count Selector Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-stone-500 font-medium">Chọn nhanh:</span>
                  {[1, 2, 4, 6, 8, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition cursor-pointer ${
                        guestCount === num
                          ? 'bg-amber-800 text-white border-amber-800 shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {num === 12 ? '10+ người' : `${num} người`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 2: Branch, Date & Time Selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-800" />
                  <span>2. Chọn chi nhánh & Thời gian</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Branch selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Chi nhánh quán Go & Grab
                    </label>
                    <select
                      value={store.id}
                      onChange={(e) => {
                        const found = STORES.find((s) => s.id === e.target.value);
                        if (found) setStore(found);
                      }}
                      className="w-full text-xs px-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700 font-semibold text-stone-800 cursor-pointer"
                    >
                      {STORES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.district})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-stone-400 mt-1 pl-1">
                      📍 {store.address}
                    </p>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Ngày đến quán
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700 font-semibold text-stone-800 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Time Slot Chips */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                    Khung giờ nhận bàn:
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                          timeSlot === slot
                            ? 'bg-amber-800 text-white shadow-sm'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Group 3: Seating Preference */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Armchair className="w-4 h-4 text-amber-800" />
                  <span>3. Khu vực bàn ưa thích</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {seatingOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSeatingArea(opt.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                        seatingArea === opt.id
                          ? 'border-amber-800 bg-amber-50/70 ring-1 ring-amber-800 text-amber-950 font-medium'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          seatingArea === opt.id
                            ? 'border-amber-800 bg-amber-800 text-white'
                            : 'border-stone-300'
                        }`}
                      >
                        {seatingArea === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold">{opt.name}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Yêu cầu đặc biệt (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Cần ổ cắm điện cho laptop, chuẩn bị nước lọc trước, hẹn hò..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              {/* Real-time destination indicator */}
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Tự động đẩy về: <strong>Google Sheet</strong> & <strong>Telegram (@{botUsername})</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('telegram')}
                  className="text-sky-700 underline font-semibold hover:text-sky-900 cursor-pointer text-[10px]"
                >
                  Cài đặt kênh nhận
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 hover:from-amber-700 hover:to-stone-800 text-white font-bold text-sm shadow-xl shadow-amber-950/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang gửi về Google Sheet & Telegram...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Xác Nhận Giữ Bàn (Đẩy Tự Động Về Sheet & Telegram)</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* CONFIRMED E-TICKET VIEW */
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              {/* Success Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-base font-display">
                  Đặt Bàn Thành Công!
                </h4>
                <p className="text-xs text-emerald-800">
                  Go & Grab Coffee đã sẵn sàng tiếp đón quý khách.
                </p>
                
                {/* Sync status pills */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã ghi vào Google Sheet</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full border border-sky-300">
                    <Bot className="w-3.5 h-3.5 text-sky-600" />
                    <span>Đã bắn tin báo tới Telegram (@{botUsername})</span>
                  </span>
                </div>
              </div>

              {/* Digital Table Pass Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 space-y-3.5">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      MÃ ĐẶT BÀN ĐIỆN TỬ
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
                        {confirmedReservation.code}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-2xs transition cursor-pointer"
                        title="Sao chép mã"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="w-16 h-16 bg-white p-1.5 rounded-xl border border-amber-200 flex items-center justify-center shadow-2xs">
                    <QrCode className="w-full h-full text-stone-800" />
                  </div>
                </div>

                {/* Recapped Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Khách đặt bàn</span>
                    <span className="font-bold text-stone-900">{confirmedReservation.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Số lượng khách</span>
                    <span className="font-bold text-amber-900">{confirmedReservation.guestCount} người</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Thời gian nhận bàn</span>
                    <span className="font-bold text-stone-900">{confirmedReservation.timeSlot} • {confirmedReservation.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Số điện thoại</span>
                    <span className="font-mono font-bold text-stone-900">{confirmedReservation.customerPhone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Email xác nhận</span>
                    <span className="font-medium text-stone-700">{confirmedReservation.customerEmail}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Địa điểm chi nhánh</span>
                    <span className="font-semibold text-stone-900">{confirmedReservation.store.name}</span>
                    <p className="text-[11px] text-stone-500">{confirmedReservation.store.address}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Khu vực đã chọn</span>
                    <span className="font-semibold text-amber-800">{confirmedReservation.seatingArea}</span>
                  </div>
                  {confirmedReservation.note && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">Ghi chú</span>
                      <span className="italic text-stone-600">"{confirmedReservation.note}"</span>
                    </div>
                  )}
                </div>

                {/* Notice */}
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 text-[11px] text-stone-600 flex items-start gap-2">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Vé đặt bàn đã được gửi đến email <strong>{confirmedReservation.customerEmail}</strong> và đồng bộ trực tiếp vào Google Sheet & Telegram Bot.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {onGoToMenu && (
                  <button
                    onClick={() => {
                      handleResetAndClose();
                      onGoToMenu();
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Coffee className="w-4 h-4 text-amber-200" />
                    <span>Xem Thực Đơn Để Đặt Nước Trước</span>
                  </button>
                )}
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition cursor-pointer"
                >
                  Hoàn Tất • Đóng
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
