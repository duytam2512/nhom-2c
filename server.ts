import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for Chat với Barista . Go Coffee
const SYSTEM_INSTRUCTION = `Bạn là Barista thông minh, am hiểu và tận tâm trong tính năng "Chat với Barista . Go Coffee" của thương hiệu cà phê "Go Coffee" (chuyên cà phê hạt nguyên chất Tây Nguyên & Cầu Đất, menu phong phú, đặt món tiện lợi lấy sau 5 phút và dịch vụ đặt bàn chu đáo).
Nhiệm vụ của bạn:
1. Tư vấn đồ uống và món ăn phù hợp với khẩu vị, tâm trạng, thời điểm (buổi sáng tỉnh táo làm việc, buổi chiều giải nhiệt thanh mát, không say caffein, ít ngọt, ăn chay):
   - Cà Phê Phin Truyền Thống Go Coffee:
     + Phin Sữa Đá (39k) - Đậm đà, thơm béo hạt rang mộc nguyên chất, món signature số 1.
     + Phin Đen Đá (35k) - Đậm vị nguyên bản, đắng thanh tao, tỉnh táo tức thì.
     + Bạc Xỉu Đá (39k) - Ngọt bùi, êm dịu nhiều sữa ít cà phê.
     + Cà Phê Muối Cố Đô (45k) - Kem muối biển béo mặn hòa cùng cà phê phin sánh đậm.
   - PhinDi Thế Hệ Mới:
     + PhinDi Hạnh Nhân (49k) - Cà phê phin kết hợp sốt hạnh nhân bùi ngậy, best-seller giới trẻ.
     + PhinDi Kem Sữa (49k) - Lớp kem sữa mịn màng êm ái.
     + PhinDi Choco (49k) - Sốt chocolate ngọt đắng quyến rũ.
   - Freeze Đá Xay & Thạch Giòn:
     + Freeze Trà Xanh (55k) - Matcha Nhật Bản đá xay lót thạch trà xanh giòn sần sật phủ kem tươi béo ngậy.
     + Caramel Phin Freeze (55k) - Cà phê phin đá xay sốt caramel bơ óng ánh và thạch cà phê giòn.
     + Cookies & Cream Freeze (55k) - Bánh cookies socola xay sữa béo.
   - Trà Tươi & Macchiato:
     + Trà Sen Vàng Hạt Sen Huế (52k) - Trà Oolong thanh tao, hạt sen hầm dẻo bùi, củ năng giòn và kem macchiato béo ngậy.
     + Trà Thạch Đào Giòn Mát (49k) - Trà đào mát lạnh kèm miếng đào tươi và thạch đào giòn.
     + Trà Thanh Đào (49k) - Hương lài thanh mát, ngọt dịu.
   - Bánh Mì & Pastry:
     + Bánh Mì Que Hải Phòng Pate Cay (25k) - Nóng giòn rụm, pate gan béo đậm đà cay tê.
     + Bánh Phô Mai Cà Phê Đặc Biệt (39k) - Cheesecake béo ngậy thơm nồng cà phê.
     + Bánh Mousse Cacao (39k) - Mềm mịn tan chảy.
   - Combo Tiết Kiệm:
     + Combo Bữa Sáng (Phin Sữa Đá + Bánh Mì Que): 55k (tiết kiệm 9k).
     + Combo Trà Chiều (Trà Sen Vàng + Bánh Phô Mai): 79k (tiết kiệm 12k).
2. Mã giảm giá độc quyền hiện có tại Go Coffee:
   - GOCOFFEE20: Giảm 20% cho đơn từ 50.000đ.
   - FREESHIP: Miễn phí giao hàng tới 18.000đ cho đơn từ 70.000đ.
   - GOCOFFEE30: Giảm 30.000đ cho đơn từ 99.000đ.
   - BANMOI15: Giảm 15.000đ cho thành viên mới.
3. Hướng dẫn các tiện ích của Go Coffee:
   - Đặt món mang đi (Quick Pickup): Chuẩn bị sẵn sau 5 phút không cần xếp hàng.
   - Đặt bàn trực tuyến: Giữ chỗ không gian phòng lạnh / sân vườn hoàn toàn miễn phí, tự động đồng bộ tức thì vào Google Sheet của quán và thông báo qua Telegram Bot (@Duyaasaa_bot).
   - Thanh toán VietQR NAPAS 24/7 tự động xác nhận trong 1s, ví MoMo, thẻ ngân hàng, tiền mặt.
4. Phong cách giao tiếp: Lịch sự, ấm áp, đậm bản sắc người Việt, xưng "mình" hoặc "Barista Go Coffee" và gọi khách là "bạn" hoặc "quý khách". Khuyến khích gợi ý món kèm nút hành động xem menu hoặc đặt bàn.`;

