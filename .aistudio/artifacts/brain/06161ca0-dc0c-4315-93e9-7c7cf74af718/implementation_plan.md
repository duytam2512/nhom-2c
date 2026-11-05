# Kế hoạch Nâng Cấp Website GO.COFFEE & Chuẩn Hóa Menu (Bảo Toàn Dự Án Hiện Tại)

Kế hoạch tối ưu hóa giao diện và trải nghiệm website GO.COFFEE phục vụ báo cáo môn Digital Marketing, tuân thủ nghiêm ngặt nguyên tắc **bảo toàn toàn bộ dự án đang có**, chuẩn hóa menu 18 món chính thức, sửa lỗi tràn nút "Mua ngay", và loại bỏ chức năng đặt bàn để tập trung 100% vào mô hình **Mua mang đi (Takeaway)** và **Giao hàng (Delivery)**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Về tài nguyên Google Drive**: Theo yêu cầu mục III, nếu không truy cập trực tiếp được link Google Drive (`https://drive.google.com/drive/folders/1zjoM9T1X8loIS5DnXFkBZnjtoSqPVS9p` do rào cản phân quyền trình duyệt máy chủ), hệ thống sẽ **bảo toàn nguyên vẹn** các tài nguyên hình ảnh chất lượng cao hiện có trong thư mục `/public/images` (bao gồm hình chụp quầy booth 120 Pasteur, ly phin sữa đá, đai giấy combo, phinDi và các dòng thức uống). Quý khách có thể cung cấp thêm ảnh nếu muốn bổ sung.
>
> **Cam kết bảo toàn**: Không tạo dự án mới, không viết lại từ đầu, không thay đổi cấu trúc dữ liệu, không xóa giỏ hàng, quy trình thanh toán VietQR/MoMo, chatbot AI, hay hệ thống quản trị chủ quán.

- **Menu chính thức**: Cố định đúng 18 món thuộc 6 nhóm (4 Cà phê phin, 3 PhinDi, 3 Freeze đá xay, 3 Trà, 3 Bánh, 2 Combo).
- **Mô hình kinh doanh**: 100% Đặt món mang đi (Takeaway) & Giao hàng (Delivery). Loại bỏ triệt để mọi giao diện và nút "Đặt bàn / Đặt chỗ ngồi".
- **Giao diện di động**: Tối ưu card sản phẩm với `white-space: nowrap`, `text-overflow: ellipsis`, và flexbox chống tràn nút "Mua ngay".

---

