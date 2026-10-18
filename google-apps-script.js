/**
 * =========================================================================
 * GO & GRAB COFFEE - GOOGLE APPS SCRIPT ĐỒNG BỘ ĐẶT BÀN VÀ TELEGRAM BOT
 * =========================================================================
 * Bot Telegram: @Duyaasaa_bot (Token: 8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw)
 * Email chủ quán: duykhaikhan@gmail.com
 *
 * -------------------------------------------------------------------------
 * HƯỚNG DẪN 4 BƯỚC CÀI ĐẶT CỰC NHANH (MẤT 1 PHÚT):
 * -------------------------------------------------------------------------
 * Bước 1: Mở Google Sheets mới tại https://sheets.new (đặt tên ví dụ: "Go & Grab Coffee - Đặt Bàn")
 * Bước 2: Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script
 * Bước 3: Xóa hết code cũ, dán toàn bộ file này vào và bấm biểu tượng Lưu (Ctrl + S)
 * Bước 4: Triển khai Web App:
 *    - Bấm nút "Triển khai" (Deploy) màu xanh ở góc trên bên phải -> Chọn "Tùy chọn triển khai mới" (New deployment)
 *    - Bấm biểu tượng bánh răng ⚙️ bên cạnh "Chọn loại" -> Chọn "Ứng dụng web" (Web app)
 *    - Mô tả: "Go & Grab Sync Webhook"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (duykhaikhan@gmail.com)
 *    - ⚠️ QUAN TRỌNG NHẤT: "Ai có quyền truy cập" (Who has access): CHỌN "Bất kỳ ai" (Anyone). 
 *      (Nếu để "Chỉ mình tôi", hệ thống từ website sẽ KHÔNG thể ghi dữ liệu vào bảng!)
 *    - Bấm "Triển khai" (Deploy) -> Cấp quyền cho Google nếu có thông báo.
 *    - Copy "URL ứng dụng web" (Web App URL có dạng https://script.google.com/macros/s/.../exec)
 *    - Dán URL đó vào website Go & Grab Coffee ở mục "Đặt Bàn -> Google Sheet"!
 * =========================================================================
 */

var TELEGRAM_BOT_TOKEN = "8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw";
var DEFAULT_TELEGRAM_CHAT_ID = ""; // Có thể để trống nếu gửi từ website

/**
 * Hàm khởi tạo bảng tính và thêm dữ liệu đặt bàn
 */
function recordBooking(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Tự động tạo hàng tiêu đề nếu bảng còn trống
  if (sheet.getLastRow() === 0) {
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
      "Ghi Chú Đặc Biệt",
      "Trạng Thái"
    ]);

    var headerRange = sheet.getRange(1, 1, 1, 12);
    headerRange.setBackground("#382215"); // Màu nâu cà phê Go & Grab
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);
  }

  var timestamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  var code = data.code || ("TB-" + Math.floor(1000 + Math.random() * 9000));
  var name = data.customerName || data.name || "Khách Hàng";
  var phone = "'" + (data.customerPhone || data.phone || "");
  var email = data.customerEmail || data.email || "";
  var guests = data.guestCount || data.guests || 2;
  var date = data.date || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd");
  var timeSlot = data.timeSlot || "09:00";
  var storeName = data.storeName || (data.store ? data.store.name : "Go & Grab Coffee");
  var seatingArea = data.seatingArea || "Khu vực chuẩn";
  var note = data.note || "Không có";
  var status = "Đã xác nhận";

  // Thêm dòng mới vào Google Sheet
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

  // Căn giữa các cột mã, ngày, giờ, số khách
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 2).setHorizontalAlignment("center"); // Mã
  sheet.getRange(lastRow, 6).setHorizontalAlignment("center"); // Số khách
  sheet.getRange(lastRow, 7).setHorizontalAlignment("center"); // Ngày
  sheet.getRange(lastRow, 8).setHorizontalAlignment("center"); // Giờ
  sheet.getRange(lastRow, 12).setHorizontalAlignment("center"); // Trạng thái

  // Tự động gửi thông báo Telegram nếu có Chat ID hoặc Default ID
  var chatId = data.telegramChatId || DEFAULT_TELEGRAM_CHAT_ID;
  var tgSent = false;

  if (chatId && TELEGRAM_BOT_TOKEN) {
    try {
      var msg = "🔔 <b>CÓ KHÁCH ĐẶT BÀN MỚI TẠI GO & GRAB COFFEE!</b>\n"
        + "━━━━━━━━━━━━━━━━━━━━\n"
        + "📋 <b>Mã đặt bàn:</b> <code>" + code + "</code>\n"
        + "👤 <b>Họ và tên:</b> <b>" + name + "</b>\n"
        + "📞 <b>Điện thoại:</b> <code>" + (data.customerPhone || data.phone || "") + "</code>\n"
        + "📧 <b>Email:</b> " + email + "\n"
        + "👥 <b>Số lượng:</b> <b>" + guests + " người</b>\n"
        + "📅 <b>Ngày đến:</b> " + date + "\n"
        + "⏰ <b>Khung giờ:</b> " + timeSlot + "\n"
        + "📍 <b>Chi nhánh:</b> " + storeName + "\n"
        + "🪑 <b>Khu vực:</b> " + seatingArea + "\n"
        + "📝 <b>Ghi chú:</b> <i>" + note + "</i>\n"
        + "⏰ <b>Thời gian ghi nhận:</b> " + timestamp + "\n"
        + "━━━━━━━━━━━━━━━━━━━━\n"
        + "📊 <i>Đã lưu thành công vào dòng " + lastRow + " trên Google Sheet!</i>";

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
    row: lastRow,
    timestamp: timestamp,
    telegramSent: tgSent
  };
}

