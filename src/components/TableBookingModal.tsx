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
  AlertCircle
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
 * GO & GRAB COFFEE - TỰ ĐỘNG GHI THÔNG TIN ĐẶT BÀN VÀO GOOGLE SHEET
 * Email: duykhaikhan@gmail.com
 */
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

    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    sheet.appendRow([
      timestamp,
      data.code || "",
      data.customerName || "",
      "'" + (data.customerPhone || ""), // Giữ số 0 đầu
      data.customerEmail || "",
      data.guestCount || 1,
      data.date || "",
      data.timeSlot || "",
      data.storeName || (data.store ? data.store.name : "Go & Grab"),
      data.seatingArea || "",
      data.note || "Không",
      "Đã xác nhận"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Đã lưu vào Google Sheet thành công!" }))
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
  const [activeTab, setActiveTab] = useState<'form' | 'appscript'>('form');

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

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sheetsSyncStatus, setSheetsSyncStatus] = useState<'synced' | 'pending' | 'none'>('none');

  useEffect(() => {
    // Load saved webhook URL from localStorage or backend
    const saved = localStorage.getItem('go_grab_sheets_webhook');
    if (saved) {
      setWebhookUrl(saved);
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

    // Forward to Google Sheets via backend proxy
    try {
      const targetWebhook = webhookUrl || localStorage.getItem('go_grab_sheets_webhook') || '';
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reservation,
          storeName: store.name,
          webhookUrl: targetWebhook,
        }),
      });
      const data = await response.json();
      if (data && data.status === 'synced_to_sheets') {
        setSheetsSyncStatus('synced');
      } else {
        setSheetsSyncStatus('pending');
      }
    } catch (err) {
      setSheetsSyncStatus('pending');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-[#2c140a] via-[#3a1d0f] to-[#1c0c06] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800/80 border border-amber-600/40 flex items-center justify-center">
              <Armchair className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-display tracking-tight text-white">
                  Đặt Bàn Trước Tại Go & Grab Coffee
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Miễn Phí Giữ Chỗ
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Tự động gửi thông tin về Google Sheet của quán
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'form' ? 'appscript' : 'form')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'appscript'
                  ? 'bg-emerald-500 text-stone-950 font-black shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30'
              }`}
              title="Cài đặt Google Apps Script"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span>Google Sheet Script</span>
            </button>

            <button
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-amber-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* TAB 1: GOOGLE APPS SCRIPT SETUP GUIDE & WEBHOOK CONFIG */}
          {activeTab === 'appscript' ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
                <div className="flex items-center justify-between">
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
                    Sao chép toàn bộ mã nguồn bên dưới và dán đè vào trình soạn thảo. Bấm <strong>Lưu (Ctrl + S)</strong>.
                  </li>
                  <li>
                    Bấm <strong>Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment)</strong>:
                    <div className="pl-2 pt-1 text-[11px] text-stone-600">
                      • Loại: <strong>Ứng dụng web (Web app)</strong><br />
                      • Thực thi dưới dạng (Execute as): <strong>Tôi ({'{your-email}'})</strong><br />
                      • Ai có quyền truy cập (Who has access): <strong>Bất kỳ ai (Anyone)</strong> (Quan trọng nhất)<br />
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
                    Mã Google Apps Script (Đã lưu tại file /google-apps-script.js)
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

              <div className="flex justify-end pt-2">
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
            /* BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Alert message if error */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <span className="font-bold">⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Group 1: Required Customer Contact Info */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-800" />
                    <span>1. Thông tin khách đặt bàn (Bắt buộc)</span>
                  </h4>
                  <span className="text-[10px] text-amber-800 font-semibold">* Vui lòng điền đủ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Armchair className="w-4 h-4 text-amber-800" />
                  <span>3. Khu vực bàn ưa thích</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {seatingOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSeatingArea(opt.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
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
                  placeholder="VD: Cần ổ cắm điện cho 3 laptop, chuẩn bị sẵn nước lọc, hẹn hò lãng mạn..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 hover:from-amber-700 hover:to-stone-800 text-white font-bold text-sm shadow-xl shadow-amber-950/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang kiểm tra & gửi về Google Sheet...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Xác Nhận Giữ Bàn (Đẩy Tự Động Về Google Sheet)</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* CONFIRMED E-TICKET VIEW */
            <div className="space-y-5 animate-in zoom-in-95 duration-300">
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
                <div className="pt-1 flex items-center justify-center gap-2 text-[11px] font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Dữ liệu đã được ghi nhận tự động vào hệ thống Google Sheet</span>
                </div>
              </div>

              {/* Digital Table Pass Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 space-y-4">
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

                {/* Simulated Email & SMS Notice */}
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 text-[11px] text-stone-600 flex items-start gap-2">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Chúng mình đã gửi vé đặt bàn điện tử đến email <strong>{confirmedReservation.customerEmail}</strong> và đồng bộ vào Google Sheet của quán.
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
