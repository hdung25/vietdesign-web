import { useState, type FormEvent } from 'react';

export default function Newsletter({ lang }: { lang: string }) {
  const [fields, setFields] = useState({ name: '', phone: '', email: '', address: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fields.name.trim() || !fields.phone.trim() || !fields.address.trim()) return;
    setSent(true);
  };

  const VN = lang === 'VN';

  return (
    <div id="newsletter-section" className="py-8 bg-[#eed9ab]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
        <h2 className="text-[#131313] text-xl md:text-2xl font-bold mb-2 uppercase tracking-wide">
          {VN ? 'THEO DÕI TIN TỨC TỪ CHÚNG TÔI' : 'STAY UP TO DATE WITH US'}
        </h2>
        <p className="text-[#333] mb-6 text-xs md:text-sm font-medium max-w-2xl mx-auto">
          {VN
            ? 'Đăng ký để nhận thông tin cập nhật về các dự án và tin tức mới nhất của VIETDESIGN'
            : 'Subscribe to receive updates on our latest projects and news from VIETDESIGN'}
        </p>
        {sent ? (
          <div className="text-[#131313] font-semibold text-base py-4">
            {VN ? 'Cảm ơn! Chúng tôi sẽ liên hệ sớm.' : 'Thank you! We will be in touch soon.'}
          </div>
        ) : (
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              required
              value={fields.name}
              onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
              placeholder={VN ? 'Họ và tên (*)' : 'Full name (*)'}
              className="bg-[#131313] text-white border-none p-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-500 rounded-sm"
            />
            <input
              required
              value={fields.phone}
              onChange={e => setFields(f => ({ ...f, phone: e.target.value }))}
              placeholder={VN ? 'Số điện thoại (*)' : 'Phone number (*)'}
              className="bg-[#131313] text-white border-none p-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-500 rounded-sm"
            />
            <input
              value={fields.email}
              onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              className="bg-[#131313] text-white border-none p-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-500 rounded-sm"
            />
            <input
              required
              value={fields.address}
              onChange={e => setFields(f => ({ ...f, address: e.target.value }))}
              placeholder={VN ? 'Địa chỉ (*)' : 'Address (*)'}
              className="bg-[#131313] text-white border-none p-3 text-sm w-full md:col-span-2 focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-500 rounded-sm"
            />
            <button
              type="submit"
              className="bg-transparent text-[#131313] border-[2px] border-[#131313] p-3 text-sm font-bold cursor-pointer tracking-widest uppercase hover:bg-[#131313] hover:text-[#eed9ab] transition-colors rounded-sm"
            >
              {VN ? 'GỬI TIN NHẮN' : 'SEND MESSAGE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
