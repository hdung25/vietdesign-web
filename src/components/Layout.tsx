import { Link, useLocation } from 'react-router-dom';
import { useState, type FormEvent, type ReactNode } from 'react';
import { useLang } from '../contexts/LanguageContext';

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
    <div className="group relative flex items-center justify-end">
      <span className="absolute right-[calc(100%+12px)] bg-[#131313] border border-[#c9a96e]/30 text-[#c9a96e] text-[0.65rem] font-label tracking-[0.15em] uppercase px-3 py-1.5 rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        {label}
      </span>
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={bgColor ? { backgroundColor: bgColor, color: textColor || 'white' } : undefined}
        className={[
          'w-14 h-14 rounded-full flex items-center justify-center shadow-xl',
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
    src="https://maps.google.com/maps?q=Bac+Ha+Tower+Ha+Dong+Ha+Noi+Vietnam&output=embed&z=14"
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
    <div id="newsletter-section" style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
        <h2 style={{ color: '#000', fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
          {VN ? 'THEO DÕI TIN TỨC TỪ CHÚNG TÔI' : 'STAY UP TO DATE WITH US'}
        </h2>
        <p style={{ color: '#333', marginBottom: '24px' }}>
          {VN
            ? 'Đăng ký để nhận thông tin cập nhật về các dự án và tin tức mới nhất của VIETDESIGN'
            : 'Subscribe to receive updates on our latest projects and news from VIETDESIGN'}
        </p>
        {sent ? (
          <div style={{ color: '#000', fontWeight: 600, fontSize: '1rem' }}>
            {VN ? 'Cảm ơn! Chúng tôi sẽ liên hệ sớm.' : 'Thank you! We will be in touch soon.'}
          </div>
        ) : (
          <form
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', maxWidth: '900px', margin: '0 auto' }}
            onSubmit={handleSubmit}
          >
            <input
              required
              value={fields.name}
              onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
              placeholder={VN ? 'Họ và tên (*)' : 'Full name (*)'}
              style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '14px 16px', fontSize: '1rem' }}
            />
            <input
              required
              value={fields.phone}
              onChange={e => setFields(f => ({ ...f, phone: e.target.value }))}
              placeholder={VN ? 'Số điện thoại (*)' : 'Phone number (*)'}
              style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '14px 16px', fontSize: '1rem' }}
            />
            <input
              value={fields.email}
              onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '14px 16px', fontSize: '1rem' }}
            />
            <input
              required
              value={fields.address}
              onChange={e => setFields(f => ({ ...f, address: e.target.value }))}
              placeholder={VN ? 'Địa chỉ (*)' : 'Address (*)'}
              style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '14px 16px', fontSize: '1rem', gridColumn: 'span 2' }}
            />
            <button
              type="submit"
              style={{
                background: 'transparent',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
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
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body selection:bg-primary/30 selection:text-primary">

      {/* ── Header ── */}
      <header
        className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl flex justify-between items-center px-10 py-5"
        style={{ borderBottom: '2px solid #d2b06f' }}
      >
        <div className="flex items-center gap-4">
          <span
            className="material-symbols-outlined text-[#d2b06f] cursor-pointer"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
          >
            menu
          </span>
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="VIETDESIGN"
              className="h-10 w-auto object-contain rounded-full"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span
              className="text-xl font-light tracking-[0.25em] text-[#d2b06f]"
              style={{ fontFamily: 'Noto Serif, serif', textShadow: 'none' }}
            >
              VIETDESIGN
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10" style={{ fontFamily: 'Manrope, sans-serif' }}>
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
                style={{
                  color: isActive ? '#d2b06f' : '#d0c5b5',
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'color 0.25s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d2b06f')}
                onMouseLeave={e => (e.currentTarget.style.color = isActive ? '#d2b06f' : '#d0c5b5')}
              >
                {t(key)}
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: isActive ? '#d2b06f' : 'transparent',
                  boxShadow: isActive ? '0 0 6px 2px rgba(210,176,111,0.7)' : 'none',
                  transition: 'all 0.3s',
                  display: 'block',
                }} />
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggleLang}
          style={{ cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Noto Serif, serif', letterSpacing: '0.05em' }}
          aria-label="Toggle language"
        >
          <span style={{ color: lang === 'VN' ? '#fff' : '#d2b06f55' }}>VN</span>
          <span style={{ color: '#d2b06f44', margin: '0 4px' }}>|</span>
          <span style={{ color: lang === 'EN' ? '#fff' : '#d2b06f55' }}>EN</span>
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="flex-grow">{children}</main>

      {/* ── Newsletter strip ── */}
      <NewsletterSection lang={lang} />

      {/* ── Main Footer ── */}
      <footer style={{ background: '#0a0a0a', padding: '60px 0 30px', borderTop: '2px solid #d2b06f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

          {/* ROW 1 – Logo / Map / Branch */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', marginBottom: '40px', alignItems: 'start' }}>

            {/* LEFT: Logo block */}
            <div>
              <img
                src="/logo.png"
                alt="VIETDESIGN"
                style={{ height: '100px', display: 'block', marginBottom: '8px' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div style={{ color: '#d2b06f', fontSize: '0.8rem', letterSpacing: '0.2rem', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 600 }}>
                NÂNG TẦM GIÁ TRỊ CUỘC SỐNG
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                  <span className="material-symbols-outlined" style={{ color: '#d2b06f' }}>phone</span>
                  <span style={{ fontSize: '0.95rem' }}>Hotline: +84 989 942 555 / +84 908 666 622</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                  <span className="material-symbols-outlined" style={{ color: '#d2b06f' }}>language</span>
                  <span style={{ fontSize: '0.95rem' }}>Website: www.vietdesign.vn</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                  <span className="material-symbols-outlined" style={{ color: '#d2b06f' }}>group</span>
                  <span style={{ fontSize: '0.95rem' }}>Facebook: VietDesign</span>
                </div>
              </div>
            </div>

            {/* MIDDLE: Google Maps */}
            <div>
              <OfficeMap />
            </div>

            {/* RIGHT: Branch info */}
            <div>
              <div style={{ color: '#d2b06f', fontSize: '0.8rem', letterSpacing: '0.2rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                {lang === 'VN' ? 'HỆ THỐNG CHI NHÁNH' : 'OUR BRANCHES'}
              </div>
              <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
                VIETDESIGN
              </div>
              <div style={{ height: '2px', background: '#d2b06f', width: '100%', marginBottom: '16px' }} />
              <div style={{ color: '#d2b06f', fontWeight: 'bold', marginBottom: '4px' }}>
                {lang === 'VN' ? 'VĂN PHÒNG HÀ NỘI' : 'HANOI OFFICE'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
                C37 Bắc Hà Tower, Tố Hữu, Hà Đông, Hà Nội
              </div>
              <div style={{ color: '#d2b06f', fontWeight: 'bold', marginBottom: '4px' }}>
                EMAIL
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>
                cskh.vietdesign@gmail.com
              </div>
            </div>
          </div>

          {/* ROW 2 – Gold divider + Nav links + Social icons */}
          <div style={{ height: '2px', background: '#d2b06f', width: '100%', marginBottom: '24px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link
                to="/about"
                style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d2b06f')}
                onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
              >
                GIỚI THIỆU
              </Link>
              <Link
                to="#"
                style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d2b06f')}
                onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
              >
                THÔNG BÁO PHÁP LÝ
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link
                to="/contact"
                style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d2b06f')}
                onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
              >
                LIÊN HỆ
              </Link>
              <Link
                to="#"
                style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d2b06f')}
                onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
              >
                CHÍNH SÁCH BẢO MẬT
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <a
                href="https://facebook.com/vietdesign"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #d2b06f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d2b06f', textDecoration: 'none' }}
              >
                <span className="material-symbols-outlined">group</span>
              </a>
              <a
                href="https://instagram.com/vietdesign"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #d2b06f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d2b06f', textDecoration: 'none' }}
              >
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
              <a
                href="https://youtube.com/@vietdesign"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #d2b06f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d2b06f', textDecoration: 'none' }}
              >
                <span className="material-symbols-outlined">play_circle</span>
              </a>
            </div>
          </div>

          {/* ROW 3 – Copyright */}
          <div style={{ height: '2px', background: '#d2b06f', width: '100%', marginBottom: '24px' }} />
          <div style={{ textAlign: 'center', color: '#d2b06f', fontSize: '0.85rem' }}>
            Copyright 2024 © VIETDESIGN - {lang === 'VN' ? 'Kiến Trúc & Nội Thất' : 'Architecture & Interiors'}
          </div>
        </div>
      </footer>

      {/* ── Floating Action Buttons ── */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-3 z-[70]">
        <FloatingButton href="https://zalo.me/84989942555" label="Zalo Chat" bgColor="#0068ff" textColor="white">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
            alt="Zalo"
            className="w-6 h-6"
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.5 1.19 2 2 0 012.48.98h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.49a16 16 0 006.6 6.6l1.86-1.86a2 2 0 012.11-.45c.908.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </FloatingButton>
        <FloatingButton href="mailto:cskh.vietdesign@gmail.com" label="Email" isMain>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </FloatingButton>
      </div>
    </div>
  );
}
