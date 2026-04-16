import { Link, useLocation } from 'react-router-dom';
import { useState, type FormEvent, type ReactNode } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useAdminMode } from '../contexts/AdminModeContext';
import AdminToolbar from './AdminToolbar';

/* ─── Floating button ─── */
const FloatingButton = ({
  href,
  label,
  children,
  isMain = false,
  bgColor,
  textColor,
}: {
  href: string;
  label: string;
  children: ReactNode;
  isMain?: boolean;
  bgColor?: string;
  textColor?: string;
}) => {
  const defaultClass = isMain
    ? 'bg-[#c9a96e] text-[#131313] hover:bg-[#d4b47e] hover:shadow-[0_0_24px_rgba(201,169,110,0.6)]'
    : 'bg-[#c9a96e]/10 border border-[#c9a96e]/40 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#131313] hover:border-[#c9a96e] hover:shadow-[0_0_24px_rgba(201,169,110,0.5)]';

  return (
    <div className="group relative flex items-center justify-end z-[9999]">
      <span className="absolute right-[calc(100%+12px)] bg-[#131313] border border-[#c9a96e]/30 text-[#c9a96e] text-[0.65rem] font-label tracking-[0.15em] uppercase px-3 py-1.5 rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        {label}
      </span>
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={bgColor ? { backgroundColor: bgColor, color: textColor || 'white' } : undefined}
        className={[
          'w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl',
          'transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5',
          bgColor ? '' : defaultClass,
        ].join(' ')}
      >
        {children}
      </a>
    </div>
  );
};

/* ─── Google Maps embed ─── */
const OfficeMap = () => (
  <iframe
    title="VIETDESIGN - Văn phòng Hà Nội"
    src="https://maps.google.com/maps?q=C37+Bac+Ha+Tower,+To+Huu,+Ha+Dong,+Hanoi,+Vietnam&output=embed&z=14"
    width="100%"
    height="280"
    style={{ border: 0, borderRadius: '4px', display: 'block' }}
    loading="lazy"
    allowFullScreen
  />
);

