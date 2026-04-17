import { useState, useRef, type ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminMode } from '../contexts/AdminModeContext';
import { useProjectData } from '../contexts/ProjectDataContext';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

export default function AdminToolbar() {
  const { isAdmin, logout } = useAdminMode();
  const { heroImage, heroTitle, heroSubtitle, setHeroImage, setHeroTitle, setHeroSubtitle } = useProjectData();
  const navigate = useNavigate();
  const location = useLocation();
  const [panel, setPanel] = useState<null | 'hero'>(null);
  const [saved, setSaved] = useState(false);
  const [localTitle, setLocalTitle] = useState('');
  const [localSubtitle, setLocalSubtitle] = useState('');
  const [localImage, setLocalImage] = useState<string | null>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) return null;

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const openHeroPanel = () => {
    setLocalTitle(heroTitle);
    setLocalSubtitle(heroSubtitle);
    setLocalImage(heroImage);
    setPanel('hero');
  };

  const saveHero = async () => {
    if (!window.confirm('Xác nhận lưu lại tất cả các thay đổi?')) return;
    if (localImage !== heroImage) await setHeroImage(localImage);
    await setHeroTitle(localTitle);
    await setHeroSubtitle(localSubtitle);
    flash();
    setPanel(null);
  };

  const handleHeroImageLocal = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalImage(await toBase64(file));
    e.target.value = '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isOn = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const page = location.pathname;

  return (
    <>
      {/* ── Admin Bar ── */}
      <div
        id="admin-toolbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '44px',
          background: 'linear-gradient(90deg, #140e00 0%, #221600 50%, #140e00 100%)',
          borderBottom: '2px solid #d2b06f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 9999,
          fontFamily: 'Manrope, sans-serif',
          boxShadow: '0 2px 24px rgba(210,176,111,0.12)',
          gap: '12px',
        }}
      >
        {/* Left: badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span style={{ background: '#d2b06f', color: '#000', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
            ✦ ADMIN
          </span>
          <span style={{ color: '#666', fontSize: '0.68rem', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            {page === '/' ? 'Trang Chủ' : page === '/projects' ? 'Dự Án' : page === '/journal' ? 'Tạp Chí' : page === '/contact' ? 'Liên Hệ' : page === '/about' ? 'Về Chúng Tôi' : page === '/services' ? 'Dịch Vụ' : page}
          </span>
        </div>

        {/* Center: quick edit buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
          {/* Home hero edit – only when on home page */}
          {page === '/' && (
            <AdminBarBtn icon="image" label="Hero" active onClick={openHeroPanel} />
          )}
          <AdminBarBtn icon="home" label="Trang Chủ" active={isOn('/')} onClick={() => navigate('/')} />
          <AdminBarBtn icon="design_services" label="Dịch Vụ" active={isOn('/services')} onClick={() => navigate('/services')} />
          <AdminBarBtn icon="apartment" label="Dự Án" active={isOn('/projects')} onClick={() => navigate('/projects')} />
          <AdminBarBtn icon="info" label="Về Chúng Tôi" active={isOn('/about')} onClick={() => navigate('/about')} />
          <AdminBarBtn icon="article" label="Tạp Chí" active={isOn('/journal')} onClick={() => navigate('/journal')} />
          <AdminBarBtn icon="contact_phone" label="Liên Hệ" active={isOn('/contact')} onClick={() => navigate('/contact')} />
        </div>

        {/* Right: status + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          {saved && (
            <span style={{ color: '#4ade80', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1, 'wght' 400" }}>check_circle</span> Đã lưu
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid #d2b06f35', color: '#d2b06f', padding: '4px 12px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '2px', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d2b06f15'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '12px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>logout</span>
            Thoát
          </button>
        </div>
      </div>

      {/* ── Hero Edit Drop-down Panel (only when on home page) ── */}
      {panel === 'hero' && (
        <div style={{ position: 'fixed', top: '44px', left: 0, right: 0, background: '#141005', borderBottom: '1px solid #d2b06f25', padding: '18px 28px', zIndex: 9998, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
          <span style={{ color: '#d2b06f', fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'Manrope, sans-serif' }}>✏ Hero</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: '180px' }}>
            <label style={{ color: '#555', fontSize: '0.57rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>Tiêu Đề</label>
            <input value={localTitle} onChange={e => setLocalTitle(e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '3px 0 5px', outline: 'none', fontFamily: 'Noto Serif, serif', fontSize: '0.95rem', width: '100%' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: '180px' }}>
            <label style={{ color: '#555', fontSize: '0.57rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>Phụ Đề</label>
            <input value={localSubtitle} onChange={e => setLocalSubtitle(e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '3px 0 5px', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.88rem', width: '100%' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <label style={{ color: '#555', fontSize: '0.57rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>Ảnh Nền</label>
            <button onClick={() => heroFileRef.current?.click()} style={{ background: '#1e1600', border: '1px dashed #4d4639', color: '#d2b06f', padding: '5px 14px', cursor: 'pointer', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>upload</span>
              {localImage ? 'Đổi Ảnh' : 'Tải Lên'}
            </button>
            <input ref={heroFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroImageLocal} />
            {localImage && (
              <button onClick={() => setLocalImage(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.57rem', letterSpacing: '0.1em', padding: '2px 0', textAlign: 'left', fontFamily: 'Manrope, sans-serif' }}>✕ Xóa ảnh</button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
            <button onClick={saveHero} style={{ background: '#d2b06f', color: '#000', border: 'none', padding: '7px 20px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Lưu</button>
            <button onClick={() => setPanel(null)} style={{ background: 'transparent', border: '1px solid #2a2010', color: '#666', padding: '7px 14px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hủy</button>
          </div>
        </div>
      )}
    </>
  );
}

function AdminBarBtn({ icon, label, onClick, active }: { icon: string; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        background: active ? 'rgba(210,176,111,0.18)' : 'rgba(210,176,111,0.05)',
        border: active ? '1px solid rgba(210,176,111,0.5)' : '1px solid rgba(210,176,111,0.12)',
        color: active ? '#d2b06f' : '#7a6840',
        padding: '4px 10px',
        cursor: 'pointer',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '0.58rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: '2px',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(210,176,111,0.22)'; e.currentTarget.style.color = '#d2b06f'; }}
      onMouseLeave={e => { e.currentTarget.style.background = active ? 'rgba(210,176,111,0.18)' : 'rgba(210,176,111,0.05)'; e.currentTarget.style.color = active ? '#d2b06f' : '#7a6840'; }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '12px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>{icon}</span>
      {label}
    </button>
  );
}