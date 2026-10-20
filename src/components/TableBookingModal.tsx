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
  RefreshCw,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { StoreLocation, TableReservation } from '../types/coffee';
import { STORES } from '../data/coffeeData';

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStore: StoreLocation;
  onBookingSuccess?: (reservation: TableReservation) => void;
  onGoToMenu?: () => void;
  initialTab?: 'form' | 'sheets' | 'telegram';
}

const APPS_SCRIPT_CODE = `/**
 * GO COFFEE - APPS SCRIPT ĐỒNG BỘ GOOGLE SHEET & TELEGRAM BOT
 * Bot Telegram: @Duyaasaa_bot (Token: 8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw)
 * Email chủ quán: duykhaikhan@gmail.com
 *
 * ⚠️ QUAN TRỌNG KHI TRIỂN KHAI (DEPLOY):
 * 1. Mở sheets.new -> Tiện ích mở rộng -> Apps Script -> dán mã này -> Lưu (Ctrl + S)
 * 2. Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
 * 3. Loại: Ứng dụng web (Web app)
 * 4. Thực thi dưới dạng: Tôi (duykhaikhan@gmail.com)
 * 5. BẮT BUỘC: "Ai có quyền truy cập" (Who has access) -> Chọn "Bất kỳ ai" (Anyone)
 * 6. Copy Web App URL kết thúc bằng /exec và dán vào website Go Coffee!
 */

var TELEGRAM_BOT_TOKEN = "8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw";
var DEFAULT_TELEGRAM_CHAT_ID = ""; // Điền Chat ID Telegram của bạn nếu muốn

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#382215");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// 1. Ghi nhận Đặt Bàn Giữ Chỗ
function recordBooking(data) {
  var headers = [
    "Thời Gian Đặt",
    "Mã Đặt Bàn",
    "Họ Và Tên",
    "Số Điện Thoại",
    "Email",
    "Số Lượng Khách",
    "Ngày Nhận Bàn",
    "Khung Giờ",
    "Chi Nhánh",
    "Khu Vực Bàn",
    "Ghi Chú",
    "Trạng Thái"
  ];
  var sheet = getOrCreateSheet("Đặt Bàn Go Coffee", headers);

  var timestamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  var code = data.code || ("TB-" + Math.floor(1000 + Math.random() * 9000));
  var name = data.customerName || data.name || "Khách Hàng";
  var phone = "'" + (data.customerPhone || data.phone || "");
  var email = data.customerEmail || data.email || "";
  var guests = data.guestCount || data.guests || 2;
  var date = data.date || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd");
  var timeSlot = data.timeSlot || "09:00";
  var storeName = data.storeName || (data.store ? data.store.name : "Go Coffee");
  var seatingArea = data.seatingArea || "Khu vực chuẩn";
  var note = data.note || "Không có";

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

  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 2).setHorizontalAlignment("center");
  sheet.getRange(lastRow, 6).setHorizontalAlignment("center");
  sheet.getRange(lastRow, 7).setHorizontalAlignment("center");
  sheet.getRange(lastRow, 8).setHorizontalAlignment("center");
  sheet.getRange(lastRow, 12).setHorizontalAlignment("center");

  // Gửi thông báo đến Telegram Bot
  var chatId = data.telegramChatId || DEFAULT_TELEGRAM_CHAT_ID;
  if (chatId && TELEGRAM_BOT_TOKEN) {
    try {
      var msg = "🔔 <b>CÓ KHÁCH ĐẶT BÀN MỚI TẠI GO COFFEE!</b>\\n"
        + "━━━━━━━━━━━━━━━━━━━━\\n"
        + "📋 <b>Mã đặt bàn:</b> <code>" + code + "</code>\\n"
        + "👤 <b>Họ và tên:</b> <b>" + name + "</b>\\n"
        + "📞 <b>Điện thoại:</b> <code>" + (data.customerPhone || data.phone || "") + "</code>\\n"
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
        payload: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
        muteHttpExceptions: true
      });
    } catch (tgErr) {}
  }

  return { success: true, code: code, row: lastRow, timestamp: timestamp };
}

// 2. Ghi nhận Đơn Hàng Cà Phê Trực Tuyến
function recordOrder(data) {
  var headers = [
    "Thời Gian Đặt",
    "Mã Đơn Hàng",
    "Tên Khách Hàng",
    "Số Điện Thoại",
    "Email",
    "Hình Thức",
    "Địa Chỉ / Quán Lấy",
    "Danh Sách Món",
    "Tổng Tiền",
    "Thanh Toán",
    "Trạng Thái",
    "Ghi Chú"
  ];
  var sheet = getOrCreateSheet("Đơn Hàng Go Coffee", headers);

  var timestamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  var code = data.code || ("ORD-" + Math.floor(1000 + Math.random() * 9000));
  var name = data.customerName || "Khách Hàng";
  var phone = "'" + (data.customerPhone || "");
  var email = data.customerEmail || "";
  var orderType = data.orderType === "delivery" ? "Giao tận nơi" : "Ghé lấy tại quầy";
  var address = data.deliveryAddress || (data.store ? data.store.name : "Quầy thu ngân");
  var items = data.itemsSummary || (Array.isArray(data.items) ? data.items.map(function(it) { return it.quantity + "x " + it.name + " (" + it.size + ")"; }).join(", ") : "Món đặt");
  var total = data.total ? Number(data.total).toLocaleString("vi-VN") + " đ" : "0 đ";
  var payment = (data.paymentMethod || "VIETQR").toUpperCase() + " (" + (data.paymentStatus === "paid" ? "Đã trả" : "Chưa trả") + ")";
  var note = data.note || data.customerNote || "Không có";

  sheet.appendRow([
    timestamp,
    code,
    name,
    phone,
    email,
    orderType,
    address,
    items,
    total,
    payment,
    "Mới nhận đơn",
    note
  ]);

  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 2).setHorizontalAlignment("center");
  sheet.getRange(lastRow, 6).setHorizontalAlignment("center");
  sheet.getRange(lastRow, 9).setHorizontalAlignment("right");
  sheet.getRange(lastRow, 11).setHorizontalAlignment("center");

  return { success: true, code: code, row: lastRow, timestamp: timestamp };
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = e.parameter || {}; }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // Phân loại: Đơn đặt món cà phê hoặc Đặt bàn
    if (data.type === "order" || data.items || data.orderCode) {
      var res = recordOrder(data);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã lưu đơn hàng vào Google Sheet!", code: res.code, row: res.row })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var res = recordBooking(data);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã lưu đặt bàn vào Google Sheet thành công!", code: res.code, row: res.row })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e && e.parameter) {
    if (e.parameter.type === "order") {
      var res = recordOrder(e.parameter);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã ghi đơn hàng vào Google Sheet!", row: res.row })).setMimeType(ContentService.MimeType.JSON);
    }
    if (e.parameter.customerName || e.parameter.name || e.parameter.test === "1") {
      var res = recordBooking(e.parameter);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã ghi đặt bàn vào Google Sheet!", row: res.row })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "online", message: "Go Coffee Webhook (Đặt bàn & Đơn hàng) đang hoạt động tốt!" })).setMimeType(ContentService.MimeType.JSON);
}

// Bấm Run hàm này để thử ghi 1 dòng mẫu Đặt Bàn ngay lập tức
function testBookingScript() {
  var res = recordBooking({
    code: "TEST-KHAI-01",
    customerName: "Duy Khải (Chủ Quán Test)",
    customerPhone: "0909123456",
    customerEmail: "duykhaikhan@gmail.com",
    guestCount: 2,
    date: Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd"),
    timeSlot: "09:00",
    storeName: "Go Coffee",
    seatingArea: "Khu làm việc yên tĩnh",
    note: "Dòng thử nghiệm đặt bàn từ Apps Script"
  });
  Logger.log("Đã thêm thành công đặt bàn dòng: " + res.row);
}

// Bấm Run hàm này để thử ghi 1 dòng mẫu Đơn Hàng ngay lập tức
function testOrderScript() {
  var res = recordOrder({
    code: "TEST-ORD-01",
    customerName: "Duy Khải (Chủ Quán Test)",
    customerPhone: "0909123456",
    customerEmail: "duykhaikhan@gmail.com",
    orderType: "pickup",
    deliveryAddress: "Go Coffee Cầu Đất",
    itemsSummary: "1x Phin Sữa Đá Cầu Đất (L), 1x Bánh mì que pate",
    total: 64000,
    paymentMethod: "vietqr",
    paymentStatus: "paid",
    note: "Thử nghiệm đơn hàng từ Apps Script"
  });
  Logger.log("Đã thêm thành công đơn hàng dòng: " + res.row);
}`;