/**
 * Xử lý yêu cầu POST gửi từ Website hoặc Server proxy
 */
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

    var result = recordBooking(requestData);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Thông tin đặt bàn đã được ghi nhận vào Google Sheet thành công!",
        code: result.code,
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

/**
 * Xử lý yêu cầu GET: 
 * 1. Hỗ trợ test trực tiếp trên trình duyệt
 * 2. Hỗ trợ ghi dữ liệu qua GET fallback nếu mạng chặn POST
 */
function doGet(e) {
  // Nếu có thông tin đặt bàn truyền qua URL query param -> ghi vào sheet
  if (e && e.parameter && (e.parameter.customerName || e.parameter.name || e.parameter.customerPhone || e.parameter.test === "1")) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);
    try {
      var result = recordBooking(e.parameter);
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "success",
          message: "Đã ghi nhận đặt bàn qua GET parameter vào Google Sheet thành công!",
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

  // Nếu mở Web App URL trên trình duyệt -> hiển thị trang trạng thái chi tiết
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var totalRows = sheet.getLastRow();
  var spreadsheetName = SpreadsheetApp.getActiveSpreadsheet().getName();

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Go & Grab Coffee Apps Script Status</title>"
    + "<style>body{font-family:system-ui,-apple-system,sans-serif;background:#faf7f2;color:#382215;padding:30px;max-width:600px;margin:0 auto;line-height:1.6;}"
    + ".card{background:white;padding:24px;border-radius:16px;box-shadow:0 4px 20px rgba(56,34,21,0.08);border:1px solid #e7decb;}"
    + ".badge{background:#10b981;color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;}"
    + ".btn{background:#78350f;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:bold;margin-top:12px;}"
    + "code{background:#f1ece1;padding:2px 6px;border-radius:4px;font-family:monospace;}</style></head><body>"
    + "<div class='card'>"
    + "<h2>☕ Go & Grab Coffee Webhook</h2>"
    + "<p><span class='badge'>HOẠT ĐỘNG TỐT</span></p>"
    + "<p>Bảng tính hiện tại: <b>" + spreadsheetName + "</b></p>"
    + "<p>Tổng số dòng hiện tại: <b>" + totalRows + " dòng</b></p>"
    + "<p>Bot Telegram: <b>@Duyaasaa_bot</b></p>"
    + "<hr style='border:0;border-top:1px solid #e7decb;margin:16px 0;'/>"
    + "<p style='color:#78350f;font-weight:bold;'>✅ Web App URL này hoàn toàn chính xác và đã sẵn sàng nhận dữ liệu đặt bàn từ website!</p>"
    + "</div></body></html>";

  return HtmlService.createHtmlOutput(html);
}

/**
 * -------------------------------------------------------------------------
 * HÀM TEST TRỰC TIẾP TRONG APPS SCRIPT EDITOR:
 * Bạn có thể chọn hàm này và bấm "Run" (Chạy) trong trình biên tập Apps Script.
 * Một dòng mẫu sẽ được ghi ngay vào Google Sheet và thông báo Telegram sẽ được gửi!
 * -------------------------------------------------------------------------
 */
function testBookingScript() {
  var sampleReservation = {
    code: "TEST-APPS-SCRIPT",
    customerName: "Duy Khải (Chủ Quán Test)",
    customerPhone: "0909123456",
    customerEmail: "duykhaikhan@gmail.com",
    guestCount: 4,
    date: Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd"),
    timeSlot: "19:00",
    storeName: "Go & Grab - 120 Hai Bà Trưng, Q.1",
    seatingArea: "Bàn Sofa thư giãn / Họp nhóm",
    note: "Dòng thử nghiệm trực tiếp từ Apps Script Editor",
    telegramChatId: DEFAULT_TELEGRAM_CHAT_ID
  };

  var res = recordBooking(sampleReservation);
  Logger.log("KẾT QUẢ TEST: " + JSON.stringify(res));
  SpreadsheetApp.getUi().alert("✅ THÀNH CÔNG! Đã thêm dòng đặt bàn thử nghiệm vào dòng " + res.row + " của bảng tính!");
}
