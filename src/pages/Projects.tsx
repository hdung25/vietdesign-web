import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useProjectData, type Category } from '../contexts/ProjectDataContext';

export default function Projects() {
  const { t, lang } = useLang();
  const { projects } = useProjectData();
  const [activeFilter, setActiveFilter] = useState<'all' | Category>('all');

  const filters: Array<{ key: 'all' | Category; label: string; labelEN: string }> = [
    { key: 'all', label: 'Tất Cả', labelEN: 'All' },
    { key: 'Villa', label: 'Villa', labelEN: 'Villa' },
    { key: 'Căn Hộ', label: 'Căn Hộ', labelEN: 'Apartment' },
    { key: 'Kiến Trúc', label: 'Kiến Trúc', labelEN: 'Architecture' },
    { key: 'Nội Thất', label: 'Nội Thất', labelEN: 'Interior' },
  ];

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const VN = lang === 'VN';

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div style={{ position: 'relative', height: '60vh', minHeight: '400px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1920&q=85&fit=crop"
          alt="Projects"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.75))' }} />
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 2 }}>
          <p style={{ color: '#d2b06f', letterSpacing: '0.4em', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Manrope, sans-serif' }}>
            {VN ? 'DANH MỤC ĐẦU TƯ' : 'PORTFOLIO'}
          </p>
          <h1 style={{ fontFamily: 'Noto Serif, serif', fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#fff', fontWeight: 300, letterSpacing: '0.05em', lineHeight: 1.1 }}>
            {VN ? 'DỰ ÁN TIÊU BIỂU' : 'SELECTED WORKS'}
          </h1>
          <div style={{ width: '60px', height: '2px', background: '#d2b06f', margin: '20px auto 0' }} />
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: '#111', borderBottom: '1px solid #d2b06f22', padding: '20px 40px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', position: 'sticky', top: '80px', zIndex: 40 }}>
        {filters.map(({ key, label, labelEN }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            style={{
              padding: '10px 24px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: activeFilter === key ? '1px solid #d2b06f' : '1px solid #333',
              background: activeFilter === key ? '#d2b06f' : 'transparent',
              color: activeFilter === key ? '#0a0a0a' : '#999',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.25s',
            }}
          >
            {VN ? label : labelEN}
          </button>
        ))}
      </div>

      {/* ── Projects Grid ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {filtered.map((project) => {
            const title = VN ? project.title : project.titleEN;
            const desc = VN ? project.desc : project.descEN;
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                  <img
                    src={project.coverImage}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.7s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {/* Category badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: '#d2b06f',
                    color: '#0a0a0a',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    padding: '4px 12px',
                  }}>
                    {project.category}
                  </div>
                  {/* Gallery count */}
                  {project.galleryImages.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#d2b06f',
                      fontSize: '0.6rem',
                      letterSpacing: '0.15em',
                      fontFamily: 'Manrope, sans-serif',
                      padding: '4px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      📷 {project.galleryImages.length} {VN ? 'ảnh' : 'photos'}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                  >
                    <span style={{
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.6)',
                      padding: '10px 24px',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '0.7rem',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}>
                      {VN ? 'XEM DỰ ÁN' : 'VIEW PROJECT'}
                    </span>
                  </div>
                </div>

                {/* Text below */}
                <div style={{ padding: '20px 0 8px', borderBottom: '1px solid #1e1e1e' }}>
                  <h3 style={{
                    fontFamily: 'Noto Serif, serif',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}>
                    {title}
                  </h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.85rem',
                    lineHeight: 1.7,
                    fontFamily: 'Manrope, sans-serif',
                    marginBottom: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#d2b06f', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>
                      📍 {project.location}
                    </span>
                    <span style={{
                      color: '#d2b06f',
                      fontSize: '0.7rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      borderBottom: '1px solid #d2b06f44',
                      paddingBottom: '2px',
                    }}>
                      {VN ? 'XEM THÊM →' : 'VIEW MORE →'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            {VN ? 'Không có dự án nào.' : 'No projects found.'}
          </div>
        )}
      </div>
    </div>
  );
}