## 1. Khảo Sát & Đánh Giá Hiện Trạng Hệ Thống

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HỆ THỐNG HIỆN TẠI (BẢO TOÀN)                     │
├────────────────────────────────────────────────────────────────────────┤
│ • Framework: React (TypeScript) + Tailwind CSS + Vite                 │
│ • Dữ liệu: src/data/coffeeData.ts (Menu, Stores, Vouchers)            │
│ • Quản lý giỏ hàng & Đơn hàng: safeStorage + CartDrawer + Checkout    │
│ • Thanh toán: VietQR NAPAS 24/7 + MoMo + Tiền mặt                      │
│ • Đồng bộ: Google Sheets Webhook + Telegram Bot (@Duyaasaa_bot)        │
│ • Quản trị riêng tư: AdminDashboardModal (mã PIN 1755 / 120 Pasteur)  │
│ • Thành phần cần tinh chỉnh:                                           │
│   - MENU_ITEMS (loại bỏ các món thừa, chuẩn hóa về đúng 18 món)        │
│   - TableBookingModal & các nút "Đặt bàn" (gỡ bỏ khỏi UI)              │
│   - MenuSection.tsx (chống tràn nút Mua ngay trên mobile)              │
└────────────────────────────────────────────────────────────────────────┘
```

### Các file cần điều chỉnh (Phạm vi tối thiểu):
1. `src/data/coffeeData.ts`:
   - Chuẩn hóa danh sách `MENU_ITEMS` thành đúng 18 sản phẩm thuộc 6 nhóm theo danh sách chính thức.
   - Giữ nguyên toàn bộ cấu trúc interface `MenuItem`, `CartItem`, `StoreLocation`, `Voucher`.
2. `src/components/MenuSection.tsx`:
   - Cập nhật 6 tab danh mục: `all` (Tất cả), `phin` (Cà phê phin), `phindi` (PhinDi thế hệ mới), `freeze` (Freeze đá xay), `tea` (Trà), `pastry` (Bánh mì & bánh ngọt), `combo` (Combo tiết kiệm).
   - Tối ưu CSS phần footer của card sản phẩm: `flex-wrap: wrap`, chống tràn nút "Mua ngay", đảm bảo tên món và giá hiển thị rõ ràng trên mọi kích thước màn hình.
3. `src/App.tsx`:
   - Gỡ bỏ import và hiển thị của `TableBookingModal`.
   - Gỡ bỏ các hàm kích hoạt đặt bàn (`openBookingModal`, route `/dat-ban`).
   - Giữ nguyên toàn bộ giỏ hàng, thanh toán, tracking, admin, chatbot.
4. `src/components/Header.tsx`, `src/components/MobileBottomNav.tsx`, `src/components/Hero.tsx`, `src/components/StoreLocator.tsx`:
   - Loại bỏ nút/liên kết "Đặt bàn" hoặc "Đặt chỗ ngồi lại".
   - Thay thế bằng các nút hành động cốt lõi: "Xem Thực Đơn", "Đặt Mang Đi (5 Phút)", "Giao Tận Nơi".
   - Địa chỉ chuẩn: Số 120 Pasteur, Phường Sài Gòn (hoặc P. Bến Nghé, Quận 1).

---

## 2. Danh Mục 18 Món Chính Thức Thuộc 6 Nhóm

| Nhóm | Tên Món Chính Thức | Giá Hiển Thị |
| :--- | :--- | :--- |
| **1. Cà phê phin** | Phin Sữa Đá Go Coffee | 39.000đ |
| | Phin Đen Đá Go Coffee | 35.000đ |
| | Bạc Xỉu Đá Go Coffee | 39.000đ |
| | Cà Phê Muối Cố Đô | 45.000đ |
| **2. PhinDi thế hệ mới** | PhinDi Hạnh Nhân | 49.000đ |
| | PhinDi Kem Sữa | 49.000đ |
| | PhinDi Choco | 49.000đ |
| **3. Freeze đá xay** | Freeze Trà Xanh Thạch Giòn | 55.000đ |
| | Caramel Phin Freeze | 55.000đ |
| | Cookies & Cream Freeze | 55.000đ |
| **4. Trà** | Trà Sen Vàng Hạt Sen Huế | 52.000đ |
| | Trà Thạch Đào Giòn Mát | 49.000đ |
| | Trà Thanh Đào | 49.000đ |
| **5. Bánh mì và bánh ngọt** | Bánh Mì Que Pate Cay Hải Phòng | 25.000đ |
| | Bánh Phô Mai Cà Phê Đặc Biệt | 39.000đ |
| | Bánh Mousse Cacao Đậm Đà | 39.000đ |
| **6. Combo tiết kiệm** | Sáng Năng Lượng: Phin Sữa Đá + Bánh Mì Que Pate Cay | 55.000đ (Tiết kiệm 9.000đ) |
| | Trà Chiều Thư Thái: Trà Sen Vàng + Bánh Phô Mai Cà Phê | 79.000đ (Tiết kiệm 12.000đ) |

---

## 3. Xác Định Rủi Ro & Chức Năng Có Nguy Cơ Bị Ảnh Hưởng

| Chức Năng | Nguy Cơ | Giải Pháp Phòng Ngừa |
| :--- | :--- | :--- |
| **Giỏ hàng & Thanh toán** | Lỗi ID món ăn khi chuẩn hóa menu | Giữ nguyên các `id` chuẩn (`hl-phin-sua-da`, `hl-combo-sang`, `hl-tra-sen-vang`,...) để không làm vỡ các đơn hàng đã lưu trong `safeStorage`. |
| **Gỡ bỏ đặt bàn** | Gãy sự kiện gọi `onOpenTableBooking` tại các component con | Xóa bỏ sạch sẽ các prop liên quan một cách nhất quán hoặc để optional handler `undefined` trước khi gỡ hoàn toàn. |
| **Tràn nút Mua ngay trên Mobile** | Vỡ layout card khi tên món hoặc giá dài | Sử dụng CSS `flex-wrap: wrap`, `min-width: 0`, `flex-shrink`, và cấu trúc `button` tự co giãn linh hoạt trên màn hình dưới 375px. |
| **Telegram & Google Sheet Sync** | Gián đoạn đồng bộ đơn hàng | Giữ nguyên 100% logic của `bookingSync.ts` và backend proxy `/api/order/submit-order`. |

---

## 4. Phương Án Sao Lưu & Khôi Phục (Restore Strategy)

1. **Điểm khôi phục cục bộ**:
   - Trước khi thực hiện chỉnh sửa, sao lưu nội dung của `src/data/coffeeData.ts`, `src/App.tsx`, `src/components/MenuSection.tsx`, `src/components/Header.tsx`, `src/components/StoreLocator.tsx` vào bộ nhớ tạm.
2. **Quy tắc chỉnh sửa phẫu thuật (Surgical Edits)**:
   - Sử dụng `replace_file_content` theo từng khối nhỏ thay vì ghi đè toàn bộ file.
3. **Kiểm tra biên dịch & linting**:
   - Chạy `compile_applet` và `lint_applet` ngay sau mỗi bước chỉnh sửa để đảm bảo không có bất kỳ lỗi TypeScript hay runtime nào.

---

## 5. Lộ Trình Triển Khai (Chờ Xác Nhận Của Bạn)

- **Giai đoạn 1**: Cập nhật `coffeeData.ts` chuẩn hóa đúng 18 món và 6 nhóm danh mục.
- **Giai đoạn 2**: Tối ưu layout card sản phẩm và chống tràn nút "Mua ngay" trong `MenuSection.tsx`.
- **Giai đoạn 3**: Loại bỏ chức năng đặt bàn tại quán khỏi `App.tsx`, `Header.tsx`, `MobileBottomNav.tsx`, `StoreLocator.tsx`, `Hero.tsx`.
- **Giai đoạn 4**: Kiểm tra toàn diện luồng đặt hàng mang đi, giao hàng, thanh toán VietQR và giao diện di động.
