/**
 * =========================================================================
 * GO & GRAB COFFEE - GOOGLE APPS SCRIPT TỰ ĐỘNG ĐẨY ĐẶT BÀN VÀO GOOGLE SHEET
 * =========================================================================
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
 *    - Mô tả: "Go & Grab Table Booking"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (duykhaikhan@gmail.com)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG để website có thể gửi dữ liệu vào.
 * 9. Bấm "Triển khai" (Deploy) -> Cấp quyền cho Google Tài khoản của bạn nếu được hỏi.
 * 10. Sao chép "URL ứng dụng web" (Web App URL có dạng: https://script.google.com/macros/s/.../exec)
 * 11. Dán URL này vào mục "Cấu hình Google Sheet" trên website Go & Grab Coffee!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Đợi tối đa 10 giây nếu có nhiều khách cùng đặt bàn
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

      // Định dạng màu cà phê thương hiệu cho dòng tiêu đề
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
    var phone = "'" + (requestData.customerPhone || ""); // Thêm dấu nháy để Google Sheet không mất số 0 đầu
    var email = requestData.customerEmail || "";
    var guests = requestData.guestCount || 1;
    var date = requestData.date || "";
    var timeSlot = requestData.timeSlot || "";
    var storeName = requestData.storeName || (requestData.store ? requestData.store.name : "Go & Grab Coffee");
    var seatingArea = requestData.seatingArea || "Khu vực chung";
    var note = requestData.note || "Không có";
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

    // Trả về kết quả thành công cho website
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Thông tin đặt bàn đã được ghi nhận vào Google Sheet thành công!",
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

// Hàm hỗ trợ kiểm tra kết nối nhanh bằng trình duyệt (GET)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "online",
      message: "Webhook Google Apps Script của Go & Grab Coffee đang hoạt động tốt!"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
