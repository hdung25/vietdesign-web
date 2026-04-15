import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useProjectData } from '../contexts/ProjectDataContext';

function useCountUp(target: number, shouldStart: boolean, duration = 2200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // cubic ease-out
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
          ? 'border-y md:border-y-0 md:border-x border-outline-variant/20 py-8 md:py-0'
          : ''
      }`}
    >
      <span className="text-6xl md:text-7xl font-headline text-[#d2b06f] mb-3 tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-base font-label tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const { t, lang } = useLang();
  const { projects, heroImage, heroTitle, heroSubtitle } = useProjectData();
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLElement>(null);
  const VN = lang === 'VN';

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
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
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #d2b06f, transparent)' }} />

      {/* Stats Counter */}
      <section ref={statsRef} className="bg-[#d2b06f] py-24 relative overflow-hidden text-black">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 text-center">
          <StatItem target={15} suffix="+" label={t('home.stats.years')} shouldStart={statsStarted} />
          <StatItem target={500} suffix="+" label={t('home.stats.projects')} isMiddle shouldStart={statsStarted} />
          <StatItem target={98} suffix="%" label={t('home.stats.satisfaction')} isMiddle shouldStart={statsStarted} />
          <StatItem target={50} suffix="+" label={t('home.stats.awards')} shouldStart={statsStarted} />
        </div>
      </section>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #d2b06f, transparent)' }} />

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
