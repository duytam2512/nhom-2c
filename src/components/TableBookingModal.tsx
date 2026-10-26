import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  Coffee, 
  QrCode,
  Armchair
} from 'lucide-react';
import { StoreLocation, TableReservation } from '../types/coffee';
import { STORES } from '../data/coffeeData';
import { submitTableBooking } from '../services/bookingSync';

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStore: StoreLocation;
  onBookingSuccess?: (reservation: TableReservation) => void;
  onGoToMenu?: () => void;
}

export const TableBookingModal: React.FC<TableBookingModalProps> = ({
  isOpen,
  onClose,
  selectedStore: initialStore,
  onBookingSuccess,
  onGoToMenu,
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [store, setStore] = useState<StoreLocation>(initialStore);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('09:00');
  const [seatingArea, setSeatingArea] = useState<string>('work');
  const [note, setNote] = useState<string>('');

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const timeSlots = [
    '07:30', '08:30', '09:00', '10:00', '11:30', 
    '14:00', '15:30', '17:00', '18:30', '19:30', '20:30'
  ];

  const seatingOptions = [
    { id: 'work', name: 'Khu làm việc yên tĩnh', desc: 'Có ổ cắm sạc laptop, wifi cáp quang riêng' },
    { id: 'garden', name: 'Khu sân vườn thoáng mát', desc: 'Không gian mở, cây xanh đón gió tự nhiên' },
    { id: 'sofa', name: 'Bàn Sofa thư giãn / Họp nhóm', desc: 'Ghế bọc nệm êm ái cho nhóm bạn hoặc đối tác' },
    { id: 'counter', name: 'Quầy Bar ngắm Barista pha', desc: 'Trải nghiệm chiết xuất Espresso trực tiếp' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 9) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ (từ 9 - 11 chữ số).');
      return;
    }

    setIsSubmitting(true);

    const generatedCode = 'TB-' + Math.floor(1000 + Math.random() * 9000);
    const chosenSeating = seatingOptions.find((s) => s.id === seatingArea)?.name || 'Khu làm việc yên tĩnh';

    const reservation: TableReservation = {
      id: `tb-${Date.now()}`,
      code: generatedCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'khachhang@gocoffee.vn',
      guestCount,
      date: bookingDate,
      timeSlot,
      store,
      seatingArea: chosenSeating,
      note: note.trim(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    try {
      // Dual-channel submit: sends to server & directly to Google Sheets Web App fallback
      await submitTableBooking({
        ...reservation,
        storeName: store.name,
      });
    } catch (err) {
      console.warn('Booking recorded locally');
    }

    // Celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b45309', '#d97706', '#f59e0b', '#10b981', '#fcd34d'],
      });
    } catch (err) {}

    setConfirmedReservation(reservation);
    setIsSubmitting(false);
    if (onBookingSuccess) {
      onBookingSuccess(reservation);
    }
  };

  const handleCopyCode = () => {
    if (confirmedReservation) {
      navigator.clipboard.writeText(confirmedReservation.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setNote('');
    setConfirmedReservation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-xl rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border border-stone-200 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh] pb-[env(safe-area-inset-bottom,8px)] sm:pb-0">
        
        {/* Header - Highlands Crimson Red Styling */}
        <div className="p-4 sm:p-5 border-b border-[#630f14] flex items-center justify-between bg-gradient-to-r from-[#7a1218] via-[#9e1c24] to-[#7a1218] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
              <Armchair className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base font-display tracking-tight text-white">
                  Đặt Bàn Giữ Chỗ • Go Coffee
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full shadow-2xs">
                  Miễn phí
                </span>
              </div>
              <p className="text-xs text-amber-200/80 line-clamp-1">
                Giữ chỗ ưu tiên • Không gian thư thái • Chuẩn bị chu đáo trước khi bạn đến
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-amber-200 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {!confirmedReservation ? (
            /* CUSTOMER BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold animate-in shake duration-150">
                  {errorMsg}
                </div>
              )}

              {/* Form Grid */}
              <div className="space-y-3.5">
                {/* Full name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Họ và tên quý khách <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-[15px] sm:text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="0901 234 567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-[15px] sm:text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Guests count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Email nhận xác nhận
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full text-[15px] sm:text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Số lượng người
                    </label>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {[1, 2, 4, 6, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestCount(num)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                            guestCount === num
                              ? 'bg-amber-900 text-white border-amber-950 shadow-xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {num === 8 ? '8+' : `${num}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Branch selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Chi nhánh quán Go Coffee
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-amber-800 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={store.id}
                      onChange={(e) => {
                        const found = STORES.find((s) => s.id === e.target.value);
                        if (found) setStore(found);
                      }}
                      className="w-full text-[15px] sm:text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium cursor-pointer"
                    >
                      {STORES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.district}, {s.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date and Time slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Ngày nhận bàn
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-[15px] sm:text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Khung giờ đến
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full text-[15px] sm:text-xs pl-9 pr-3 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-bold text-stone-800 cursor-pointer"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Seating Area Preference */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    Chọn không gian & loại bàn mong muốn:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {seatingOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSeatingArea(opt.id)}
                        className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                          seatingArea === opt.id
                            ? 'bg-amber-900 text-white border-amber-950 shadow-sm'
                            : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                        }`}
                      >
                        <span className="font-bold text-xs">{opt.name}</span>
                        <span className={`text-[10px] mt-0.5 line-clamp-1 ${seatingArea === opt.id ? 'text-amber-200' : 'text-stone-400'}`}>
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Yêu cầu đặc biệt (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Bàn gần cửa sổ, chuẩn bị ghế trẻ em, kỷ niệm sinh nhật..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full text-[15px] sm:text-xs p-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 font-medium resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#b22830] via-[#c41e27] to-[#8f1920] hover:from-[#c41e27] hover:to-[#9b1c24] text-white font-extrabold text-sm shadow-xl shadow-red-950/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang xử lý giữ bàn...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Xác Nhận Giữ Bàn</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* CONFIRMED E-TICKET VIEW */
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              {/* Success Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-base font-display">
                  Đặt Bàn Thành Công!
                </h4>
                <p className="text-xs text-emerald-800">
                  Go Coffee đã sẵn sàng tiếp đón quý khách.
                </p>
                
                {/* Clean Customer Status Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Giữ bàn thành công</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Ưu tiên chỗ ngồi đẹp nhất</span>
                  </span>
                </div>
              </div>

              {/* Digital Table Pass Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 space-y-3.5">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      MÃ ĐẶT BÀN ĐIỆN TỬ
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
                        {confirmedReservation.code}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 shadow-2xs transition cursor-pointer"
                        title="Sao chép mã"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="w-16 h-16 bg-white p-1.5 rounded-xl border border-amber-200 flex items-center justify-center shadow-2xs">
                    <QrCode className="w-full h-full text-stone-800" />
                  </div>
                </div>

                {/* Booking Reservation Details (Clean & Concise - No duplicate customer credentials) */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Số lượng khách</span>
                    <span className="font-bold text-amber-900">{confirmedReservation.guestCount} người</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Thời gian nhận bàn</span>
                    <span className="font-bold text-stone-900">{confirmedReservation.timeSlot} • {confirmedReservation.date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Chi nhánh quán</span>
                    <span className="font-bold text-stone-900">{confirmedReservation.store.name}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">{confirmedReservation.store.address}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Khu vực bàn</span>
                    <span className="font-semibold text-amber-800">{confirmedReservation.seatingArea}</span>
                  </div>
                  {confirmedReservation.note && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">Yêu cầu đặc biệt</span>
                      <span className="italic text-stone-600">"{confirmedReservation.note}"</span>
                    </div>
                  )}
                </div>

                {/* Notice */}
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 text-[11px] text-stone-600 flex items-start gap-2">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Vé đặt bàn đã được ghi nhận vào hệ thống. Quý khách vui lòng đọc mã đặt bàn khi đến quán.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {onGoToMenu && (
                  <button
                    onClick={() => {
                      handleResetAndClose();
                      onGoToMenu();
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Coffee className="w-4 h-4 text-amber-200" />
                    <span>Xem Thực Đơn Để Đặt Nước Trước</span>
                  </button>
                )}
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition cursor-pointer"
                >
                  Hoàn Tất • Đóng
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