export const TableBookingModal: React.FC<TableBookingModalProps> = ({
  isOpen,
  onClose,
  selectedStore: initialStore,
  onBookingSuccess,
  onGoToMenu,
  initialTab = 'form',
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'sheets' | 'telegram'>(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

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
  const [webhookTestStatus, setWebhookTestStatus] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
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
  const [sheetsSyncStatus, setSheetsSyncStatus] = useState<'synced' | 'failed' | 'not_configured'>('not_configured');
  const [sheetsSyncError, setSheetsSyncError] = useState<string | null>(null);
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

    if (url.includes('docs.google.com/spreadsheets')) {
      setWebhookTestStatus({
        type: 'error',
        text: '⚠️ Chú ý: Bạn vừa lưu link file bảng tính Google Sheet (docs.google.com/spreadsheets). Để đồng bộ tự động, bạn cần lấy link Web App từ Apps Script (script.google.com/macros/s/.../exec).',
      });
    } else {
      setWebhookTestStatus({
        type: 'success',
        text: '✅ Đã lưu cấu hình link Web App Google Apps Script thành công! Bấm "Gửi thử test" để kiểm tra.',
      });
    }
    setTimeout(() => setWebhookTestStatus(null), 5000);
  };

  const handleTestWebhook = async () => {
    const cleanUrl = webhookUrl.trim();
    if (!cleanUrl) {
      setWebhookTestStatus({
        type: 'error',
        text: 'Vui lòng dán Web App URL của Google Apps Script trước khi kiểm tra.',
      });
      return;
    }

    if (cleanUrl.includes('docs.google.com/spreadsheets')) {
      setWebhookTestStatus({
        type: 'error',
        text: '⚠️ Bạn đang dán link bảng tính Google Sheet (docs.google.com/spreadsheets). Cần dán link Web App của Google Apps Script (bắt đầu bằng https://script.google.com/macros/s/.../exec).',
      });
      return;
    }

    setIsTestingWebhook(true);
    setWebhookTestStatus({
      type: 'info',
      text: 'Đang gửi dòng thử nghiệm đến Google Sheet của bạn...',
    });

    try {
      const res = await fetch('/api/booking/test-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: cleanUrl,
          telegramChatId: telegramChatId.trim(),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setWebhookTestStatus({
          type: 'success',
          text: '🎉 THÀNH CÔNG RỰC RỠ! Dữ liệu mẫu đã được ghi vào Google Sheet của bạn. Hãy mở file Sheet để kiểm tra ngay!',
        });
      } else {
        setWebhookTestStatus({
          type: 'error',
          text: data.error || 'Google Sheet chưa nhận được dữ liệu. Vui lòng kiểm tra quyền "Bất kỳ ai (Anyone)".',
        });
      }
    } catch (e: any) {
      setWebhookTestStatus({
        type: 'error',
        text: '⚠️ Không thể gửi tới webhook: ' + (e.message || 'Kiểm tra lại quyền truy cập hoặc link URL'),
      });
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

      if (data && data.sheetResult?.ok) {
        setSheetsSyncStatus('synced');
        setSheetsSyncError(null);
      } else {
        if (!targetWebhook) {
          setSheetsSyncStatus('not_configured');
          setSheetsSyncError('Chưa cấu hình URL Web App Google Apps Script.');
        } else {
          setSheetsSyncStatus('failed');
          setSheetsSyncError(data?.sheetResult?.error || 'Không thể ghi vào Google Sheet. Kiểm tra quyền "Bất kỳ ai (Anyone)".');
        }
      }

      if (data && (data.telegram?.ok || data.status === 'synced_to_telegram' || data.status === 'synced_to_sheets_and_telegram')) {
        setTelegramSyncStatus('synced');
      } else {
        setTelegramSyncStatus(targetTg ? 'pending' : 'none');
      }
    } catch (err: any) {
      setSheetsSyncStatus('failed');
      setSheetsSyncError(err.message || 'Lỗi mạng khi gửi về Google Sheet.');
      setTelegramSyncStatus('none');
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
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setNote('');
    setConfirmedReservation(null);
    setActiveTab('form');
    onClose();
  };

  const isSheetConfigured = Boolean(webhookUrl && !webhookUrl.includes('docs.google.com/spreadsheets'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header - Highlands Crimson Red Styling */}
        <div className="p-4 sm:p-5 border-b border-[#630f14] flex items-center justify-between bg-gradient-to-r from-[#7a1218] via-[#9e1c24] to-[#7a1218] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
              <Armchair className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base font-display tracking-tight text-white">
                  Đặt Bàn Go Coffee
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full shadow-2xs">
                  Google Sheet & Telegram
                </span>
              </div>
              <p className="text-xs text-amber-200/80 line-clamp-1">
                Tự động đẩy thông tin đặt bàn về Google Sheet & Telegram Bot quán
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
            onClick={() => setActiveTab('sheets')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'sheets'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>2. Google Sheet</span>
            {isSheetConfigured ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
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
            <span>3. Telegram (@{botUsername})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          
          {/* TAB: GOOGLE SHEETS SETUP */}
          {activeTab === 'sheets' ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    Đồng Bộ Tự Động Về Google Sheet (duykhaikhan@gmail.com)
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    isSheetConfigured 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {isSheetConfigured ? '🟢 Đã cấu hình Webhook' : '⚪ Chưa có URL Web App'}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Khi khách hàng điền <strong>Tên, Số điện thoại, Email, Số khách</strong>, hệ thống sẽ đẩy thẳng một dòng mới vào Google Sheet của bạn.
                </p>
              </div>

              {/* Webhook URL Input Bar */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-800">
                    Dán URL Web App Google Apps Script của bạn:
                  </label>
                  <span className="text-[10px] font-mono text-stone-500">
                    Dạng: https://script.google.com/macros/s/.../exec
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
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
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {isTestingWebhook ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang test...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Gửi thử test</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Instant URL validation warning if user pasted Spreadsheet URL */}
                {webhookUrl.includes('docs.google.com/spreadsheets') && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Bạn vừa dán link file bảng tính Google Sheet (docs.google.com)!</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Để website có thể tự động ghi dữ liệu vào Sheet, bạn cần tạo <strong>Ứng dụng web (Web App)</strong> từ Apps Script để lấy link có dạng <code className="bg-white px-1 py-0.5 rounded border border-rose-200 font-mono text-[10px]">https://script.google.com/macros/s/.../exec</code> theo 4 bước dưới đây.
                    </p>
                  </div>
                )}

                {/* Live Diagnostic Message */}
                {webhookTestStatus && (
                  <div className={`p-3 rounded-xl text-xs font-medium border flex items-start gap-2 ${
                    webhookTestStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : webhookTestStatus.type === 'error'
                      ? 'bg-rose-50 text-rose-900 border-rose-300'
                      : 'bg-sky-50 text-sky-900 border-sky-300'
                  }`}>
                    {webhookTestStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : webhookTestStatus.type === 'error' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-sky-600 shrink-0 mt-0.5 animate-spin" />
                    )}
                    <span className="leading-relaxed">{webhookTestStatus.text}</span>
                  </div>
                )}
              </div>

              {/* Troubleshooting Card: 4 common reasons why Google Sheet hasn't received data */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2.5 text-xs text-stone-800">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-950 uppercase tracking-wider text-[11px]">
                  <HelpCircle className="w-4 h-4 text-amber-800" />
                  <span>🔍 Tại Sao Google Sheet Chưa Nhận Được Dữ Liệu? (Kiểm Tra 4 Điểm Sau)</span>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed">
                  <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200">
                    <strong className="text-amber-900">1. Chưa dán Web App URL vào ô bên trên:</strong>
                    <p className="text-stone-600">Bạn đã dán link Web App vào ô phía trên và bấm nút "Lưu URL" chưa? Nếu ô URL còn trống thì hệ thống chưa biết gửi về đâu.</p>
                  </div>

                  <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200">
                    <strong className="text-rose-900">2. Lỗi Quyền "Chỉ mình tôi" (LỖI PHỔ BIẾN NHẤT 95%):</strong>
                    <p className="text-stone-600">
                      Khi bấm <strong>Triển khai (Deploy) → Tùy chọn triển khai mới</strong>, ở mục <strong>"Ai có quyền truy cập" (Who has access)</strong>, bạn <strong>PHẢI CHỌN "Bất kỳ ai" (Anyone)</strong>. Nếu để mặc định là "Chỉ mình tôi", Google sẽ bắt đăng nhập và chặn website không cho ghi!
                    </p>
                  </div>

                  <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200">
                    <strong className="text-amber-900">3. Dán nhầm link file Google Sheet thay vì link Apps Script:</strong>
                    <p className="text-stone-600">
                      Link đúng bắt đầu bằng: <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[10px]">https://script.google.com/macros/s/.../exec</code>. Link sai: <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-[10px]">https://docs.google.com/spreadsheets/...</code>
                    </p>
                  </div>

                  <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200">
                    <strong className="text-stone-800">4. Thử bấm "Run" (Chạy) trực tiếp trong Google Apps Script:</strong>
                    <p className="text-stone-600">
                      Trong trình soạn thảo Apps Script, bạn có thể chọn hàm <strong>testBookingScript</strong> ở trên thanh công cụ rồi bấm nút <strong>Chạy (Run)</strong>. Nó sẽ tự động ghi ngay 1 dòng mẫu vào Sheet của bạn để bạn kiểm tra!
                    </p>
                  </div>
                </div>
              </div>

              {/* 4-Step Instructions */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-700">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  📌 Các bước triển khai Google Apps Script (Chỉ mất 1 phút):
                </h4>
                <ol className="space-y-1.5 list-decimal pl-4 leading-relaxed">
                  <li>
                    Mở Google Sheets mới tại: <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-amber-800 underline font-semibold">sheets.new <ExternalLink className="w-3 h-3 inline" /></a>
                  </li>
                  <li>
                    Trên menu chọn: <strong>Tiện ích mở rộng (Extensions) → Apps Script</strong>.
                  </li>
                  <li>
                    Sao chép toàn bộ mã nguồn bên dưới (đã tích hợp Token bot @Duyaasaa_bot) và dán đè vào trình soạn thảo. Bấm <strong>Lưu (Ctrl + S)</strong>.
                  </li>
                  <li>
                    Bấm <strong>Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment)</strong>:
                    <div className="pl-2 pt-1 text-[11px] text-stone-600 space-y-0.5">
                      <div>• Loại: <strong>Ứng dụng web (Web app)</strong></div>
                      <div>• Thực thi dưới dạng: <strong>Tôi (duykhaikhan@gmail.com)</strong></div>
                      <div className="text-amber-900 font-bold">• Ai có quyền truy cập: <strong>Bất kỳ ai (Anyone)</strong> (BẮT BUỘC)</div>
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
                    Mã Google Apps Script (Copy 1-click)
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
                  Quay lại biểu mẫu Đặt Bàn →
                </button>
              </div>
            </div>
          ) : activeTab === 'telegram' ? (
            /* TAB: TELEGRAM BOT SETTINGS */
            <div className="space-y-4 animate-in fade-in">
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
                        Token: <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-sky-200">8910810986:AAGi...</code>
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://t.me/Duyaasaa_bot"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở @Duyaasaa_bot</span>
                  </a>
                </div>

                <p className="text-xs text-sky-950 leading-relaxed">
                  Khi khách đặt bàn, bot sẽ ngay lập tức gửi tin nhắn thông báo kèm thông tin chi tiết: <strong>Mã đơn, Tên khách, Điện thoại, Email, Số khách, Giờ đến và Chi nhánh</strong>.
                </p>
              </div>

              {/* Chat ID Setup */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block text-xs font-bold text-stone-800">
                    Chat ID Telegram của bạn:
                  </label>
                  <button
                    type="button"
                    disabled={isDetectingTelegram}
                    onClick={handleAutoDetectTelegram}
                    className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 underline cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDetectingTelegram ? 'animate-spin' : ''}`} />
                    <span>Tự động tìm ID (Khi vừa bấm /start)</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="VD: 123456789 (hoặc ID nhóm -100xxx)"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-sky-600 font-mono"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveTelegramChatId()}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Lưu ID
                    </button>
                    <button
                      type="button"
                      disabled={isTestingTelegram}
                      onClick={handleTestTelegram}
                      className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isTestingTelegram ? 'Đang gửi...' : 'Test Bot'}</span>
                    </button>
                  </div>
                </div>

                {telegramStatusMsg && (
                  <div className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                    telegramStatusMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : telegramStatusMsg.type === 'error'
                      ? 'bg-rose-50 text-rose-900 border-rose-300'
                      : 'bg-sky-50 text-sky-900 border-sky-300'
                  }`}>
                    {telegramStatusMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : telegramStatusMsg.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-sky-600 shrink-0 animate-spin" />
                    )}
                    <span>{telegramStatusMsg.text}</span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-2 text-xs text-stone-700">
                <h4 className="font-bold text-sky-950 uppercase tracking-wider text-[11px]">
                  📌 Các bước kích hoạt bot trên điện thoại:
                </h4>
                <ol className="space-y-1.5 list-decimal pl-4 leading-relaxed text-stone-700">
                  <li>
                    Nhấn vào link: <a href="https://t.me/Duyaasaa_bot" target="_blank" rel="noreferrer" className="text-sky-700 font-bold underline">https://t.me/Duyaasaa_bot</a>
                  </li>
                  <li>
                    Bấm nút <strong>START</strong> (hoặc gõ <code>/start</code>).
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
          ) : !confirmedReservation ? (
            /* TAB: BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Integration Status Quick Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-600">Đồng bộ dữ liệu:</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sheets')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold transition ${
                      isSheetConfigured
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    <FileSpreadsheet className="w-3 h-3 text-emerald-700" />
                    <span>{isSheetConfigured ? 'Google Sheet: Đã kết nối' : 'Google Sheet: Chưa cài URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('telegram')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-sky-100 text-sky-800 border border-sky-300 hover:bg-sky-200 transition"
                  >
                    <Bot className="w-3 h-3 text-sky-700" />
                    <span>Telegram: @{botUsername}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('sheets')}
                  className="text-amber-800 hover:text-amber-950 font-semibold underline"
                >
                  Xem hướng dẫn
                </button>
              </div>

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
                  {[1, 2, 4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        guestCount === num
                          ? 'bg-amber-800 text-white shadow-xs'
                          : 'bg-white text-stone-700 hover:bg-amber-100/70 border border-stone-200'
                      }`}
                    >
                      {num} người
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 2: Time, Location & Seating */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>2. Chi nhánh, Thời gian & Khu vực ngồi</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Store select */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Chi nhánh quán Go Coffee
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={store.id}
                        onChange={(e) => {
                          const found = STORES.find((s) => s.id === e.target.value);
                          if (found) setStore(found);
                        }}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-bold text-stone-800 cursor-pointer"
                      >
                        {STORES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} • {s.address} ({s.district})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date picker */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Ngày nhận bàn
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                      />
                    </div>
                  </div>

                  {/* Time slot */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Khung giờ đến
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-bold text-stone-800 cursor-pointer"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Seating Area Preference */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    Chọn không gian & loại bàn mong muốn:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {seatingOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSeatingArea(opt.id)}
                        className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                          seatingArea === opt.id
                            ? 'bg-amber-900 text-white border-amber-950 shadow-sm'
                            : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                        }`}
                      >
                        <span className="font-bold text-xs">{opt.name}</span>
                        <span className={`text-[10px] mt-0.5 line-clamp-1 ${seatingArea === opt.id ? 'text-amber-200' : 'text-stone-400'}`}>
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Ghi chú đặc biệt (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VD: Cần 2 ổ cắm laptop, mang theo thú cưng, sinh nhật bạn bè..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full text-xs p-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium resize-none"
                  />
                </div>
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
                      <span>Đang ghi vào Google Sheet & Telegram...</span>
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
                  Go Coffee đã sẵn sàng tiếp đón quý khách.
                </p>
                
                {/* Sync status pills */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold">
                  {sheetsSyncStatus === 'synced' ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã ghi vào Google Sheet</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('sheets')}
                      className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Google Sheet chưa nhận: Bấm để cấu hình</span>
                    </button>
                  )}

                  {telegramSyncStatus === 'synced' ? (
                    <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full border border-sky-300">
                      <Bot className="w-3.5 h-3.5 text-sky-600" />
                      <span>Đã báo Telegram (@{botUsername})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200">
                      <Bot className="w-3.5 h-3.5 text-stone-500" />
                      <span>Telegram Bot sẵn sàng</span>
                    </span>
                  )}
                </div>

                {/* Warning note if Sheet failed */}
                {sheetsSyncStatus !== 'synced' && sheetsSyncError && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 text-left">
                    <span className="font-bold">Lưu ý về Google Sheet:</span> {sheetsSyncError}
                  </div>
                )}
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
                    Vé đặt bàn đã được ghi nhận vào hệ thống và gửi email thông báo cho quý khách.
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
