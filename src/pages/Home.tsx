import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useProjectData } from '../contexts/ProjectDataContext';
import { useAdminMode } from '../contexts/AdminModeContext';
import Newsletter from '../components/Newsletter';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function useCountUp(target: number, shouldStart: boolean, duration = 2200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, shouldStart, duration]);
  return count;
}

function StatItem({
  target,
  suffix,
  label,
  isMiddle,
  shouldStart,
}: {
  target: number;
  suffix: string;
  label: string;
  isMiddle?: boolean;
  shouldStart: boolean;
}) {
  const count = useCountUp(target, shouldStart);
  return (
    <div
      className={`flex flex-col items-center ${
        isMiddle
          ? 'border-y md:border-y-0 md:border-x border-outline-variant/20 py-6 md:py-0'
          : ''
      }`}
    >
      <span className="text-5xl md:text-7xl font-headline text-[#d2b06f] mb-2 md:mb-3 tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-xs md:text-base font-label tracking-widest uppercase text-white/70">
        {label}
      </span>
    </div>
  );
}

/* ── Admin inline edit button ── */
function EditBtn({ onClick, label = 'Chỉnh Sửa' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(210,176,111,0.92)',
        color: '#000',
        border: 'none',
        padding: '6px 14px',
        cursor: 'pointer',
        fontFamily: 'Manrope, sans-serif',
        fontWeight: 700,
        fontSize: '0.62rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        zIndex: 20,
        borderRadius: '2px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 0, 'wght' 400" }}>edit</span>
      {label}
    </button>
  );
}

