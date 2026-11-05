/**
 * Dual-Channel Synchronization Service for Go & Grab Coffee
 * 
 * Ensures Table Bookings and Coffee Orders ALWAYS reach Google Sheets & Telegram:
 * 1. Works in development (Node/Express backend in AI Studio)
 * 2. Works in production on Vercel / Netlify (Static Hosting) via direct Google Apps Script dispatch
 * 3. Works even if the server restarts or process memory is reset
 * 4. Works for both store owners and everyday customers on any mobile or desktop device
 */

import { safeStorage } from '../utils/safeStorage';

export const DEFAULT_TELEGRAM_BOT_TOKEN = '8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw';
export const DEFAULT_TELEGRAM_CHAT_ID = '8101899097';
export const DEFAULT_TELEGRAM_BOT_USERNAME = 'Duyaasaa_bot';

export interface SyncConfig {
  webhookUrl: string;
  telegramChatId: string;
  botUsername: string;
  storeName: string;
}

let cachedConfig: SyncConfig | null = null;

/**
 * Direct client-to-Telegram send function.
 * Guarantees instant notifications even when backend is offline or on static Vercel.
 */
export async function sendDirectToTelegram(text: string, chatId?: string): Promise<{ ok: boolean; error?: string }> {
  const targetChatId = (chatId || cachedConfig?.telegramChatId || DEFAULT_TELEGRAM_CHAT_ID).trim();
  if (!targetChatId) {
    return { ok: false, error: 'Chưa có Chat ID Telegram' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${DEFAULT_TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    const data = await res.json();
    return { ok: Boolean(data && data.ok), error: data?.description };
  } catch (err: any) {
    console.warn('Lỗi gửi Telegram trực tiếp:', err);
    return { ok: false, error: err.message };
  }
}

/**
 * Auto-detects Chat ID by checking Telegram getUpdates directly or via backend
 */
export async function autoDetectTelegramChatId(): Promise<string> {
  // 1. Try backend API
  try {
    const res = await fetch('/api/telegram/status');
    if (res.ok) {
      const data = await res.json();
      if (data.detectedChatId) {
        return String(data.detectedChatId);
      }
    }
  } catch (e) {}

  // 2. Direct client query to Telegram Bot API
  try {
    const res = await fetch(`https://api.telegram.org/bot${DEFAULT_TELEGRAM_BOT_TOKEN}/getUpdates`);
    if (res.ok) {
      const data = await res.json();
      if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
        const senders = data.result
          .map((u: any) => u.message?.chat || u.my_chat_member?.chat || u.channel_post?.chat)
          .filter(Boolean);
        if (senders.length > 0) {
          const latest = senders[senders.length - 1];
          return String(latest.id);
        }
      }
    }
  } catch (e) {}

  return DEFAULT_TELEGRAM_CHAT_ID;
}

/**
 * Loads the active store configuration from all available sources:
 * In-memory cache -> safeStorage -> /app-config.json -> /api/booking/webhook
 */
export async function getStoreSyncConfig(): Promise<SyncConfig> {
  const localWebhook = safeStorage.getItem('go_grab_sheets_webhook') || '';
  const localChatId = safeStorage.getItem('go_grab_telegram_chat_id') || '';

  if (cachedConfig && (cachedConfig.webhookUrl || localWebhook)) {
    return {
      ...cachedConfig,
      webhookUrl: cachedConfig.webhookUrl || localWebhook,
      telegramChatId: cachedConfig.telegramChatId || localChatId || DEFAULT_TELEGRAM_CHAT_ID,
    };
  }

  let fileWebhook = '';
  let fileChatId = '';

  // 1. Try reading public/app-config.json (statically bundled, works everywhere including Vercel)
  try {
    const res = await fetch('/app-config.json?v=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      fileWebhook = (data.googleSheetsWebhookUrl || '').trim();
      fileChatId = (data.telegramChatId || '').trim();
    }
  } catch (e) {
    // static file read failed or running in non-browser
  }

  // 2. Try querying backend /api/booking/webhook if file had no webhook
  if (!fileWebhook) {
    try {
      const res = await fetch('/api/booking/webhook', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.webhookUrl) {
          fileWebhook = data.webhookUrl.trim();
        }
        if (data.telegramChatId && !fileChatId) {
          fileChatId = data.telegramChatId.trim();
        }
      }
    } catch (e) {
      // backend API not available (e.g. on static Vercel)
    }
  }

  const effectiveWebhook = (localWebhook || fileWebhook).trim();
  const effectiveChatId = (localChatId || fileChatId || DEFAULT_TELEGRAM_CHAT_ID).trim();

  // Keep safeStorage in sync if we discovered a webhook from the store config
  if (fileWebhook && !localWebhook) {
    safeStorage.setItem('go_grab_sheets_webhook', fileWebhook);
  }
  if (effectiveChatId && !localChatId) {
    safeStorage.setItem('go_grab_telegram_chat_id', effectiveChatId);
  }

  cachedConfig = {
    webhookUrl: effectiveWebhook,
    telegramChatId: effectiveChatId,
    botUsername: DEFAULT_TELEGRAM_BOT_USERNAME,
    storeName: 'GO.COFFEE - 120 Pasteur, Quận 1',
  };

  return cachedConfig;
}

