import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useAdminMode } from '../contexts/AdminModeContext';
import AdminToolbar from './AdminToolbar';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

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



/* ─── Main layout ─── */
export default function Layout({ children }: { children: ReactNode }) {
  const { lang, toggleLang, t } = useLang();
  const { isAdmin } = useAdminMode();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Footer data state
  const [footerData, setFooterData] = useState({
    hanoi: 'Số 6 ngõ 158 đường Thanh Bình, Mỗ Lao, Hà Đông, Hà Nội.',
    hcm: '80 đường số 5 khu dân cư Hồng Long, Hiệp Bình Phước, Thủ Đức HCM.',
    hungyen: 'Chà là 15-41 Vinhome Ocean Park 2.',
    hotline1: '0986921555',
    hotline2: '0989942555',
    hotline3: '0908666622',
    email: 'cskh.vietdesign@gmail.com',
  });
  
  const [editingFooter, setEditingFooter] = useState(false);
  const [localFooter, setLocalFooter] = useState(footerData);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'footer'), (snap) => {
      if (snap.exists()) {
        setFooterData((prev) => ({ ...prev, ...snap.data() }));
      }
    });
    return () => unsub();
  }, []);

  const handleEditFooter = () => {
    setLocalFooter(footerData);
    setEditingFooter(true);
  };

  const handleSaveFooter = async () => {
    await setDoc(doc(db, 'settings', 'footer'), localFooter, { merge: true });
    setEditingFooter(false);
  };

  const navLinks = [
    { to: '/', key: 'nav.home' },
    { to: '/services', key: 'nav.services' },
    { to: '/projects', key: 'nav.projects' },
    { to: '/design', key: 'nav.design' },
    { to: '/about', key: 'nav.about' },
    { to: '/journal', key: 'nav.journal' },
    { to: '/contact', key: 'nav.contact' },
  ];

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
          {navLinks.map(({ to, key }) => {
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

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="shrink-0 cursor-pointer bg-none border-none font-serif tracking-wider text-sm md:text-base outline-none hover:opacity-80 transition-opacity"
          >
            <span style={{ color: lang === 'VN' ? '#fff' : '#d2b06f55' }}>VN</span>
            <span style={{ color: '#d2b06f44', margin: '0 4px' }}>|</span>
            <span style={{ color: lang === 'EN' ? '#fff' : '#d2b06f55' }}>EN</span>
          </button>
          
          {/* Mobile Menu Toggle Btn */}
          <button 
            className="xl:hidden flex flex-col justify-center gap-1.5 w-8 h-8 z-[100]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-[#d2b06f] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#d2b06f] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#d2b06f] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0a] z-40 transition-transform duration-500 xl:hidden flex flex-col items-center justify-center`}
        style={{ transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)', top: isAdmin ? '44px' : '0' }}
      >
        <nav className="flex flex-col items-center gap-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {navLinks.map(({ to, key }) => {
            const isActive = to === '/' ? currentPath === '/' : currentPath.startsWith(to);
            return (
              <Link
                key={key}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  color: isActive ? '#d2b06f' : '#fff',
                  fontSize: '1.25rem',
                  letterSpacing: '0.15em',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Main content ── */}
      <main className="flex-grow pt-16 md:pt-0">{children}</main>



      {/* ── Main Footer ── */}
      <footer className="bg-[#0a0a0a] pt-16 pb-8 border-t-2 border-[#d2b06f] relative">
        {isAdmin && !editingFooter && (
          <button 
            onClick={handleEditFooter} 
            className="absolute top-4 right-4 md:right-10 bg-[#d2b06f] text-[#000] px-4 py-2 text-xs font-bold uppercase tracking-widest z-10 flex items-center gap-2 rounded-sm shadow-lg hover:bg-[#b89555] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
            Sửa Footer
          </button>
        )}

        {isAdmin && editingFooter ? (
          <div className="max-w-4xl mx-auto px-6 mb-12 bg-[#131313] border border-[#d2b06f]/30 p-8">
            <h3 className="text-[#d2b06f] font-bold uppercase tracking-widest text-lg mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">settings</span> CHỈNH SỬA THÔNG TIN CHI NHÁNH & LIÊN HỆ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                 <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Văn phòng Hà Nội</label>
                 <textarea value={localFooter.hanoi} onChange={e => setLocalFooter({...localFooter, hanoi: e.target.value})} rows={2} className="w-full bg-transparent border border-[#333] text-white p-3 outline-none font-body text-sm rounded-sm focus:border-[#d2b06f]" />
              </div>
              <div>
                 <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Văn phòng HCM</label>
                 <textarea value={localFooter.hcm} onChange={e => setLocalFooter({...localFooter, hcm: e.target.value})} rows={2} className="w-full bg-transparent border border-[#333] text-white p-3 outline-none font-body text-sm rounded-sm focus:border-[#d2b06f]" />
              </div>
              <div>
                 <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Văn phòng Hưng Yên</label>
                 <textarea value={localFooter.hungyen} onChange={e => setLocalFooter({...localFooter, hungyen: e.target.value})} rows={2} className="w-full bg-transparent border border-[#333] text-white p-3 outline-none font-body text-sm rounded-sm focus:border-[#d2b06f]" />
              </div>
              <div>
                 <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Email chăm sóc khách hàng</label>
                 <input value={localFooter.email} onChange={e => setLocalFooter({...localFooter, email: e.target.value})} className="w-full bg-transparent border border-[#333] text-white p-3 outline-none font-body text-sm rounded-sm focus:border-[#d2b06f]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                 <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Hotline 1 (Chính)</label>
                 <input value={localFooter.hotline1} onChange={e => setLocalFooter({...localFooter, hotline1: e.target.value})} className="w-full bg-transparent border border-[#333] text-white p-3 outline-none font-body text-sm rounded-sm focus:border-[#d2b06f]" placeholder="VD: 0986921555" />
              </div>
              <div>
                 <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Hotline 2</label>
                 <input value={localFooter.hotline2} onChange={e => setLocalFooter({...localFooter, hotline2: e.target.value})} className="w-full bg-transparent border border-[#333] text-white p-3 outline-none font-body text-sm rounded-sm focus:border-[#d2b06f]" placeholder="VD: 0989942555" />
              </div>
              <div>
                 <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Hotline 3</label>
                 <input value={localFooter.hotline3} onChange={e => setLocalFooter({...localFooter, hotline3: e.target.value})} className="w-full bg-transparent border border-[#333] text-white p-3 outline-none font-body text-sm rounded-sm focus:border-[#d2b06f]" placeholder="VD: 0908666622" />
              </div>
            </div>

            <div className="flex gap-4 border-t border-[#333] pt-6">
              <button onClick={handleSaveFooter} className="bg-[#d2b06f] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#b89555] transition-colors">✔ XÁC NHẬN LƯU</button>
              <button onClick={() => setEditingFooter(false)} className="border border-[#444] text-white/50 px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#222] hover:text-white transition-colors">HỦY BỎ</button>
            </div>
          </div>
        ) : (
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
                  {footerData.hotline1 && (
                    <div className="flex items-center gap-3 text-white">
                      <span className="material-symbols-outlined text-[#d2b06f]">phone</span>
                      <span className="text-sm md:text-base font-light font-body">
                        Hotline: <a href={`tel:${footerData.hotline1}`} className="text-[#d2b06f] hover:underline font-medium tracking-wider">{footerData.hotline1}</a>
                      </span>
                    </div>
                  )}
                  {footerData.hotline2 && (
                    <div className="flex items-center gap-3 text-white">
                      <span className="material-symbols-outlined text-[#d2b06f] opacity-0">phone</span>
                      <span className="text-sm md:text-base font-light font-body">
                        <a href={`tel:${footerData.hotline2}`} className="text-[#d2b06f] hover:underline font-medium tracking-wider">{footerData.hotline2}</a>
                      </span>
                    </div>
                  )}
                  {footerData.hotline3 && (
                    <div className="flex items-center gap-3 text-white">
                      <span className="material-symbols-outlined text-[#d2b06f] opacity-0">phone</span>
                      <span className="text-sm md:text-base font-light font-body">
                        <a href={`tel:${footerData.hotline3}`} className="text-[#d2b06f] hover:underline font-medium tracking-wider">{footerData.hotline3}</a>
                      </span>
                    </div>
                  )}
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
                
                {footerData.hanoi && (
                  <>
                    <div className="text-[#d2b06f] font-semibold mb-2 text-sm md:text-base uppercase tracking-wider">
                      {lang === 'VN' ? 'VĂN PHÒNG HÀ NỘI' : 'HANOI OFFICE'}
                    </div>
                    <div className="text-white/70 mb-6 text-sm md:text-base font-light leading-relaxed">
                      {footerData.hanoi}
                    </div>
                  </>
                )}
                
                {footerData.hcm && (
                  <>
                    <div className="text-[#d2b06f] font-semibold mb-2 text-sm md:text-base uppercase tracking-wider">
                      {lang === 'VN' ? 'VĂN PHÒNG HCM' : 'HCM OFFICE'}
                    </div>
                    <div className="text-white/70 mb-6 text-sm md:text-base font-light leading-relaxed">
                      {footerData.hcm}
                    </div>
                  </>
                )}
                
                {footerData.hungyen && (
                  <>
                    <div className="text-[#d2b06f] font-semibold mb-2 text-sm md:text-base uppercase tracking-wider">
                      {lang === 'VN' ? 'VĂN PHÒNG HƯNG YÊN' : 'HUNG YEN OFFICE'}
                    </div>
                    <div className="text-white/70 mb-6 text-sm md:text-base font-light leading-relaxed">
                      {footerData.hungyen}
                    </div>
                  </>
                )}

                <div className="text-[#d2b06f] font-semibold mb-2 text-sm md:text-base uppercase tracking-wider">
                  HOTLINE
                </div>
                <div className="mb-6 text-sm md:text-base font-light flex flex-col gap-2">
                  {footerData.hotline1 && (
                    <a href={`tel:${footerData.hotline1}`} className="text-[#d2b06f] font-bold tracking-wider hover:underline transition-all duration-300 inline-block">
                      {footerData.hotline1}
                    </a>
                  )}
                  {footerData.hotline2 && (
                    <a href={`tel:${footerData.hotline2}`} className="text-[#d2b06f] font-bold tracking-wider hover:underline transition-all duration-300 inline-block">
                      {footerData.hotline2}
                    </a>
                  )}
                  {footerData.hotline3 && (
                    <a href={`tel:${footerData.hotline3}`} className="text-[#d2b06f] font-bold tracking-wider hover:underline transition-all duration-300 inline-block">
                      {footerData.hotline3}
                    </a>
                  )}
                </div>
                
                {footerData.email && (
                  <>
                    <div className="text-[#d2b06f] font-semibold mb-2 text-sm md:text-base uppercase tracking-wider">
                      EMAIL
                    </div>
                    <div className="text-white/70 text-sm md:text-base font-light">
                      <a href={`mailto:${footerData.email}`} className="hover:text-[#d2b06f] transition-colors">
                        {footerData.email}
                      </a>
                    </div>
                  </>
                )}
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

            </div>

            {/* ROW 3 – Copyright */}
            <div className="text-center text-[#d2b06f]/60 text-xs tracking-wider">
              Copyright 2024 © VIETDESIGN - {lang === 'VN' ? 'Kiến Trúc & Nội Thất' : 'Architecture & Interiors'}. All rights reserved.
            </div>
          </div>
        )}
      </footer>

      {/* ── Floating Action Buttons ── */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-3 z-[70]">
        <FloatingButton href={`https://zalo.me/${footerData.hotline1}`} label="Zalo Chat" bgColor="#0068ff" textColor="white">
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
        <FloatingButton href={`tel:${footerData.hotline1}`} label={lang === 'VN' ? 'Gọi Điện' : 'Call Us'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.5 1.19 2 2 0 012.48.98h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.49a16 16 0 006.6 6.6l1.86-1.86a2 2 0 012.11-.45c.908.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </FloatingButton>
        <FloatingButton href={`mailto:${footerData.email}`} label="Email" isMain>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </FloatingButton>
      </div>
    </div>
  );
}