// API endpoint for Barista Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message } = req.body;
    const userQuery = message || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : '');

    if (!userQuery) {
      return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống' });
    }

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured yet
      return res.json({
        reply: `Chào bạn! Mình là Barista AI của Go Coffee. Rất vui được hỗ trợ bạn chọn ly thức uống đậm đà hôm nay! Bạn muốn thưởng thức vị truyền thống như Phin Sữa Đá Cầu Đất (39k), Cà Phê Muối Cố Đô (45k), thanh mát như Freeze Trà Xanh (55k) hay Trà Sen Vàng (52k)? Đừng quên nhập mã GOCOFFEE20 để được giảm ngay 20% nhé!`,
      });
    }

    // Build contents history
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      for (const m of messages.slice(-8)) {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      }
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: userQuery }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Chào bạn! Mình có thể giúp gì cho bạn về menu cà phê và đồ uống của Go Coffee hôm nay?';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini Chat API Error:', err);
    return res.status(500).json({
      error: 'Không thể kết nối tới Barista AI lúc này.',
      reply: 'Dạ hiện tại hệ thống kết nối AI đang bận. Bạn có thể thử các món bán chạy nhất của Go Coffee như: Phin Sữa Đá Đậm Vị (39.000đ) hoặc Cà Phê Muối Cố Đô (45.000đ), áp dụng mã GOCOFFEE20 để nhận ưu đãi 20% nhé!',
    });
  }
});

// Telegram Bot configuration & utilities
const DEFAULT_TELEGRAM_BOT_TOKEN = '8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw';
let telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_TELEGRAM_BOT_TOKEN;
let telegramChatId = process.env.TELEGRAM_CHAT_ID || '';