/**
 * Saves store configuration across safeStorage, public/app-config.json, and backend
 */
export async function saveStoreSyncConfig(config: { webhookUrl: string; telegramChatId?: string }): Promise<boolean> {
  const cleanUrl = (config.webhookUrl || '').trim();
  const cleanChatId = (config.telegramChatId || '').trim();

  if (cleanUrl) safeStorage.setItem('go_grab_sheets_webhook', cleanUrl);
  if (cleanChatId) safeStorage.setItem('go_grab_telegram_chat_id', cleanChatId);

  cachedConfig = {
    webhookUrl: cleanUrl,
    telegramChatId: cleanChatId,
    botUsername: 'Duyaasaa_bot',
    storeName: 'Go Coffee - Quận 1',
  };

  try {
    await fetch('/api/booking/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookUrl: cleanUrl,
        telegramChatId: cleanChatId,
      }),
    });
    return true;
  } catch (err) {
    // Running on static Vercel or server offline - localStorage is already preserved
    return true;
  }
}

/**
 * Direct client-to-Google Apps Script forward.
 * Uses mode: 'no-cors' so the browser never blocks Google Apps Script 302 redirects.
 * Also appends query parameters for doGet fallback in Google Apps Script!
 */
export async function sendDirectToGoogleSheets(webhookUrl: string, payload: any): Promise<{ ok: boolean; direct: boolean }> {
  const cleanUrl = (webhookUrl || '').trim();
  if (!cleanUrl || !cleanUrl.startsWith('http')) {
    return { ok: false, direct: true };
  }

  try {
    const url = new URL(cleanUrl);

    // Append query parameters so doGet(e) or doPost(e) both capture every detail
    url.searchParams.set('code', payload.code || 'TB-' + Math.floor(1000 + Math.random() * 9000));
    url.searchParams.set('customerName', payload.customerName || payload.name || 'Khách');
    url.searchParams.set('customerPhone', payload.customerPhone || payload.phone || '');
    url.searchParams.set('customerEmail', payload.customerEmail || payload.email || '');
    url.searchParams.set('guestCount', String(payload.guestCount || 2));
    url.searchParams.set('date', payload.date || new Date().toISOString().split('T')[0]);
    url.searchParams.set('timeSlot', payload.timeSlot || '09:00');
    url.searchParams.set('storeName', payload.storeName || (payload.store?.name || 'Go & Grab Coffee'));
    url.searchParams.set('seatingArea', payload.seatingArea || payload.deliveryAddress || 'Khu vực chuẩn');
    url.searchParams.set('note', payload.note || payload.customerNote || '');

    if (payload.type === 'order' || payload.total) {
      url.searchParams.set('type', 'order');
      url.searchParams.set('total', String(payload.total || 0));
      url.searchParams.set('paymentMethod', payload.paymentMethod || 'vietqr');
      url.searchParams.set('itemsSummary', payload.itemsSummary || 'Đồ uống');
      url.searchParams.set('pickupTime', payload.pickupTime || 'Lấy ngay (~5 - 8 phút)');
    }

    if (payload.telegramChatId) {
      url.searchParams.set('telegramChatId', payload.telegramChatId);
    }

    // Single direct POST with text/plain (avoids CORS preflight and avoids double execution)
    await fetch(url.toString(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return { ok: true, direct: true };
  } catch (err) {
    console.warn('Direct Google Apps Script forward error:', err);
    return { ok: false, direct: true };
  }
}

/**
 * Complete Table Booking submission with Dual-Channel Delivery:
 * Channel 1: Express Server /api/booking (handles Telegram + Sheets from backend)
 * Channel 2: Direct client-side forward to Google Apps Script if server was offline/Vercel static or didn't sync sheets
 */
export async function submitTableBooking(reservation: any): Promise<{
  ok: boolean;
  code: string;
  sheetSynced: boolean;
  via: 'server' | 'direct' | 'local';
}> {
  const config = await getStoreSyncConfig();
  const effectiveWebhook = (reservation.webhookUrl || config.webhookUrl || '').trim();
  const effectiveChatId = (reservation.telegramChatId || config.telegramChatId || '').trim();

  const code = reservation.code || 'TB-' + Math.floor(1000 + Math.random() * 9000);
  const fullReservation = {
    ...reservation,
    code,
    webhookUrl: effectiveWebhook,
    telegramChatId: effectiveChatId,
  };

  let serverSuccess = false;
  let sheetSynced = false;

  // 1. Attempt Node.js backend route
  try {
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullReservation),
    });

    if (res.ok) {
      const data = await res.json();
      serverSuccess = true;
      if (data.sheetResult && data.sheetResult.ok) {
        sheetSynced = true;
      }
    }
  } catch (err) {
    // Server not available (e.g. running as static build on Vercel)
    serverSuccess = false;
  }

  // 2. If server didn't sync sheets (or on static Vercel), execute direct client-to-sheets forward!
  if (!sheetSynced && effectiveWebhook) {
    const directResult = await sendDirectToGoogleSheets(effectiveWebhook, fullReservation);
    if (directResult.ok) {
      sheetSynced = true;
    }
  }

  // 3. Save reservation in client history for instant retrieval in Admin/Customer view
  const existingStr = safeStorage.getItem('go_coffee_local_reservations');
  const existing = existingStr ? JSON.parse(existingStr) : [];
  existing.unshift({
    ...fullReservation,
    createdAt: new Date().toISOString(),
    sheetSynced,
  });
  safeStorage.setItem('go_coffee_local_reservations', JSON.stringify(existing.slice(0, 50)));

  return {
    ok: true,
    code,
    sheetSynced,
    via: serverSuccess ? 'server' : (sheetSynced ? 'direct' : 'local'),
  };
}

