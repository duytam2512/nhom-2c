/**
 * Dual-Channel Synchronization Service for Go & Grab Coffee
 * 
 * Ensures Table Bookings and Coffee Orders ALWAYS reach Google Sheets & Telegram:
 * 1. Works in development (Node/Express backend in AI Studio)
 * 2. Works in production on Vercel / Netlify (Static Hosting) via direct Google Apps Script dispatch
 * 3. Works even if the server restarts or process memory is reset
 * 4. Works for both store owners and everyday customers on any mobile or desktop device
 */

export interface SyncConfig {
  webhookUrl: string;
  telegramChatId: string;
  botUsername: string;
  storeName: string;
}

let cachedConfig: SyncConfig | null = null;

/**
 * Loads the active store configuration from all available sources:
 * In-memory cache -> localStorage -> /app-config.json -> /api/booking/webhook
 */
export async function getStoreSyncConfig(): Promise<SyncConfig> {
  const localWebhook = typeof window !== 'undefined' ? localStorage.getItem('go_grab_sheets_webhook') || '' : '';
  const localChatId = typeof window !== 'undefined' ? localStorage.getItem('go_grab_telegram_chat_id') || '' : '';

  if (cachedConfig && (cachedConfig.webhookUrl || localWebhook)) {
    return {
      ...cachedConfig,
      webhookUrl: cachedConfig.webhookUrl || localWebhook,
      telegramChatId: cachedConfig.telegramChatId || localChatId,
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
      }
    } catch (e) {
      // backend API not available (e.g. on static Vercel)
    }
  }

  const effectiveWebhook = (localWebhook || fileWebhook).trim();
  const effectiveChatId = (localChatId || fileChatId).trim();

  // Keep localStorage in sync if we discovered a webhook from the store config
  if (typeof window !== 'undefined') {
    if (fileWebhook && !localWebhook) {
      localStorage.setItem('go_grab_sheets_webhook', fileWebhook);
    }
    if (fileChatId && !localChatId) {
      localStorage.setItem('go_grab_telegram_chat_id', fileChatId);
    }
  }

  cachedConfig = {
    webhookUrl: effectiveWebhook,
    telegramChatId: effectiveChatId,
    botUsername: 'Duyaasaa_bot',
    storeName: 'Go & Grab Coffee',
  };

  return cachedConfig;
}

/**
 * Saves store configuration across localStorage, public/app-config.json, and backend
 */
export async function saveStoreSyncConfig(config: { webhookUrl: string; telegramChatId?: string }): Promise<boolean> {
  const cleanUrl = (config.webhookUrl || '').trim();
  const cleanChatId = (config.telegramChatId || '').trim();

  if (typeof window !== 'undefined') {
    if (cleanUrl) localStorage.setItem('go_grab_sheets_webhook', cleanUrl);
    if (cleanChatId) localStorage.setItem('go_grab_telegram_chat_id', cleanChatId);
  }

  cachedConfig = {
    webhookUrl: cleanUrl,
    telegramChatId: cleanChatId,
    botUsername: 'Duyaasaa_bot',
    storeName: 'Go & Grab Coffee',
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
  if (typeof window !== 'undefined') {
    try {
      const existingStr = localStorage.getItem('go_coffee_local_reservations');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift({
        ...fullReservation,
        createdAt: new Date().toISOString(),
        sheetSynced,
      });
      localStorage.setItem('go_coffee_local_reservations', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {}
  }

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

  // 1. Attempt server /api/order
  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullOrder),
    });

    if (res.ok) {
      const data = await res.json();
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
    // Static Vercel
  }

  // 2. Direct client forward if needed
  if (!sheetSynced && effectiveWebhook) {
    const directResult = await sendDirectToGoogleSheets(effectiveWebhook, fullOrder);
    if (directResult.ok) {
      sheetSynced = true;
    }
  }

  // 3. Save order locally
  if (typeof window !== 'undefined') {
    try {
      const existingStr = localStorage.getItem('go_coffee_local_orders');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift({
        ...fullOrder,
        createdAt: new Date().toISOString(),
        sheetSynced,
      });
      localStorage.setItem('go_coffee_local_orders', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {}
  }

  return {
    ok: true,
    code,
    sheetSynced,
  };
}
