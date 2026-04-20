import { useParams, Link } from 'react-router-dom';
import { useProjectData } from '../contexts/ProjectDataContext';
import { useLang } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjectData();
  const { lang } = useLang();
  const VN = lang === 'VN';
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [id]);

  const project = projects.find(p => p.id === Number(id));

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#d2b06f', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '24px' }}>
            {VN ? 'Dự án không tồn tại' : 'Project not found'}
          </p>
          <Link to="/projects" style={{ color: '#d2b06f', fontFamily: 'Manrope, sans-serif', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #d2b06f', paddingBottom: '2px' }}>
            {VN ? '← Quay lại dự án' : '← Back to projects'}
          </Link>
        </div>
      </div>
    );
  }

  // Other projects (excluding current)
  const others = projects.filter(p => p.id !== project.id).slice(0, 3);

  const title = VN ? project.title : project.titleEN;
  const desc = VN ? project.desc : project.descEN;
  const MAX_DESC_LENGTH = 300;
  
  const shouldTruncate = desc && desc.length > MAX_DESC_LENGTH;
  const displayDesc = shouldTruncate && !isExpanded 
    ? desc.substring(0, MAX_DESC_LENGTH).replace(/\\s+\\S*$/, "") + '...' 
    : desc;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '14px 40px' }}>
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', fontFamily: 'Manrope, sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>{VN ? 'Trang Chủ' : 'Home'}</Link>
          <span style={{ color: '#333' }}>›</span>
          <Link to="/projects" style={{ color: '#666', textDecoration: 'none' }}>{VN ? 'Dự Án' : 'Projects'}</Link>
          <span style={{ color: '#333' }}>›</span>
          <span style={{ color: '#d2b06f' }}>{title}</span>
        </nav>
      </div>

      {/* ── Project Title ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px 16px', textAlign: 'center' }}>
        <p style={{ color: '#d2b06f', fontFamily: 'Manrope, sans-serif', fontSize: '0.72rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '12px' }}>
          {project.category} — {project.location}
        </p>
        <h1 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontWeight: 300, letterSpacing: '0.06em', margin: '0 0 24px' }}>
          {title}
        </h1>
        {desc && (
          <div style={{ maxWidth: '850px', margin: '0 auto 40px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Manrope, sans-serif', margin: 0, whiteSpace: 'pre-wrap', textAlign: 'left', padding: '0 16px', lineHeight: '1.9' }}>
              {displayDesc}
            </p>
            {shouldTruncate && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ background: 'none', border: 'none', color: '#d2b06f', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em', marginTop: '24px', padding: '4px 0', textTransform: 'uppercase', borderBottom: '1px solid rgba(210, 176, 111, 0.4)', transition: 'all 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.borderBottomColor = '#d2b06f'}
                onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'rgba(210, 176, 111, 0.4)'}
              >
                {isExpanded ? (VN ? 'Thu gọn' : 'Show less') : (VN ? 'Xem thêm' : 'Read more')}
              </button>
            )}
          </div>
        )}
        <div style={{ width: '80px', height: '1px', background: '#d2b06f', margin: '0 auto', opacity: 0.5 }} />
      </div>

      {/* ── Images ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 40px' }}>
        {/* Cover image always first */}
        <div style={{ marginBottom: '20px' }}>
          <img
            src={project.coverImage}
            alt={title}
            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
          />
        </div>

        {/* Gallery images */}
        {project.galleryImages.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {project.galleryImages.map((src, idx) => (
              <div key={idx}>
                <img
                  src={src}
                  alt={`${title} - ${idx + 1}`}
                  style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', borderTop: '1px solid #1e1e1e' }}>
            <p style={{ color: '#444', fontFamily: 'Manrope, sans-serif', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {VN ? 'Thư viện ảnh đang được cập nhật...' : 'Gallery coming soon...'}
            </p>
          </div>
        )}
      </div>

      {/* ── Other Projects ── */}
      {others.length > 0 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 80px' }}>
          <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '48px' }}>
            <h2 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '0.05em', textAlign: 'center', marginBottom: '36px' }}>
              {VN ? 'DỰ ÁN KHÁC' : 'OTHER PROJECTS'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${others.length}, 1fr)`, gap: '24px' }}>
              {others.map(p => {
                const t = VN ? p.title : p.titleEN;
                return (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    style={{ textDecoration: 'none', cursor: 'pointer', display: 'block' }}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div style={{ overflow: 'hidden', aspectRatio: '4/3', marginBottom: '16px' }}>
                      <img
                        src={p.coverImage}
                        alt={t}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    </div>
                    <p style={{ color: '#fff', fontFamily: 'Noto Serif, serif', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>{t}</p>
                    <p style={{ color: '#d2b06f', fontFamily: 'Manrope, sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>→</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