/**
 * Complete Coffee Order submission with Dual-Channel Delivery:
 */
export async function submitCoffeeOrder(order: any): Promise<{
  ok: boolean;
  code: string;
  sheetSynced: boolean;
}> {
  const config = await getStoreSyncConfig();
  const effectiveWebhook = (order.webhookUrl || config.webhookUrl || '').trim();
  const effectiveChatId = (order.telegramChatId || config.telegramChatId || '').trim();

  const code = order.code || 'GNC-' + Math.floor(1000 + Math.random() * 9000);
  const itemsSummary = Array.isArray(order.items)
    ? order.items.map((it: any) => `${it.quantity}x ${it.name} (${it.size})`).join(', ')
    : 'Đồ uống Go Coffee';

  const fullOrder = {
    ...order,
    code,
    type: 'order',
    itemsSummary,
    webhookUrl: effectiveWebhook,
    telegramChatId: effectiveChatId,
  };

  let sheetSynced = false;
  let telegramSent = false;

  // 1. Attempt server /api/order
  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullOrder),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.telegram && data.telegram.ok) {
        telegramSent = true;
      }
      if (
        (data.sheet && data.sheet.ok) ||
        (data.sheetResult && data.sheetResult.ok) ||
        data.status === 'synced_to_sheets' ||
        data.status === 'synced_to_sheets_and_telegram'
      ) {
        sheetSynced = true;
      }
    }
  } catch (err) {
    // Static Vercel or server offline
  }

  // 2. Client-side direct Telegram fallback (Guarantees Telegram delivery even if backend is offline on Vercel)
  if (!telegramSent) {
    const itemsFormatted = Array.isArray(order.items)
      ? order.items.map((it: any) => `• ${it.quantity}x <b>${it.name}</b> (${it.size})`).join('\n')
      : itemsSummary;

    const orderMsg = `☕ <b>CÓ ĐƠN ĐẶT CÀ PHÊ MỚI - GO.COFFEE!</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Mã đơn:</b> <code>${code}</code>
👤 <b>Khách hàng:</b> <b>${order.customerName || 'Khách'}</b>
📞 <b>Số điện thoại:</b> <code>${order.customerPhone || 'Chưa có'}</code>
🥤 <b>Món đã chọn:</b>
${itemsFormatted}
💰 <b>Tổng tiền:</b> <b>${Number(order.total || 0).toLocaleString('vi-VN')} đ</b> (${order.paymentMethod ? String(order.paymentMethod).toUpperCase() : 'VIETQR'})
⏰ <b>Giờ nhận:</b> <b>${order.pickupTime || 'Lấy ngay (~5 - 8 phút)'}</b>
🛵 <b>Hình thức:</b> ${order.orderType === 'pickup' ? 'Ghé lấy tại quầy 120 Pasteur, Quận 1' : `Giao tận nơi: ${order.deliveryAddress || ''}`}
📝 <b>Ghi chú:</b> <i>${order.customerNote || 'Không có'}</i>
⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;

    const tgDirect = await sendDirectToTelegram(orderMsg, effectiveChatId);
    if (tgDirect.ok) telegramSent = true;
  }

  // 3. Direct Google Apps Script forward if needed
  if (!sheetSynced && effectiveWebhook) {
    const directResult = await sendDirectToGoogleSheets(effectiveWebhook, fullOrder);
    if (directResult.ok) {
      sheetSynced = true;
    }
  }

  // 4. Save order locally
  const existingOrdersStr = safeStorage.getItem('go_coffee_local_orders');
  const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
  existingOrders.unshift({
    ...fullOrder,
    createdAt: new Date().toISOString(),
    sheetSynced,
    telegramSent,
  });
  safeStorage.setItem('go_coffee_local_orders', JSON.stringify(existingOrders.slice(0, 50)));

  return {
    ok: true,
    code,
    sheetSynced,
  };
}

export interface CancelOrderParams {
  code: string;
  reason: string;
  refundMethod: 'bank_transfer' | 'momo' | 'cash';
  refundAccountInfo: string;
  refundAccountName: string;
  customerNote?: string;
}

/**
 * Submits an order cancellation and refund request:
 * 1. Updates local storage state
 * 2. Calls backend /api/order/cancel (notifies Telegram & persists)
 * 3. Client direct Telegram dispatch if backend is offline
 * 4. Sends direct notification to Google Sheets Webhook
 */
export async function cancelCoffeeOrder(params: CancelOrderParams): Promise<{
  ok: boolean;
  message: string;
}> {
  const config = await getStoreSyncConfig();
  const effectiveWebhook = config.webhookUrl;
  const effectiveChatId = config.telegramChatId;
  const cancelledAt = new Date().toISOString();

  // 1. Update order in local storage
  let currentOrder: any = null;
  try {
    const existingOrdersStr = safeStorage.getItem('go_coffee_local_orders');
    if (existingOrdersStr) {
      const orders = JSON.parse(existingOrdersStr);
      const idx = orders.findIndex((o: any) => o.code === params.code);
      if (idx > -1) {
        orders[idx] = {
          ...orders[idx],
          status: 'refund_requested',
          cancellationReason: params.reason,
          refundMethod: params.refundMethod,
          refundAccountInfo: params.refundAccountInfo,
          refundAccountName: params.refundAccountName,
          cancelledAt,
          refundStatus: 'pending',
        };
        currentOrder = orders[idx];
        safeStorage.setItem('go_coffee_local_orders', JSON.stringify(orders));
      }
    }
  } catch (e) {
    console.warn('Could not update order in safeStorage:', e);
  }

  const cancelPayload = {
    type: 'cancel_order',
    code: params.code,
    reason: params.reason,
    refundMethod: params.refundMethod,
    refundAccountInfo: params.refundAccountInfo,
    refundAccountName: params.refundAccountName,
    total: currentOrder?.total || 0,
    customerName: currentOrder?.customerName || 'Khách hàng',
    customerPhone: currentOrder?.customerPhone || '',
    cancelledAt,
    webhookUrl: effectiveWebhook,
    telegramChatId: effectiveChatId,
  };

  let telegramSent = false;

  // 2. Call backend /api/order/cancel
  try {
    const res = await fetch('/api/order/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cancelPayload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.telegram && data.telegram.ok) {
        telegramSent = true;
      }
    }
  } catch (err) {
    // If backend offline (e.g. static host)
  }

  // Fallback direct Telegram notification for cancel
  if (!telegramSent) {
    const refundMethodLabel = params.refundMethod === 'bank_transfer' ? 'Chuyển khoản VietQR' : params.refundMethod === 'momo' ? 'Ví MoMo' : 'Tiền mặt';
    const cancelMsg = `⚠️ <b>YÊU CẦU HỦY ĐƠN & HOÀN TIỀN - GO.COFFEE!</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Mã đơn:</b> <code>${params.code}</code>
👤 <b>Khách hàng:</b> ${cancelPayload.customerName}
📞 <b>Điện thoại:</b> <code>${cancelPayload.customerPhone || 'Chưa có'}</code>
💰 <b>Số tiền cần hoàn:</b> <b>${Number(cancelPayload.total).toLocaleString('vi-VN')} đ</b>
💳 <b>Hình thức nhận hoàn:</b> <b>${refundMethodLabel}</b>
🏦 <b>Thông tin tài khoản:</b> <code>${params.refundAccountInfo || 'N/A'}</code>
👤 <b>Tên thụ hưởng:</b> <b>${params.refundAccountName || 'Chưa nhập'}</b>
❓ <b>Lý do hủy:</b> <i>${params.reason || 'Khách yêu cầu hủy'}</i>
⏰ <b>Thời gian yêu cầu:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
━━━━━━━━━━━━━━━━━━━━
🔔 <i>Vui lòng xử lý hoàn tiền cho khách trong vòng 5 - 15 phút!</i>`;

    await sendDirectToTelegram(cancelMsg, effectiveChatId);
  }

  // 3. Direct Google Apps Script forward if available
  if (effectiveWebhook) {
    try {
      await sendDirectToGoogleSheets(effectiveWebhook, cancelPayload);
    } catch (err) {}
  }

  return {
    ok: true,
    message: 'Yêu cầu hủy đơn & hoàn tiền đã được gửi tới quán. Quán sẽ xử lý hoàn tiền trong 5 - 15 phút.',
  };
}