/* ─── Newsletter mini-form (footer top) ─── */
function NewsletterSection({ lang }: { lang: string }) {
  const [fields, setFields] = useState({ name: '', phone: '', email: '', address: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fields.name.trim() || !fields.phone.trim() || !fields.address.trim()) return;
    setSent(true);
  };

  const VN = lang === 'VN';

  return (
    <div id="newsletter-section" className="py-10 bg-[#eed9ab]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
        <h2 className="text-[#131313] text-2xl md:text-3xl font-bold mb-2 uppercase tracking-wide">
          {VN ? 'THEO DÕI TIN TỨC TỪ CHÚNG TÔI' : 'STAY UP TO DATE WITH US'}
        </h2>
        <p className="text-[#333] mb-8 text-sm md:text-base font-medium">
          {VN
            ? 'Đăng ký để nhận thông tin cập nhật về các dự án và tin tức mới nhất của VIETDESIGN'
            : 'Subscribe to receive updates on our latest projects and news from VIETDESIGN'}
        </p>
        {sent ? (
          <div className="text-[#131313] font-semibold text-lg py-4">
            {VN ? 'Cảm ơn! Chúng tôi sẽ liên hệ sớm.' : 'Thank you! We will be in touch soon.'}
          </div>
        ) : (
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              required
              value={fields.name}
              onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
              placeholder={VN ? 'Họ và tên (*)' : 'Full name (*)'}
              className="bg-[#131313] text-white border-none p-4 text-sm md:text-base w-full focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-500 rounded-sm"
            />
            <input
              required
              value={fields.phone}
              onChange={e => setFields(f => ({ ...f, phone: e.target.value }))}
              placeholder={VN ? 'Số điện thoại (*)' : 'Phone number (*)'}
              className="bg-[#131313] text-white border-none p-4 text-sm md:text-base w-full focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-500 rounded-sm"
            />
            <input
              value={fields.email}
              onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              className="bg-[#131313] text-white border-none p-4 text-sm md:text-base w-full focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-500 rounded-sm"
            />
            <input
              required
              value={fields.address}
              onChange={e => setFields(f => ({ ...f, address: e.target.value }))}
              placeholder={VN ? 'Địa chỉ (*)' : 'Address (*)'}
              className="bg-[#131313] text-white border-none p-4 text-sm md:text-base w-full md:col-span-2 focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-500 rounded-sm"
            />
            <button
              type="submit"
              className="bg-transparent text-[#131313] border-[2px] border-[#131313] p-4 text-sm md:text-base font-bold cursor-pointer tracking-widest uppercase hover:bg-[#131313] hover:text-[#eed9ab] transition-colors rounded-sm"
            >
              {VN ? 'GỬI TIN NHẮN' : 'SEND MESSAGE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Main layout ─── */
export default function Layout({ children }: { children: ReactNode }) {
  const { lang, toggleLang, t } = useLang();
  const { isAdmin } = useAdminMode();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div
      className="min-h-screen flex flex-col bg-background text-on-surface font-body selection:bg-primary/30 selection:text-primary overflow-x-hidden"
      style={{ paddingTop: isAdmin ? '44px' : '0' }}
    >
      {/* ── Admin Toolbar (WordPress/Wix style – phủ trên cùng khi đăng nhập) ── */}
      <AdminToolbar />

      {/* ── Header ── */}
      <header
        className="fixed w-full z-50 bg-[#131313]/90 backdrop-blur-xl flex justify-between items-center px-4 md:px-10 py-3 md:py-5 shadow-lg"
        style={{
          top: isAdmin ? '44px' : '0',
          borderBottom: '2px solid #d2b06f',
          transition: 'top 0.3s ease',
        }}
      >
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <span
            className="material-symbols-outlined text-[#d2b06f] cursor-pointer text-xl md:text-2xl"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
          >
            menu
          </span>
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img
              src="/logo.png"
              alt="VIETDESIGN"
              className="h-8 md:h-10 w-auto object-contain rounded-full"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span
              className="hidden sm:inline-block text-lg md:text-xl font-light tracking-[0.25em] text-[#d2b06f]"
              style={{ fontFamily: 'Noto Serif, serif', textShadow: 'none' }}
            >
              VIETDESIGN
            </span>
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-10" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {[
            { to: '/', key: 'nav.home' },
            { to: '/services', key: 'nav.services' },
            { to: '/projects', key: 'nav.projects' },
            { to: '/about', key: 'nav.about' },
            { to: '/journal', key: 'nav.journal' },
            { to: '/contact', key: 'nav.contact' },
          ].map(({ to, key }) => {
            const isActive = to === '/' ? currentPath === '/' : currentPath.startsWith(to);
            return (
              <Link
                key={key}
                to={to}
                className="group relative flex flex-col items-center gap-1"
                style={{
                  color: isActive ? '#d2b06f' : '#d0c5b5',
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'color 0.25s',
                }}
              >
                {t(key)}
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-[#d2b06f] shadow-[0_0_6px_2px_rgba(210,176,111,0.7)]' : 'bg-transparent group-hover:bg-[#d0c5b5]/50'}`} />
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggleLang}
          className="shrink-0 cursor-pointer bg-none border-none font-serif tracking-wider text-sm md:text-base outline-none hover:opacity-80 transition-opacity"
        >
          <span style={{ color: lang === 'VN' ? '#fff' : '#d2b06f55' }}>VN</span>
          <span style={{ color: '#d2b06f44', margin: '0 4px' }}>|</span>
          <span style={{ color: lang === 'EN' ? '#fff' : '#d2b06f55' }}>EN</span>
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="flex-grow pt-16 md:pt-0">{children}</main>

      {/* ── Newsletter strip ── */}
      <NewsletterSection lang={lang} />

      {/* ── Main Footer ── */}
      <footer className="bg-[#0a0a0a] pt-16 pb-8 border-t-2 border-[#d2b06f]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* ROW 1 – Logo / Map / Branch */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12 items-start">

            {/* LEFT: Logo block */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <img
                src="/logo.png"
                alt="VIETDESIGN"
                className="h-20 md:h-24 object-contain mb-4"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="text-[#d2b06f] text-[0.7rem] md:text-xs tracking-[0.2em] uppercase mb-6 font-semibold">
                NÂNG TẦM GIÁ TRỊ CUỘC SỐNG
              </div>
              <div className="flex flex-col gap-3 items-center lg:items-start">
                <div className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-[#d2b06f]">phone</span>
                  <span className="text-sm md:text-base font-light font-body">Hotline: +84 989 942 555</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-[#d2b06f] opacity-0">phone</span>
                  <span className="text-sm md:text-base font-light font-body">+84 908 666 622</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-[#d2b06f]">language</span>
                  <span className="text-sm md:text-base font-light font-body">Website: www.vietdesign.vn</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-[#d2b06f]">group</span>
                  <span className="text-sm md:text-base font-light font-body">Facebook: VietDesign</span>
                </div>
              </div>
            </div>

            {/* MIDDLE: Google Maps */}
            <div className="w-full">
              <OfficeMap />
            </div>

            {/* RIGHT: Branch info */}
            <div className="text-center lg:text-left">
              <div className="text-[#d2b06f] text-xs tracking-[0.2em] uppercase mb-3 font-semibold">
                {lang === 'VN' ? 'HỆ THỐNG CHI NHÁNH' : 'OUR BRANCHES'}
              </div>
              <div className="text-white text-2xl md:text-3xl font-serif mb-3 tracking-wide">
                VIETDESIGN
              </div>
              <div className="h-0.5 bg-[#d2b06f] w-full max-w-[200px] mx-auto lg:mx-0 mb-6" />
              <div className="text-[#d2b06f] font-semibold mb-2 text-sm md:text-base uppercase tracking-wider">
                {lang === 'VN' ? 'VĂN PHÒNG HÀ NỘI' : 'HANOI OFFICE'}
              </div>
              <div className="text-white/70 mb-6 text-sm md:text-base font-light leading-relaxed">
                C37 Bắc Hà Tower, Tố Hữu, Hà Đông, Hà Nội
              </div>
              <div className="text-[#d2b06f] font-semibold mb-2 text-sm md:text-base uppercase tracking-wider">
                EMAIL
              </div>
              <div className="text-white/70 text-sm md:text-base font-light">
                cskh.vietdesign@gmail.com
              </div>
            </div>
          </div>

          {/* ROW 2 – Gold divider + Nav links + Social icons */}
          <div className="h-px bg-white/10 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center mb-10 text-center lg:text-left">
            <div className="flex gap-6 flex-wrap justify-center lg:justify-start">
              <Link to="/about" className="text-white/80 no-underline uppercase text-xs tracking-widest font-semibold transition-colors hover:text-[#d2b06f]">
                GIỚI THIỆU
              </Link>
              <Link to="#" className="text-white/80 no-underline uppercase text-xs tracking-widest font-semibold transition-colors hover:text-[#d2b06f]">
                THÔNG BÁO PHÁP LÝ
              </Link>
            </div>
            <div className="flex gap-6 flex-wrap justify-center">
              <Link to="/contact" className="text-white/80 no-underline uppercase text-xs tracking-widest font-semibold transition-colors hover:text-[#d2b06f]">
                LIÊN HỆ
              </Link>
              <Link to="#" className="text-white/80 no-underline uppercase text-xs tracking-widest font-semibold transition-colors hover:text-[#d2b06f]">
                CHÍNH SÁCH BẢO MẬT
              </Link>
            </div>
            <div className="flex gap-4 justify-center md:col-span-2 lg:col-span-1 lg:justify-end">
              <a href="https://facebook.com/vietdesign" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#d2b06f] hover:bg-[#d2b06f] hover:text-[#111] transition-all">
                <span className="material-symbols-outlined text-xl">group</span>
              </a>
              <a href="https://instagram.com/vietdesign" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#d2b06f] hover:bg-[#d2b06f] hover:text-[#111] transition-all">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </a>
              <a href="https://youtube.com/@vietdesign" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#d2b06f] hover:bg-[#d2b06f] hover:text-[#111] transition-all">
                <span className="material-symbols-outlined text-xl">play_circle</span>
              </a>
            </div>
          </div>

          {/* ROW 3 – Copyright */}
          <div className="text-center text-[#d2b06f]/60 text-xs tracking-wider">
            Copyright 2024 © VIETDESIGN - {lang === 'VN' ? 'Kiến Trúc & Nội Thất' : 'Architecture & Interiors'}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── Floating Action Buttons ── */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-3 z-[70]">
        <FloatingButton href="https://zalo.me/84989942555" label="Zalo Chat" bgColor="#0068ff" textColor="white">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
            alt="Zalo"
            className="w-5 h-5 md:w-6 md:h-6"
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const fallback = document.createElement('span');
              fallback.textContent = 'Za';
              fallback.style.cssText = 'font-weight:800;font-size:14px;font-family:Arial,sans-serif';
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        </FloatingButton>
        <FloatingButton href="tel:+84989942555" label={lang === 'VN' ? 'Gọi Điện' : 'Call Us'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.5 1.19 2 2 0 012.48.98h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.49a16 16 0 006.6 6.6l1.86-1.86a2 2 0 012.11-.45c.908.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </FloatingButton>
        <FloatingButton href="mailto:cskh.vietdesign@gmail.com" label="Email" isMain>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </FloatingButton>
      </div>
    </div>
  );
}