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

// System prompt for Go & Grab AI Barista
const SYSTEM_INSTRUCTION = `Bạn là "Barista AI" thông minh, tận tâm và thân thiện của thương hiệu cà phê "Go & Grab Coffee" (website: goandgrabcoffee.ai.studio).
Nhiệm vụ của bạn:
1. Tư vấn đồ uống phù hợp với khẩu vị, tâm trạng, thời điểm (buổi sáng cần tỉnh táo, buổi chiều cần sảng khoái, không say caffein, ăn kiêng / thuần chay).
2. Giới thiệu các món đặc sản của quán:
   - Cà Phê Muối Xứ Huế (39k) - Best Seller số 1, kem muối biển mặn béo ngậy.
   - Bạc Xỉu 3 Tầng Sài Gòn (35k) - Ngọt bùi, béo thơm, êm dịu.
   - Cà Phê Sữa Đá Sài Gòn (32k) - Đậm đà, hạt Cầu Đất rang mộc.
   - Cà Phê Trứng Hà Nội (45k) - Kem trứng đánh bông ấm mịn.
   - Oatly Vanilla Latte (52k) - Thuần chay (Vegan) từ sữa yến mạch Thụy Điển Oatly.
   - Caramel Macchiato Hạnh Nhân (49k).
   - Cold Brew Cam Vàng Sả 24H (46k) - Thanh mát sảng khoái.
   - Trà Sen Vàng Hạt Sen Huế (48k) - Trà Oolong cao cấp, hạt sen dẻo, macchiato béo.
   - Trà Đào Cam Sả Tươi (45k).
   - Croissant Bơ Pháp Nướng Giòn (32k), Tiramisu Hạt Dẻ (42k).
3. Hướng dẫn các mã giảm giá hiện có:
   - GRAB20: Giảm 20% cho đơn từ 50.000đ.
   - FREESHIP: Miễn phí giao hàng tới 18.000đ cho đơn từ 80.000đ.
   - BANMOI15: Giảm 15.000đ cho đơn từ 45.000đ.
4. Hướng dẫn nhận hàng & thanh toán nhanh:
   - "Go & Grab" nhận tại quầy: Chuẩn bị trong 5 phút, không xếp hàng chờ đợi.
   - Giao hàng tận nơi: 15-20 phút qua GrabBike/tài xế quán.
   - Thanh toán siêu tốc: Quét mã VietQR NAPAS 24/7 tự động đối soát trong 1s, ví MoMo, ZaloPay, Apple Pay hoặc tiền mặt.
5. Giờ mở cửa: 06:30 - 22:30 hàng ngày.
6. Phong cách trả lời: Thân thiện, lịch sự, ngắn gọn súc tích, xưng "mình" hoặc "Barista Go & Grab" và gọi khách là "bạn" hoặc "quý khách". Sử dụng tiếng Việt chuẩn.`;

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
        reply: `Chào bạn! Mình là Barista AI của Go & Grab Coffee. Rất vui được hỗ trợ bạn chọn ly cà phê hoàn hảo hôm nay! Bạn thích gu đậm đà như Cà phê Muối Cố Đô (39k) hay thanh mát giải nhiệt như Cold Brew Cam Sả (46k)? Nhập mã GRAB20 để được giảm 20% nhé!`,
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

    const reply = response.text || 'Chào bạn! Mình có thể giúp gì cho bạn về menu cà phê Go & Grab hôm nay?';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini Chat API Error:', err);
    return res.status(500).json({
      error: 'Không thể kết nối tới Barista AI lúc này.',
      reply: 'Dạ hiện tại hệ thống kết nối AI đang bận. Bạn có thể thử các món bán chạy nhất của quán như: Cà phê Muối Xứ Huế (39.000đ) hoặc Bạc Xỉu 3 Tầng (35.000đ), áp dụng mã GRAB20 để nhận ưu đãi 20% nhé!',
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

  const testMessage = `☕ <b>GO & GRAB COFFEE - TEST KẾT NỐI</b>
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

// Table booking endpoint: sends to Google Sheets AND Telegram Bot
app.post('/api/booking', async (req, res) => {
  const reservationData = req.body;
  const targetUrl = req.body.webhookUrl || googleSheetsWebhookUrl;
  const targetTelegramChatId = req.body.telegramChatId || telegramChatId;

  // Format message for Telegram
  const telegramMessage = `🔔 <b>CÓ KHÁCH ĐẶT BÀN MỚI TẠI GO & GRAB COFFEE!</b>
━━━━━━━━━━━━━━━━━━━━
📋 <b>Mã đặt bàn:</b> <code>${reservationData.code || 'TB-NEW'}</code>
👤 <b>Họ và tên:</b> <b>${reservationData.customerName || 'Khách hàng'}</b>
📞 <b>Điện thoại:</b> <code>${reservationData.customerPhone || 'Chưa có'}</code>
📧 <b>Email:</b> ${reservationData.customerEmail || 'Chưa có'}
👥 <b>Số lượng:</b> <b>${reservationData.guestCount || 1} người</b>
📅 <b>Ngày đến:</b> ${reservationData.date || 'Hôm nay'}
⏰ <b>Khung giờ:</b> ${reservationData.timeSlot || '09:00'}
📍 <b>Chi nhánh:</b> ${reservationData.storeName || (reservationData.store?.name || 'Go & Grab')}
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

  // Forward to Google Sheets Webhook
  if (!targetUrl) {
    return res.json({
      status: telegramResult.ok ? 'synced_to_telegram' : 'saved_locally',
      message: telegramResult.ok
        ? 'Đặt bàn thành công! Đã gửi thông báo Telegram Bot (@Duyaasaa_bot).'
        : 'Đặt bàn thành công! Đã ghi nhận trong hệ thống.',
      telegram: telegramResult,
      data: reservationData,
    });
  }

  try {
    const sheetResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reservationData,
        telegramChatId: targetTelegramChatId,
      }),
    });

    const result = await sheetResponse.json().catch(() => ({ status: 'success' }));
    return res.json({
      status: 'synced_to_sheets_and_telegram',
      message: 'Đã đẩy thông tin đặt bàn về Google Sheet và Telegram Bot thành công!',
      sheetResult: result,
      telegram: telegramResult,
    });
  } catch (err: any) {
    console.error('Google Sheets forwarding error:', err);
    return res.json({
      status: 'warning',
      message: 'Đặt bàn thành công' + (telegramResult.ok ? ' và đã gửi Telegram Bot' : '') + ', nhưng Google Sheet lỗi: ' + err.message,
      telegram: telegramResult,
    });
  }
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
  return res.json({ ok: true, telegram: tgResult });
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
