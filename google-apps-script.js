/**
 * =========================================================================
 * GO COFFEE - GOOGLE APPS SCRIPT ĐỒNG BỘ ĐƠN HÀNG & ĐẶT BÀN & TELEGRAM BOT
 * =========================================================================
 * Quán: Go Coffee - 120 Pasteur, Phường Bến Nghé, Quận 1, TP.HCM
 * Bot Telegram: @Duyaasaa_bot (Token: 8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw)
 * Email chủ quán: duykhaikhan@gmail.com
 *
 * -------------------------------------------------------------------------
 * HƯỚNG DẪN 4 BƯỚC CÀI ĐẶT CỰC NHANH (MẤT 1 PHÚT):
 * -------------------------------------------------------------------------
 * Bước 1: Mở Google Sheets mới tại https://sheets.new
 * Bước 2: Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script
 * Bước 3: Xóa hết code cũ, dán toàn bộ file này vào và bấm biểu tượng Lưu (Ctrl + S)
 * Bước 4: Triển khai Web App:
 *    - Bấm nút "Triển khai" (Deploy) màu xanh ở góc trên bên phải -> Chọn "Tùy chọn triển khai mới" (New deployment)
 *    - Bấm biểu tượng bánh răng ⚙️ bên cạnh "Chọn loại" -> Chọn "Ứng dụng web" (Web app)
 *    - Mô tả: "Go Coffee Sync Webhook"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (duykhaikhan@gmail.com)
 *    - ⚠️ QUAN TRỌNG NHẤT: "Ai có quyền truy cập" (Who has access): CHỌN "Bất kỳ ai" (Anyone).
 *    - Bấm "Triển khai" (Deploy) -> Cấp quyền cho Google nếu có thông báo.
 *    - Copy "URL ứng dụng web" (Web App URL có dạng https://script.google.com/macros/s/.../exec)
 *    - Dán URL đó vào website Go Coffee ở mục "Bảng Điều Khiển Chủ Quán -> Google Sheet"!
 * =========================================================================
 */

var TELEGRAM_BOT_TOKEN = "8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw";
var DEFAULT_TELEGRAM_CHAT_ID = ""; // Nhận tự động từ website hoặc điền Chat ID của bạn

/**
 * Xử lý ghi nhận Đơn hàng hoặc Đặt bàn vào Google Sheet và bắn tin nhắn Telegram
 */
