/**
 * =========================================================================
 * GO & GRAB COFFEE - GOOGLE APPS SCRIPT TỰ ĐỘNG ĐẨY ĐẶT BÀN VÀO GOOGLE SHEET & TELEGRAM
 * =========================================================================
 * Token Telegram Bot: 8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw (@Duyaasaa_bot)
 * Email chủ quán: duykhaikhan@gmail.com
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH (Chỉ mất 1 phút):
 * 1. Mở Google Sheets của bạn tại: https://sheets.google.com
 * 2. Tạo một bảng tính mới (ví dụ đặt tên: "Go & Grab Coffee - Danh Sách Đặt Bàn")
 * 3. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script
 * 4. Xóa toàn bộ mã mặc định và dán toàn bộ đoạn mã này vào.
 * 5. Bấm nút "Lưu" (biểu tượng đĩa mềm hoặc Ctrl+S).
 * 6. Bấm nút "Triển khai" (Deploy) màu xanh ở góc trên bên phải -> Chọn "Tùy chọn triển khai mới" (New deployment).
 * 7. Bấm biểu tượng bánh răng bên trái cạnh "Chọn loại" -> Chọn "Ứng dụng web" (Web app).
 * 8. Điền cấu hình:
 *    - Mô tả: "Go & Grab Table Booking Sync"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (duykhaikhan@gmail.com)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> BẮT BUỘC để website có thể gửi dữ liệu vào.
 * 9. Bấm "Triển khai" (Deploy) -> Cấp quyền cho Google Tài khoản của bạn nếu được hỏi.
 * 10. Sao chép "URL ứng dụng web" (Web App URL có dạng: https://script.google.com/macros/s/.../exec)
 * 11. Dán URL này vào mục "Google Sheet Script" trên website Go & Grab Coffee!
 */

var TELEGRAM_BOT_TOKEN = "8910810986:AAGiT37Uh5zlmRIzGghPsdQXuxA2WITobHw";
// Bạn có thể điền Chat ID của bạn hoặc ID Nhóm Telegram ở đây (hoặc để trống nếu gửi từ website)
var DEFAULT_TELEGRAM_CHAT_ID = "";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Tự động tạo hàng tiêu đề nếu bảng còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Gửi Đơn",
        "Mã Đặt Bàn",
        "Họ Và Tên Khách",
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
      headerRange.setBackground("#382215"); // Màu nâu cà phê Go & Grab
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Đọc dữ liệu JSON gửi từ website
    var requestData = {};
    if (e && e.postData && e.postData.contents) {
      requestData = JSON.parse(e.postData.contents);
    }

    var timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    var code = requestData.code || ("TB-" + Math.floor(1000 + Math.random() * 9000));
    var name = requestData.customerName || "Khách hàng";
    var phone = "'" + (requestData.customerPhone || "");
    var email = requestData.customerEmail || "";
    var guests = requestData.guestCount || 1;
    var date = requestData.date || "";
    var timeSlot = requestData.timeSlot || "";
    var storeName = requestData.storeName || (requestData.store ? requestData.store.name : "Go & Grab Coffee");
    var seatingArea = requestData.seatingArea || "Khu vực chung";
    var note = requestData.note || "Không có";
    var status = "Đã xác nhận";

    // 1. Thêm dòng mới vào Google Sheet
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

    // 2. Gửi thông báo đến Telegram Bot nếu có chat_id
    var chatId = requestData.telegramChatId || "";
    if (chatId && TELEGRAM_BOT_TOKEN) {
      try {
        var message = "🔔 <b>CÓ KHÁCH ĐẶT BÀN MỚI TỪ GOOGLE SHEET!</b>\n"
          + "━━━━━━━━━━━━━━━━━━━━\n"
          + "📋 <b>Mã đặt bàn:</b> <code>" + code + "</code>\n"
          + "👤 <b>Họ và tên:</b> " + name + "\n"
          + "📞 <b>Điện thoại:</b> <code>" + (requestData.customerPhone || "") + "</code>\n"
          + "📧 <b>Email:</b> " + email + "\n"
          + "👥 <b>Số lượng:</b> <b>" + guests + " khách</b>\n"
          + "📅 <b>Ngày đến:</b> " + date + "\n"
          + "⏰ <b>Khung giờ:</b> " + timeSlot + "\n"
          + "📍 <b>Chi nhánh:</b> " + storeName + "\n"
          + "🪑 <b>Khu vực:</b> " + seatingArea + "\n"
          + "📝 <b>Ghi chú:</b> <i>" + note + "</i>";

        UrlFetchApp.fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML"
          }),
          muteHttpExceptions: true
        });
      } catch (tgError) {
        // Bỏ qua lỗi telegram để không làm gián đoạn việc lưu Google Sheet
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Thông tin đặt bàn đã được ghi nhận vào Google Sheet và Telegram thành công!",
        code: code
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "online",
      message: "Webhook Google Apps Script của Go & Grab Coffee (@Duyaasaa_bot) đang hoạt động tốt!"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