export default function Home() {
  const { t, lang } = useLang();
  const { projects, heroImage, heroTitle, heroSubtitle, setHeroImage, setHeroTitle, setHeroSubtitle } = useProjectData();
  const { isAdmin } = useAdminMode();
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLElement>(null);
  const VN = lang === 'VN';

  const [editingHero, setEditingHero] = useState(false);
  const [localTitle, setLocalTitle] = useState('');
  const [localSubtitle, setLocalSubtitle] = useState('');
  const [localImage, setLocalImage] = useState<string | null>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const [heroSaving, setHeroSaving] = useState(false);

  // Service card image editing
  const [editingCard, setEditingCard] = useState<1 | 2 | null>(null);
  const card1Ref = useRef<HTMLInputElement>(null);
  const card2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const openHeroEdit = () => {
    setLocalTitle(heroTitle);
    setLocalSubtitle(heroSubtitle);
    setLocalImage(heroImage);
    setEditingHero(true);
  };

  const saveHero = async () => {
    if (!window.confirm('Xác nhận lưu lại tất cả các thay đổi?')) return;
    setHeroSaving(true);
    if (localImage !== heroImage) await setHeroImage(localImage);
    await setHeroTitle(localTitle);
    await setHeroSubtitle(localSubtitle);
    setHeroSaving(false);
    setEditingHero(false);
  };

  const handleHeroImageLocal = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalImage(await toBase64(file));
    e.target.value = '';
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center" style={{ position: 'relative' }}>
        <div className="absolute inset-0 z-0">
          <img
            alt="Luxury Modern Architecture"
            className="w-full h-full object-cover ken-burns"
            src={heroImage || "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=85&fit=crop"}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#131313]"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="text-[#d2b06f] font-medium tracking-[0.4em] uppercase text-2xl md:text-3xl mb-6">
            {heroSubtitle || t('home.hero.subtitle')}
          </p>
          <h2 className="font-headline text-7xl md:text-8xl lg:text-9xl text-white mb-10 tracking-tight leading-tight">
            <span className="italic font-light">{heroTitle || 'VIETDESIGN'}</span>
          </h2>
          <Link
            to="/projects"
            className="inline-block gold-glow bg-[#d2b06f] text-black px-10 py-4 font-label font-bold tracking-widest uppercase text-xs hover:brightness-110 transition-all"
          >
            {t('home.hero.cta')}
          </Link>
        </div>

        {/* Admin: Hero edit overlay */}
        {isAdmin && !editingHero && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto', position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => heroFileRef.current?.click()}
                style={{ background: 'rgba(30,20,0,0.85)', border: '1px solid #d2b06f60', color: '#d2b06f', padding: '7px 16px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '2px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>image</span>
                Đổi Ảnh Nền
              </button>
              <button
                onClick={openHeroEdit}
                style={{ background: 'rgba(210,176,111,0.92)', color: '#000', border: 'none', padding: '7px 16px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '2px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 0, 'wght' 400" }}>edit</span>
                Sửa Tiêu Đề
              </button>
            </div>
          </div>
        )}

        {/* Admin: Hero inline form */}
        {isAdmin && editingHero && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 15, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#131313', border: '1px solid #d2b06f40', borderTop: '2px solid #d2b06f', padding: '32px', width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ color: '#d2b06f', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', fontWeight: 700 }}>
                ✏ Chỉnh Sửa Hero Section
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#666', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>Tiêu Đề Lớn</label>
                <input
                  value={localTitle}
                  onChange={e => setLocalTitle(e.target.value)}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '6px 0', outline: 'none', fontFamily: 'Noto Serif, serif', fontSize: '1.1rem', width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#666', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>Phụ Đề</label>
                <input
                  value={localSubtitle}
                  onChange={e => setLocalSubtitle(e.target.value)}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '6px 0', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem', width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => heroFileRef.current?.click()}
                  style={{ background: '#1e1600', border: '1px dashed #4d4639', color: '#d2b06f', padding: '10px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flex: 1 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>upload</span>
                  {localImage ? 'Đổi Ảnh Nền' : 'Tải Ảnh Lên'}
                </button>
                {localImage && (
                  <button onClick={() => setLocalImage(null)} style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '10px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    ✕ Xóa Ảnh
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={saveHero}
                  disabled={heroSaving}
                  style={{ flex: 1, background: '#d2b06f', color: '#000', border: 'none', padding: '12px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: heroSaving ? 0.7 : 1 }}
                >
                  {heroSaving ? 'Đang lưu...' : 'Xác Nhận Lưu'}
                </button>
                <button
                  onClick={() => setEditingHero(false)}
                  style={{ flex: 1, background: 'transparent', border: '1px solid #333', color: '#888', padding: '12px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
        <input ref={heroFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroImageLocal} />
      </section>

      {/* Services Section */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h3 className="font-headline text-7xl md:text-8xl lg:text-9xl text-[#d2b06f] mb-4">{t('home.practice.title')}</h3>
              <p className="text-on-surface-variant text-xl leading-relaxed max-w-lg">{t('home.practice.desc')}</p>
            </div>
            <span className="text-[#d2b06f] font-headline italic text-5xl md:text-6xl">{t('home.practice.tagline')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Card 1 */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low border-l-4 border-[#d2b06f]">
              <img
                alt="Architectural Design"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="/anh3.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <h4 className="font-headline text-4xl md:text-5xl text-white mb-4">{t('home.card1.title')}</h4>
                <p className="text-on-surface-variant mb-6 text-xl leading-relaxed max-w-sm">{t('home.card1.desc')}</p>
                <Link to="/services" className="text-[#d2b06f] tracking-widest uppercase text-base font-bold border-b border-[#d2b06f]/30 pb-1 hover:border-[#d2b06f] transition-all">{t('home.explore')}</Link>
              </div>
              {isAdmin && (
                <EditBtn label="Đổi Ảnh" onClick={() => card1Ref.current?.click()} />
              )}
              <input ref={card1Ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                // TODO: persist card images via context when ready
                e.target.value = '';
              }} />
            </div>
            {/* Card 2 */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low border-l-4 border-[#d2b06f]">
              <img
                alt="Master Construction"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="/anh4.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <h4 className="font-headline text-4xl md:text-5xl text-white mb-4">{t('home.card2.title')}</h4>
                <p className="text-on-surface-variant mb-6 text-xl leading-relaxed max-w-sm">{t('home.card2.desc')}</p>
                <Link to="/services" className="text-[#d2b06f] tracking-widest uppercase text-base font-bold border-b border-[#d2b06f]/30 pb-1 hover:border-[#d2b06f] transition-all">{t('home.explore')}</Link>
              </div>
              {isAdmin && (
                <EditBtn label="Đổi Ảnh" onClick={() => card2Ref.current?.click()} />
              )}
              <input ref={card2Ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                e.target.value = '';
              }} />
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #d2b06f, transparent)' }} />

      {/* Featured Projects Grid – clickable, powered by ProjectDataContext */}
      <section className="py-32 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-10">
          <h3 className="font-headline text-5xl md:text-6xl text-[#d2b06f] text-center mb-24 tracking-tight">{t('home.featured.title')}</h3>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
            {projects.slice(0, 6).map((proj) => {
              const title = VN ? proj.title : proj.titleEN;
              return (
              <Link key={proj.id} to={`/projects/${proj.id}`} className="relative group overflow-hidden break-inside-avoid block" style={{ textDecoration: 'none' }}>
                <img
                  alt={title}
                  className="w-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  src={proj.coverImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h5 className="font-headline text-2xl md:text-3xl text-[#d2b06f] uppercase tracking-wide mb-1">{title}</h5>
                  <p className="text-white/80 text-base tracking-widest uppercase">{proj.location}</p>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.6)', padding: '10px 24px', fontFamily: 'Manrope, sans-serif', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {VN ? 'XEM DỰ ÁN' : 'VIEW PROJECT'}
                  </span>
                </div>
              </Link>
            )})}
          </div>

          {/* Admin: link to manage projects */}
          {isAdmin && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link
                to="/projects"
                style={{ background: 'rgba(210,176,111,0.12)', border: '1px solid #d2b06f40', color: '#d2b06f', padding: '10px 28px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '2px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>apartment</span>
                Quản Lý Tất Cả Dự Án →
              </Link>
            </div>
          )}
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #d2b06f, transparent)' }} />

      {/* Why Us */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: 'architecture', titleKey: 'home.why.title1', descKey: 'home.why.desc1' },
              { icon: 'auto_awesome', titleKey: 'home.why.title2', descKey: 'home.why.desc2' },
              { icon: 'verified', titleKey: 'home.why.title3', descKey: 'home.why.desc3' },
              { icon: 'eco', titleKey: 'home.why.title4', descKey: 'home.why.desc4' },
            ].map(({ icon, titleKey, descKey }) => (
              <div key={titleKey} className="flex flex-col items-start gap-4">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>{icon}</span>
                <h6 className="font-headline text-lg text-white">{t(titleKey)}</h6>
                <p className="text-on-surface-variant text-sm leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #d2b06f, transparent)' }} />

      {/* Testimonial */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-5xl mx-auto px-10 text-center">
          <span className="material-symbols-outlined text-primary/30 text-6xl mb-8" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>format_quote</span>
          <div className="flex flex-col items-center gap-8">
            <p className="font-headline text-2xl md:text-3xl text-white italic leading-relaxed">{t('home.testimonial')}</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-primary"></div>
              <span className="text-primary font-label tracking-widest uppercase text-xs">{t('home.testimonial.author')}</span>
              <div className="w-12 h-[1px] bg-primary"></div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #d2b06f, transparent)' }} />

      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #d2b06f, transparent)' }} />

      <Newsletter lang={lang} />

      {/* Stats Counter */}
      <section ref={statsRef} className="bg-[#0a0a0a] py-12 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 text-center">
          <StatItem target={15} suffix="+" label={t('home.stats.years')} shouldStart={statsStarted} />
          <StatItem target={500} suffix="+" label={t('home.stats.projects')} isMiddle shouldStart={statsStarted} />
          <StatItem target={98} suffix="%" label={t('home.stats.satisfaction')} isMiddle shouldStart={statsStarted} />
          <StatItem target={50} suffix="+" label={t('home.stats.awards')} shouldStart={statsStarted} />
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #d2b06f, transparent)' }} />

      {/* Contact CTA Banner */}
      <section className="py-24 px-10">
        <div className="max-w-7xl mx-auto relative h-[400px] overflow-hidden">
          <img
            alt="Contact Banner"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85&fit=crop"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-6">
            <h3 className="font-headline text-4xl md:text-5xl text-white mb-8">{t('home.cta.title')}</h3>
            <Link to="/contact" className="gold-glow bg-primary text-on-primary px-12 py-5 font-label font-bold tracking-widest uppercase text-xs">
              {t('home.cta.btn')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}