function recordData(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var timestamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  var isOrder = (data.type === "order" || Boolean(data.total) || Boolean(data.itemsSummary));
  var sheetName = isOrder ? "ĐƠN HÀNG GO COFFEE" : "ĐẶT BÀN GO COFFEE";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (isOrder) {
      sheet.appendRow([
        "Thời Gian Đặt",
        "Mã Đơn Hàng",
        "Tên Khách Hàng",
        "Số Điện Thoại",
        "Hình Thức & Địa Chỉ",
        "Giờ Nhận Hàng",
        "Món Đặt & Chi Tiết",
        "Tổng Tiền (VNĐ)",
        "Phương Thức Thanh Toán",
        "Ghi Chú",
        "Trạng Thái"
      ]);
      var hr = sheet.getRange(1, 1, 1, 11);
      hr.setBackground("#801419").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
    } else {
      sheet.appendRow([
        "Thời Gian Đặt",
        "Mã Đặt Bàn",
        "Họ Và Tên Khách",
        "Số Điện Thoại",
        "Email",
        "Số Khách",
        "Ngày Đến",
        "Khung Giờ",
        "Chi Nhánh",
        "Khu Vực Bàn",
        "Ghi Chú",
        "Trạng Thái"
      ]);
      var hr = sheet.getRange(1, 1, 1, 12);
      hr.setBackground("#801419").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
    }
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);
  }

  var code = data.code || ((isOrder ? "GNC-" : "TB-") + Math.floor(1000 + Math.random() * 9000));
  var name = data.customerName || data.name || "Khách Hàng";
  var phone = "'" + (data.customerPhone || data.phone || "");
  var note = data.note || data.customerNote || "Không có";
  var status = "Đã tiếp nhận";
  var lastRow = 0;

  if (isOrder) {
    var deliveryMethod = data.deliveryMethod || data.orderType || (data.deliveryAddress ? "Giao tận nơi" : "Tự lấy tại quầy");
    var address = data.deliveryAddress ? (deliveryMethod + " - " + data.deliveryAddress) : (deliveryMethod + " - 120 Pasteur, Q.1");
    var pickupTime = data.pickupTime || "Lấy ngay (~5 - 8 phút)";
    var itemsSummary = data.itemsSummary || (data.items ? JSON.stringify(data.items) : "Đồ uống Go Coffee");
    var totalAmount = data.total ? Number(data.total).toLocaleString("vi-VN") + " đ" : "0 đ";
    var paymentMethod = (data.paymentMethod === "momo" ? "Ví MoMo" : data.paymentMethod === "cash" ? "Tiền mặt" : "VietQR Chuyển khoản");

    sheet.appendRow([
      timestamp,
      code,
      name,
      phone,
      address,
      pickupTime,
      itemsSummary,
      totalAmount,
      paymentMethod,
      note,
      status
    ]);
    lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 2).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 6).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 8).setHorizontalAlignment("right");
    sheet.getRange(lastRow, 11).setHorizontalAlignment("center");
  } else {
    var email = data.customerEmail || data.email || "";
    var guests = data.guestCount || data.guests || 2;
    var date = data.date || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd");
    var timeSlot = data.timeSlot || "09:00";
    var storeName = data.storeName || "Go Coffee - 120 Pasteur, Quận 1";
    var seatingArea = data.seatingArea || "Khu vực chuẩn";

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
      status
    ]);
    lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 2).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 6).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 7).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 8).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 12).setHorizontalAlignment("center");
  }

  // Bắn thông báo Telegram tức thì
  var chatId = data.telegramChatId || DEFAULT_TELEGRAM_CHAT_ID;
  var tgSent = false;

  if (chatId && TELEGRAM_BOT_TOKEN) {
    try {
      var msg = "";
      if (isOrder) {
        msg = "☕ <b>CÓ ĐƠN ĐẶT CÀ PHÊ MỚI - GO COFFEE 120 PASTEUR!</b>\n"
          + "━━━━━━━━━━━━━━━━━━━━\n"
          + "📋 <b>Mã đơn:</b> <code>" + code + "</code>\n"
          + "👤 <b>Khách hàng:</b> <b>" + name + "</b>\n"
          + "📞 <b>Số điện thoại:</b> <code>" + (data.customerPhone || data.phone || "") + "</code>\n"
          + "⏰ <b>Giờ nhận hàng:</b> <b>" + (data.pickupTime || "Lấy ngay (~5 - 8 phút)") + "</b>\n"
          + "🥤 <b>Món đã chọn:</b>\n" + (data.itemsSummary || "Cà phê phin Go Coffee") + "\n"
          + "💰 <b>Tổng tiền:</b> <b>" + (data.total ? Number(data.total).toLocaleString("vi-VN") + " đ" : "0 đ") + "</b> (" + (data.paymentMethod === "momo" ? "Ví MoMo" : data.paymentMethod === "cash" ? "Tiền mặt" : "VietQR") + ")\n"
          + "📍 <b>Địa chỉ:</b> " + (data.deliveryAddress || "Lấy tại quầy 120 Pasteur, Quận 1") + "\n"
          + "📝 <b>Ghi chú:</b> <i>" + note + "</i>\n"
          + "⏰ <b>Thời gian đặt:</b> " + timestamp + "\n"
          + "━━━━━━━━━━━━━━━━━━━━\n"
          + "📊 <i>Đã lưu vào sheet: " + sheetName + " (dòng " + lastRow + ")!</i>";
      } else {
        msg = "🔔 <b>CÓ KHÁCH ĐẶT BÀN MỚI TẠI GO COFFEE!</b>\n"
          + "━━━━━━━━━━━━━━━━━━━━\n"
          + "📋 <b>Mã đặt bàn:</b> <code>" + code + "</code>\n"
          + "👤 <b>Họ và tên:</b> <b>" + name + "</b>\n"
          + "📞 <b>Số điện thoại:</b> <code>" + (data.customerPhone || data.phone || "") + "</code>\n"
          + "👥 <b>Số lượng:</b> <b>" + (data.guestCount || 2) + " người</b>\n"
          + "📅 <b>Ngày & Giờ đến:</b> " + (data.date || "") + " lúc " + (data.timeSlot || "") + "\n"
          + "📍 <b>Chi nhánh:</b> Go Coffee - 120 Pasteur, Quận 1\n"
          + "🪑 <b>Khu vực:</b> " + (data.seatingArea || "Khu vực chuẩn") + "\n"
          + "📝 <b>Ghi chú:</b> <i>" + note + "</i>\n"
          + "⏰ <b>Thời gian ghi nhận:</b> " + timestamp + "\n"
          + "━━━━━━━━━━━━━━━━━━━━\n"
          + "📊 <i>Đã lưu vào sheet: " + sheetName + " (dòng " + lastRow + ")!</i>";
      }

      var tgResponse = UrlFetchApp.fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({
          chat_id: chatId,
          text: msg,
          parse_mode: "HTML"
        }),
        muteHttpExceptions: true
      });
      tgSent = tgResponse.getResponseCode() === 200;
    } catch (tgErr) {
      Logger.log("Telegram Error: " + tgErr.toString());
    }
  }

  return {
    success: true,
    code: code,
    sheet: sheetName,
    row: lastRow,
    timestamp: timestamp,
    telegramSent: tgSent
  };
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var requestData = {};
    if (e && e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        requestData = e.parameter || {};
      }
    } else if (e && e.parameter) {
      requestData = e.parameter;
    }

    var result = recordData(requestData);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Dữ liệu Go Coffee đã được lưu vào Google Sheet thành công!",
        code: result.code,
        sheet: result.sheet,
        row: result.row,
        timestamp: result.timestamp,
        telegramSent: result.telegramSent
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "Lỗi ghi dữ liệu: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e && e.parameter && (e.parameter.customerName || e.parameter.name || e.parameter.customerPhone || e.parameter.test === "1")) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);
    try {
      var result = recordData(e.parameter);
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "success",
          message: "Đã ghi nhận dữ liệu qua GET parameter vào Google Sheet thành công!",
          code: result.code,
          row: result.row
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    } finally {
      lock.releaseLock();
    }
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var spreadsheetName = ss.getName();

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Go Coffee Apps Script Status</title>"
    + "<style>body{font-family:system-ui,-apple-system,sans-serif;background:#faf7f2;color:#382215;padding:30px;max-width:600px;margin:0 auto;line-height:1.6;}"
    + ".card{background:white;padding:24px;border-radius:16px;box-shadow:0 4px 20px rgba(56,34,21,0.08);border:1px solid #e7decb;}"
    + ".badge{background:#10b981;color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;}"
    + "</style></head><body>"
    + "<div class='card'>"
    + "<h2>☕ Go Coffee 120 Pasteur - Webhook Hoạt Động Tốt</h2>"
    + "<p><span class='badge'>HOẠT ĐỘNG TỐT</span></p>"
    + "<p>Bảng tính hiện tại: <b>" + spreadsheetName + "</b></p>"
    + "<p>Bot Telegram: <b>@Duyaasaa_bot</b></p>"
    + "<p style='color:#801419;font-weight:bold;'>✅ Web App URL này hoàn toàn chính xác và đã sẵn sàng nhận đơn cà phê & đặt bàn từ website Go Coffee!</p>"
    + "</div></body></html>";

  return HtmlService.createHtmlOutput(html);
}