async function autoDetectChatId(): Promise<string | null> {
  if (!telegramBotToken) return null;
  try {
    const updatesRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getUpdates`);
    const updatesData = await updatesRes.json();
    if (updatesData.ok && Array.isArray(updatesData.result) && updatesData.result.length > 0) {
      // Find latest message or channel/group post
      const senders = updatesData.result
        .map((u: any) => u.message?.chat || u.my_chat_member?.chat || u.channel_post?.chat)
        .filter(Boolean);
      if (senders.length > 0) {
        const latest = senders[senders.length - 1];
        telegramChatId = String(latest.id);
        return telegramChatId;
      }
    }
  } catch (err) {
    console.error('Lỗi tự động dò Chat ID Telegram:', err);
  }
  return null;
}

async function sendTelegramNotification(text: string, overrideChatId?: string) {
  let chatId = overrideChatId || telegramChatId;

  // If chatId is not set, try auto-detecting from recent /start or group messages
  if (!chatId) {
    chatId = (await autoDetectChatId()) || '';
  }

  if (!telegramBotToken || !chatId) {
    return { 
      ok: false, 
      error: 'Chưa có Chat ID Telegram. Vui lòng mở @Duyaasaa_bot trên Telegram và bấm /start.' 
    };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    console.error('Lỗi gửi Telegram:', err);
    return { ok: false, error: err.message };
  }
}

// Telegram API endpoints
app.get('/api/telegram/status', async (_req, res) => {
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getMe`);
    const meData = await meRes.json();

    // Check updates to auto-detect chat_id if empty
    let detectedChatId = telegramChatId;
    let recentSenders: any[] = [];

    const updatesRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getUpdates`);
    const updatesData = await updatesRes.json();

    if (updatesData.ok && Array.isArray(updatesData.result) && updatesData.result.length > 0) {
      recentSenders = updatesData.result
        .map((u: any) => u.message?.chat || u.my_chat_member?.chat || u.channel_post?.chat)
        .filter(Boolean);

      if (!detectedChatId && recentSenders.length > 0) {
        detectedChatId = String(recentSenders[recentSenders.length - 1].id);
        telegramChatId = detectedChatId;
      }
    }

    return res.json({
      ok: true,
      bot: meData.result,
      chatId: telegramChatId,
      detectedChatId,
      recentSenders,
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/telegram/config', (req, res) => {
  const { chatId, botToken } = req.body;
  if (chatId !== undefined) {
    telegramChatId = String(chatId).trim();
  }
  if (botToken) {
    telegramBotToken = String(botToken).trim();
  }
  return res.json({
    ok: true,
    chatId: telegramChatId,
    botToken: telegramBotToken,
  });
});

app.post('/api/telegram/test', async (req, res) => {
  let targetChatId = req.body.chatId || telegramChatId;
  if (!targetChatId) {
    targetChatId = (await autoDetectChatId()) || '';
  }

  if (!targetChatId) {
    return res.status(400).json({
      ok: false,
      error: 'Chưa phát hiện Chat ID. Hãy mở Telegram, tìm bot @Duyaasaa_bot hoặc click https://t.me/Duyaasaa_bot, bấm nút "START", rồi thử lại!',
    });
  }

  const testMessage = `☕ <b>GO COFFEE - TEST KẾT NỐI</b>
━━━━━━━━━━━━━━━━━━━━
✅ <b>Kết nối Telegram Bot thành công!</b>
🤖 Bot: <b>@Duyaasaa_bot</b>
🆔 Chat ID: <code>${targetChatId}</code>
⏰ Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
━━━━━━━━━━━━━━━━━━━━
Hệ thống sẵn sàng nhận thông tin đặt bàn & đơn hàng mới tự động đẩy về Telegram và Google Sheet!`;

  const result = await sendTelegramNotification(testMessage, targetChatId);
  return res.json(result);
});

// Google Sheets Webhook configuration & proxy
let googleSheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

app.get('/api/booking/webhook', (_req, res) => {
  return res.json({
    webhookUrl: googleSheetsWebhookUrl,
    isConfigured: Boolean(googleSheetsWebhookUrl),
  });
});

app.post('/api/booking/webhook', (req, res) => {
  const { webhookUrl } = req.body;
  googleSheetsWebhookUrl = (webhookUrl || '').trim();
  return res.json({
    success: true,
    webhookUrl: googleSheetsWebhookUrl,
    isConfigured: Boolean(googleSheetsWebhookUrl),
  });
});

// Helper function to send booking to Google Sheets Web App with query fallback
async function forwardToGoogleSheets(url: string, data: any, telegramChatIdVal?: string) {
  const cleanUrl = (url || '').trim();
  if (!cleanUrl) {
    return {
      ok: false,
      error: 'Chưa cấu hình URL Google Apps Script. Vui lòng dán link Web App (https://script.google.com/macros/s/.../exec) vào tab Google Sheet!',
    };
  }

  // Detect common mistake: pasting Spreadsheet URL instead of Web App URL
  if (cleanUrl.includes('docs.google.com/spreadsheets')) {
    return {
      ok: false,
      error: '⚠️ Bạn đang dán link bảng tính Google Sheet (docs.google.com/spreadsheets). Cần dán link Web App của Google Apps Script (bắt đầu bằng https://script.google.com/macros/s/.../exec). Hãy làm theo hướng dẫn 4 bước bên dưới!',
    };
  }

  if (cleanUrl.endsWith('/dev')) {
    console.warn('Apps Script URL is using /dev mode. Recommend /exec for production.');
  }

  try {
    const target = new URL(cleanUrl);
    // Append parameters as query string so that even if a 302 redirect downgrades POST to GET, doGet() still records the row!
    target.searchParams.set('code', data.code || 'TB-TEST');
    target.searchParams.set('customerName', data.customerName || data.name || '');
    target.searchParams.set('customerPhone', data.customerPhone || data.phone || '');
    target.searchParams.set('customerEmail', data.customerEmail || data.email || '');
    target.searchParams.set('guestCount', String(data.guestCount || 2));
    target.searchParams.set('date', data.date || '');
    target.searchParams.set('timeSlot', data.timeSlot || '');
    target.searchParams.set('storeName', data.storeName || (data.store?.name || 'Go Coffee'));
    target.searchParams.set('seatingArea', data.seatingArea || 'Khu vực chuẩn');
    target.searchParams.set('note', data.note || '');
    if (telegramChatIdVal) {
      target.searchParams.set('telegramChatId', telegramChatIdVal);
    }

    const payload = JSON.stringify({
      ...data,
      telegramChatId: telegramChatIdVal,
    });

    const resp = await fetch(target.toString(), {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });

    const responseText = await resp.text();

    // Check if Google redirected to a login page (permission issue)
    if (responseText.includes('accounts.google.com') || responseText.includes('ServiceLogin') || (responseText.includes('<!DOCTYPE') && responseText.includes('Google Drive'))) {
      return {
        ok: false,
        error: '⚠️ LỖI QUYỀN TRUY CẬP GOOGLE: Khi Triển khai (Deploy) Web App trong Apps Script, bạn chưa chọn "Ai có quyền truy cập: Bất kỳ ai" (Anyone). Hiện tại Google đang bắt đăng nhập nên website không ghi dữ liệu vào Sheet được! Hãy vào lại Apps Script -> Triển khai -> Quản lý triển khai -> Chỉnh sửa -> Chọn "Bất kỳ ai" (Anyone).',
      };
    }

    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      // not JSON
    }

    if (parsedJson && parsedJson.status === 'error') {
      return {
        ok: false,
        error: 'Google Apps Script trả về lỗi: ' + (parsedJson.message || 'Lỗi không xác định'),
      };
    }

    return {
      ok: true,
      status: 'success',
      data: parsedJson || { text: responseText.slice(0, 150) },
    };
  } catch (err: any) {
    return {
      ok: false,
      error: 'Không thể kết nối đến Web App: ' + err.message,
    };
  }
}

// Helper function to send coffee order to Google Sheets Web App
async function forwardOrderToGoogleSheets(url: string, order: any, telegramChatIdVal?: string) {
  const cleanUrl = (url || '').trim();
  if (!cleanUrl || cleanUrl.includes('docs.google.com/spreadsheets')) {
    return { ok: false, error: 'Chưa cấu hình URL Web App Google Sheets' };
  }

  try {
    const target = new URL(cleanUrl);
    target.searchParams.set('type', 'order');
    target.searchParams.set('code', order.code || 'ORD-NEW');
    target.searchParams.set('customerName', order.customerName || 'Khách Hàng');
    target.searchParams.set('customerPhone', order.customerPhone || '');
    target.searchParams.set('customerEmail', order.customerEmail || '');
    target.searchParams.set('total', String(order.total || 0));
    target.searchParams.set('paymentMethod', order.paymentMethod || 'vietqr');
    target.searchParams.set('paymentStatus', order.paymentStatus || 'unpaid');
    target.searchParams.set('orderType', order.orderType || 'pickup');
    target.searchParams.set('deliveryAddress', order.deliveryAddress || (order.store?.name || 'Chi nhánh'));
    target.searchParams.set('note', order.customerNote || '');

    const itemsSummary = Array.isArray(order.items)
      ? order.items.map((it: any) => `${it.quantity}x ${it.name} (${it.size})`).join(', ')
      : 'Đồ uống Go Coffee';
    target.searchParams.set('itemsSummary', itemsSummary);

    const payload = JSON.stringify({
      type: 'order',
      ...order,
      itemsSummary,
      telegramChatId: telegramChatIdVal,
    });

    const resp = await fetch(target.toString(), {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: payload,
    });

    const responseText = await resp.text();
    return { ok: true, status: 'success', text: responseText.slice(0, 100) };
  } catch (err: any) {
    console.error('Lỗi đẩy đơn hàng tới Google Sheet:', err);
    return { ok: false, error: err.message };
  }
}

// Test endpoint for Google Sheets Webhook
app.post('/api/booking/test-sheets', async (req, res) => {
  const urlToTest = req.body.webhookUrl || googleSheetsWebhookUrl;
  const result = await forwardToGoogleSheets(
    urlToTest,
    {
      code: 'TEST-DIAGNOSTIC',
      customerName: 'Kiểm Tra Hệ Thống (Test)',
      customerPhone: '0909123456',
      customerEmail: 'duykhaikhan@gmail.com',
      guestCount: 2,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '09:00',
      storeName: 'Go Coffee - Nhà Hát Thành Phố',
      seatingArea: 'Khu làm việc thử nghiệm',
      note: 'Dòng test tự động kiểm tra kết nối từ website Go Coffee',
    },
    req.body.telegramChatId || telegramChatId
  );

  return res.json(result);
});

// Table booking endpoint: sends to Google Sheets AND Telegram Bot
app.post('/api/booking', async (req, res) => {
  const reservationData = req.body;
  const targetUrl = req.body.webhookUrl || googleSheetsWebhookUrl;
  const targetTelegramChatId = req.body.telegramChatId || telegramChatId;

  // Format message for Telegram
  const telegramMessage = `🔔 <b>CÓ KHÁCH ĐẶT BÀN MỚI TẠI GO COFFEE!</b>
━━━━━━━━━━━━━━━━━━━━
📋 <b>Mã đặt bàn:</b> <code>${reservationData.code || 'TB-NEW'}</code>
👤 <b>Họ và tên:</b> <b>${reservationData.customerName || 'Khách hàng'}</b>
📞 <b>Điện thoại:</b> <code>${reservationData.customerPhone || 'Chưa có'}</code>
📧 <b>Email:</b> ${reservationData.customerEmail || 'Chưa có'}
👥 <b>Số lượng:</b> <b>${reservationData.guestCount || 1} người</b>
📅 <b>Ngày đến:</b> ${reservationData.date || 'Hôm nay'}
⏰ <b>Khung giờ:</b> ${reservationData.timeSlot || '09:00'}
📍 <b>Chi nhánh:</b> ${reservationData.storeName || (reservationData.store?.name || 'Go Coffee')}
🪑 <b>Khu vực bàn:</b> ${reservationData.seatingArea || 'Khu vực chuẩn'}
📝 <b>Yêu cầu đặc biệt:</b> <i>${reservationData.note || 'Không có'}</i>
⏰ <b>Thời gian gửi:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
━━━━━━━━━━━━━━━━━━━━
📊 <i>Thông tin cũng được đồng bộ tự động vào Google Sheet quán!</i>`;

  // Send to Telegram Bot (@Duyaasaa_bot)
  let telegramResult: any = { ok: false };
  try {
    telegramResult = await sendTelegramNotification(telegramMessage, targetTelegramChatId);
  } catch (e: any) {
    console.error('Telegram notification error:', e);
    telegramResult = { ok: false, error: e.message };
  }

  // Forward to Google Sheets
  let sheetResult: any = { ok: false };
  if (targetUrl) {
    sheetResult = await forwardToGoogleSheets(targetUrl, reservationData, targetTelegramChatId);
  } else {
    sheetResult = {
      ok: false,
      notConfigured: true,
      error: 'Chưa dán URL Web App Google Apps Script vào tab Google Sheet.',
    };
  }

  let finalStatus = 'saved_locally';
  let message = 'Đặt bàn thành công!';

  if (sheetResult.ok && telegramResult.ok) {
    finalStatus = 'synced_to_sheets_and_telegram';
    message = 'Đã đẩy thông tin đặt bàn về Google Sheet và Telegram Bot thành công!';
  } else if (sheetResult.ok && !telegramResult.ok) {
    finalStatus = 'synced_to_sheets';
    message = 'Đã ghi nhận vào Google Sheet thành công! (Telegram Bot chưa nhận do chưa cấu hình Chat ID).';
  } else if (!sheetResult.ok && telegramResult.ok) {
    finalStatus = 'synced_to_telegram';
    message = 'Đã gửi thông báo về Telegram Bot thành công! Tuy nhiên Google Sheet chưa nhận được: ' + (sheetResult.error || 'Chưa có URL Web App');
  } else {
    finalStatus = 'saved_locally';
    message = 'Đặt bàn đã được ghi nhận trong hệ thống! (Chưa liên kết Google Sheet hoặc Telegram).';
  }

  return res.json({
    status: finalStatus,
    message,
    sheetResult,
    telegram: telegramResult,
    data: reservationData,
  });
});

// Online coffee order endpoint: sends notification to Telegram Bot
app.post('/api/order', async (req, res) => {
  const order = req.body;

  const itemsList = Array.isArray(order.items)
    ? order.items
        .map(
          (it: any) =>
            `• ${it.quantity}x <b>${it.name}</b> (Size ${it.size}, ${it.temperature === 'cold' ? 'Đá' : 'Nóng'}, Ngọt ${it.sugarLevel})`
        )
        .join('\n')
    : 'Chưa có danh sách món';

  const orderMessage = `☕ <b>CÓ ĐƠN ĐẶT CÀ PHÊ MỚI!</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Mã đơn hàng:</b> <code>${order.code || 'GNC-NEW'}</code>
👤 <b>Khách hàng:</b> ${order.customerName || 'Khách'}
📞 <b>Số ĐT:</b> <code>${order.customerPhone || 'Chưa có'}</code>
🥤 <b>Danh sách món:</b>
${itemsList}
💰 <b>Tổng tiền:</b> <b>${Number(order.total || 0).toLocaleString('vi-VN')} đ</b>
💳 <b>Thanh toán:</b> ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'VIETQR'} (${order.paymentStatus === 'paid' ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'})
🛵 <b>Hình thức:</b> ${order.orderType === 'pickup' ? `Ghé lấy tại quầy (${order.store?.name || 'Chi nhánh'})` : `Giao tận nơi: ${order.deliveryAddress || 'Địa chỉ khách'}`}
📝 <b>Ghi chú:</b> <i>${order.customerNote || 'Không có'}</i>`;

  const tgResult = await sendTelegramNotification(orderMessage);

  let sheetResult: any = { ok: false };
  if (googleSheetsWebhookUrl) {
    sheetResult = await forwardOrderToGoogleSheets(googleSheetsWebhookUrl, order, telegramChatId);
  }

  return res.json({ 
    ok: true, 
    telegram: tgResult, 
    sheet: sheetResult 
  });
});

async function startServer() {
  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
