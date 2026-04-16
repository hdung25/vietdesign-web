import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useProjectData, type ProjectData, type Category } from '../contexts/ProjectDataContext';
import { useAdminMode } from '../contexts/AdminModeContext';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

/* ── Project Edit Modal ── */
function ProjectModal({ initial, onSave, onClose }: {
  initial?: ProjectData;
  onSave: (p: ProjectData) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? '');
  const [titleEN, setTitleEN] = useState(initial?.titleEN ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'Villa');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [desc, setDesc] = useState(initial?.desc ?? '');
  const [descEN, setDescEN] = useState(initial?.descEN ?? '');
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '');
  const [galleryImages, setGalleryImages] = useState<string[]>(initial?.galleryImages ?? []);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  const handleCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setCoverImage(await toBase64(file)); e.target.value = '';
  };
  const handleGallery = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); if (!files.length) return;
    const b64s = await Promise.all(files.map(toBase64));
    setGalleryImages(prev => [...prev, ...b64s]); e.target.value = '';
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { alert('Vui lòng nhập tên dự án.'); return; }
    if (!location.trim()) { alert('Vui lòng nhập địa điểm.'); return; }
    if (!coverImage) { alert('Vui lòng chọn ảnh bìa.'); return; }
    setSaving(true);
    onSave({ id: initial?.id ?? Date.now(), title: title.trim(), titleEN: titleEN.trim() || title.trim(), category, location: location.trim(), desc: desc.trim(), descEN: descEN.trim() || desc.trim(), coverImage, galleryImages, custom: initial?.custom ?? true });
    onClose();
  };

  const inp = { background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '4px 0 8px', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' as const };
  const lbl = { color: '#888', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontFamily: 'Manrope, sans-serif' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }} onClick={onClose}>
      <div style={{ background: '#1a1a1a', width: '100%', maxWidth: '680px', padding: '36px', borderTop: '2px solid #d2b06f', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'Noto Serif, serif', color: '#d2b06f', fontSize: '1.3rem', marginBottom: '28px' }}>
          {isEdit ? `✏ Sửa: ${initial!.title}` : '＋ Thêm Dự Án Mới'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Tên (VN) *</label><input style={inp} value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Tên (EN)</label><input style={inp} value={titleEN} onChange={e => setTitleEN(e.target.value)} placeholder="Để trống nếu giống VN" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Địa Điểm *</label><input style={inp} value={location} onChange={e => setLocation(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={lbl}>Danh Mục</label>
              <select value={category} onChange={e => setCategory(e.target.value as Category)} style={{ ...inp, appearance: 'none' as const }}>
                <option value="Villa">Villa</option><option value="Căn Hộ">Căn Hộ</option><option value="Kiến Trúc">Kiến Trúc</option><option value="Nội Thất">Nội Thất</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Mô Tả (VN)</label><textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} style={{ ...inp, resize: 'vertical', border: '1px solid #4d4639', padding: '8px' }} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Mô Tả (EN)</label><textarea rows={3} value={descEN} onChange={e => setDescEN(e.target.value)} style={{ ...inp, resize: 'vertical', border: '1px solid #4d4639', padding: '8px' }} /></div>

          {/* Cover */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={lbl}>Ảnh Bìa *</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div onClick={() => coverRef.current?.click()} style={{ width: '140px', height: '100px', background: '#222', border: '1px dashed #4d4639', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {coverImage ? <img src={coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ ...lbl, fontSize: '0.6rem' }}>Chọn Ảnh</span>}
                <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCover} />
              </div>
              {coverImage && <button type="button" onClick={() => setCoverImage('')} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', ...lbl }}>Xóa</button>}
            </div>
          </div>

          {/* Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={lbl}>Ảnh Gallery ({galleryImages.length} ảnh)</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {galleryImages.map((src, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '60px', overflow: 'hidden', border: '1px solid #4d4639' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setGalleryImages(g => g.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: 1, right: 1, background: 'rgba(0,0,0,0.8)', border: 'none', color: '#f87171', cursor: 'pointer', padding: '1px 4px', fontSize: '0.6rem' }}>✕</button>
                </div>
              ))}
              <div onClick={() => galleryRef.current?.click()} style={{ width: '80px', height: '60px', background: '#222', border: '1px dashed #4d4639', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#4d4639', fontSize: '22px' }}>add_photo_alternate</span>
                <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGallery} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
            <button type="submit" disabled={saving} style={{ flex: 1, background: '#d2b06f', color: '#000', padding: '13px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.72rem', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Lưu Thay Đổi' : 'Thêm Dự Án')}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #4d4639', color: '#999', padding: '13px', fontFamily: 'Manrope, sans-serif', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const { t, lang } = useLang();
  const { projects, addProject, updateProject, deleteProject } = useProjectData();
  const { isAdmin } = useAdminMode();
  const [activeFilter, setActiveFilter] = useState<'all' | Category>('all');
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [addingProject, setAddingProject] = useState(false);
  const [saved, setSaved] = useState(false);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleSave = (p: ProjectData) => {
    if (projects.find(x => x.id === p.id)) updateProject(p);
    else addProject(p);
    flash();
  };
  const handleDelete = (p: ProjectData) => {
    if (!p.custom) { alert('Không thể xóa dự án mặc định.'); return; }
    if (!confirm(`Xóa dự án "${p.title}"?`)) return;
    deleteProject(p.id); flash();
  };

  const filters: Array<{ key: 'all' | Category; label: string; labelEN: string }> = [
    { key: 'all', label: 'Tất Cả', labelEN: 'All' },
    { key: 'Villa', label: 'Villa', labelEN: 'Villa' },
    { key: 'Căn Hộ', label: 'Căn Hộ', labelEN: 'Apartment' },
    { key: 'Kiến Trúc', label: 'Kiến Trúc', labelEN: 'Architecture' },
    { key: 'Nội Thất', label: 'Nội Thất', labelEN: 'Interior' },
  ];
  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);
  const VN = lang === 'VN';

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div style={{ position: 'relative', height: '60vh', minHeight: '400px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1920&q=85&fit=crop" alt="Projects" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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

      {/* ── Filter bar + Admin add button ── */}
      <div style={{ background: '#111', borderBottom: '1px solid #d2b06f22', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', position: 'sticky', top: '80px', zIndex: 40 }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {filters.map(({ key, label, labelEN }) => (
            <button key={key} onClick={() => setActiveFilter(key)} style={{ padding: '10px 24px', fontFamily: 'Manrope, sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: activeFilter === key ? '1px solid #d2b06f' : '1px solid #333', background: activeFilter === key ? '#d2b06f' : 'transparent', color: activeFilter === key ? '#0a0a0a' : '#999', cursor: 'pointer', fontWeight: 600, transition: 'all 0.25s' }}>
              {VN ? label : labelEN}
            </button>
          ))}
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {saved && <span style={{ color: '#4ade80', fontSize: '0.7rem', letterSpacing: '0.2em', fontFamily: 'Manrope, sans-serif' }}>✓ Đã lưu</span>}
            <button onClick={() => setAddingProject(true)} style={{ background: '#d2b06f', color: '#000', border: 'none', padding: '10px 22px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add</span>
              Thêm Dự Án
            </button>
          </div>
        )}
      </div>

      {/* ── Projects Grid ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {filtered.map((project) => {
            const title = VN ? project.title : project.titleEN;
            const desc = VN ? project.desc : project.descEN;
            return (
              <div key={project.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img src={project.coverImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.7s ease' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#d2b06f', color: '#0a0a0a', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', fontWeight: 700, padding: '4px 12px' }}>{project.category}</div>
                    {project.galleryImages.length > 0 && <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', color: '#d2b06f', fontSize: '0.6rem', letterSpacing: '0.15em', fontFamily: 'Manrope, sans-serif', padding: '4px 10px' }}>📷 {project.galleryImages.length} {VN ? 'ảnh' : 'photos'}</div>}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                      <span style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.6)', padding: '10px 24px', fontFamily: 'Manrope, sans-serif', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>{VN ? 'XEM DỰ ÁN' : 'VIEW PROJECT'}</span>
                    </div>
                  </div>
                  <div style={{ padding: '20px 0 8px', borderBottom: '1px solid #1e1e1e' }}>
                    <h3 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>{title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7, fontFamily: 'Manrope, sans-serif', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#d2b06f', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>📍 {project.location}</span>
                      <span style={{ color: '#d2b06f', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', fontWeight: 700, borderBottom: '1px solid #d2b06f44', paddingBottom: '2px' }}>{VN ? 'XEM THÊM →' : 'VIEW MORE →'}</span>
                    </div>
                  </div>
                </Link>

                {/* Admin action buttons */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <button onClick={() => setEditingProject(project)} style={{ flex: 1, background: '#d2b06f', border: 'none', color: '#000', padding: '8px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>edit</span> Sửa
                    </button>
                    {project.custom && (
                      <button onClick={() => handleDelete(project)} style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '8px 14px', cursor: 'pointer', fontSize: '0.75rem' }}>🗑</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            {VN ? 'Không có dự án nào.' : 'No projects found.'}
          </div>
        )}
      </div>

      {addingProject && <ProjectModal onSave={handleSave} onClose={() => setAddingProject(false)} />}
      {editingProject && <ProjectModal initial={editingProject} onSave={handleSave} onClose={() => setEditingProject(null)} />}
    </div>
  );
}