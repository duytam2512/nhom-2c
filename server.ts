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

app.post('/api/booking', async (req, res) => {
  const reservationData = req.body;
  const targetUrl = req.body.webhookUrl || googleSheetsWebhookUrl;

  if (!targetUrl) {
    return res.json({
      status: 'saved_locally',
      message: 'Đặt bàn thành công! Chưa cài link Google Sheets Webhook.',
      data: reservationData,
    });
  }

  try {
    const sheetResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData),
    });

    const result = await sheetResponse.json().catch(() => ({ status: 'success' }));
    return res.json({
      status: 'synced_to_sheets',
      message: 'Đã đẩy dữ liệu đặt bàn về Google Sheet thành công!',
      result,
    });
  } catch (err: any) {
    console.error('Google Sheets forwarding error:', err);
    return res.json({
      status: 'warning',
      message: 'Đặt bàn thành công, lỗi gửi webhook: ' + err.message,
    });
  }
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
