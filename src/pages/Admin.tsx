import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useProjectData, type ProjectData, type Category } from '../contexts/ProjectDataContext';

const ADMIN_PASSWORD = 'vietdesign2024';

// ── Helpers ───────────────────────────────────────────────────────────────────
function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) onLogin();
    else { setError('Mật khẩu không đúng. Vui lòng thử lại.'); setPw(''); }
  };
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Noto Serif, serif', fontSize: '2rem', color: '#d2b06f', letterSpacing: '0.2em', marginBottom: '8px' }}>VIETDESIGN</h1>
          <p style={{ color: '#999', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Manrope, sans-serif' }}>Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} style={{ background: '#1f1f1f', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#999', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>Mật Khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', paddingBottom: '8px', color: '#fff', fontSize: '1.2rem', outline: 'none', fontFamily: 'Manrope, sans-serif', boxSizing: 'border-box' }}
                autoFocus
              />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: 0, bottom: '8px', background: 'none', border: 'none', color: '#777', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                  {show ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {error && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</span>}
          </div>
          <button type="submit"
            style={{ background: '#d2b06f', color: '#000', padding: '16px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Nav pages ─────────────────────────────────────────────────────────────────
type AdminPage = 'home' | 'services' | 'projects' | 'about' | 'journal' | 'contact';

const NAV_ITEMS: { key: AdminPage; label: string }[] = [
  { key: 'home', label: 'Trang Chủ' },
  { key: 'services', label: 'Dịch Vụ' },
  { key: 'projects', label: 'Dự Án' },
  { key: 'about', label: 'Về Chúng Tôi' },
  { key: 'journal', label: 'Tạp Chí' },
  { key: 'contact', label: 'Liên Hệ' },
];

// ── Project Modal ─────────────────────────────────────────────────────────────
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
  const [coverImage, setCoverImage] = useState<string>(initial?.coverImage ?? '');
  const [galleryImages, setGalleryImages] = useState<string[]>(initial?.galleryImages ?? []);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setCoverImage(await toBase64(file)); e.target.value = '';
  };
  const handleGallery = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); if (!files.length) return;
    const b64s = await Promise.all(files.map(toBase64));
    setGalleryImages(prev => [...prev, ...b64s]); e.target.value = '';
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { alert('Vui lòng nhập tên dự án.'); return; }
    if (!location.trim()) { alert('Vui lòng nhập địa điểm.'); return; }
    if (!coverImage) { alert('Vui lòng chọn ảnh bìa.'); return; }
    onSave({
      id: initial?.id ?? Date.now(),
      title: title.trim(), titleEN: titleEN.trim() || title.trim(),
      category, location: location.trim(),
      desc: desc.trim(), descEN: descEN.trim() || desc.trim(),
      coverImage, galleryImages, custom: initial?.custom ?? true,
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}
      onClick={onClose}>
      <div style={{ background: '#1a1a1a', width: '100%', maxWidth: '680px', padding: '36px', borderTop: '2px solid #d2b06f' }}
        onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'Noto Serif, serif', color: '#d2b06f', fontSize: '1.4rem', marginBottom: '28px' }}>
          {isEdit ? `Chỉnh Sửa: ${initial!.title}` : 'Thêm Dự Án Mới'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FField label="Tên (VN) *"><FInput value={title} onChange={setTitle} /></FField>
            <FField label="Tên (EN)"><FInput value={titleEN} onChange={setTitleEN} placeholder="Để trống nếu giống VN" /></FField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FField label="Địa Điểm *"><FInput value={location} onChange={setLocation} /></FField>
            <FField label="Danh Mục">
              <select value={category} onChange={e => setCategory(e.target.value as Category)}
                style={{ background: '#222', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '4px 0 8px', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', appearance: 'none', width: '100%' }}>
                <option value="Villa">Villa</option>
                <option value="Căn Hộ">Căn Hộ</option>
                <option value="Kiến Trúc">Kiến Trúc</option>
                <option value="Nội Thất">Nội Thất</option>
              </select>
            </FField>
          </div>
          <FField label="Mô Tả (VN)">
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
              style={{ background: 'transparent', border: '1px solid #4d4639', color: '#fff', padding: '8px', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', resize: 'vertical', width: '100%', boxSizing: 'border-box' }} />
          </FField>
          <FField label="Mô Tả (EN)">
            <textarea value={descEN} onChange={e => setDescEN(e.target.value)} rows={3}
              style={{ background: 'transparent', border: '1px solid #4d4639', color: '#fff', padding: '8px', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', resize: 'vertical', width: '100%', boxSizing: 'border-box' }} />
          </FField>

          {/* Cover */}
          <FField label="Ảnh Bìa *">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div onClick={() => coverRef.current?.click()}
                style={{ width: '140px', height: '100px', background: '#222', border: '1px dashed #4d4639', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {coverImage
                  ? <img src={coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', padding: '4px' }}>Chọn Ảnh</span>}
                <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCover} />
              </div>
              {coverImage && (
                <button type="button" onClick={() => setCoverImage('')}
                  style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', marginTop: '4px' }}>
                  Xóa
                </button>
              )}
            </div>
          </FField>

          {/* Gallery */}
          <FField label={`Ảnh Gallery (${galleryImages.length} ảnh) — User xem trong trang chi tiết`}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {galleryImages.map((src, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '60px', overflow: 'hidden', border: '1px solid #4d4639' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                    style={{ position: 'absolute', top: 1, right: 1, background: 'rgba(0,0,0,0.8)', border: 'none', color: '#f87171', cursor: 'pointer', padding: '1px 4px', fontSize: '0.6rem', lineHeight: 1 }}>✕</button>
                </div>
              ))}
              <div onClick={() => galleryRef.current?.click()}
                style={{ width: '80px', height: '60px', background: '#222', border: '1px dashed #4d4639', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#4d4639', fontSize: '22px', fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24" }}>add_photo_alternate</span>
                <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGallery} />
              </div>
            </div>
          </FField>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="submit"
              style={{ flex: 1, background: '#d2b06f', color: '#000', padding: '13px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.72rem', border: 'none', cursor: 'pointer' }}>
              {isEdit ? 'Lưu Thay Đổi' : 'Thêm Dự Án'}
            </button>
            <button type="button" onClick={onClose}
              style={{ flex: 1, background: 'transparent', border: '1px solid #4d4639', color: '#999', padding: '13px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.72rem', cursor: 'pointer' }}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>{label}</label>
      {children}
    </div>
  );
}
function FInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '4px 0 8px', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }} />
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE PANELS
// ═══════════════════════════════════════════════════════════

// ── Home Panel ────────────────────────────────────────────
function HomePanel({ flash }: { flash: () => void }) {
  const { heroImage, heroTitle, heroSubtitle, setHeroImage, setHeroTitle, setHeroSubtitle } = useProjectData();
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setHeroImage(await toBase64(file)); flash(); e.target.value = '';
  };
  return (
    <div>
      <SectionTitle icon="home" title="Trang Chủ" desc="Chỉnh sửa ảnh nền, tiêu đề lớn và phụ đề của trang chủ. Thay đổi sẽ hiển thị ngay cho khách hàng." />

      {/* Hero preview */}
      <div style={{ position: 'relative', height: '320px', overflow: 'hidden', marginBottom: '28px', border: '1px solid #2a2a2a' }}>
        <img
          src={heroImage || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80&fit=crop'}
          alt="hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.65))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <p style={{ color: '#d2b06f', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '10px', fontSize: '0.85rem', fontFamily: 'Manrope, sans-serif' }}>{heroSubtitle}</p>
          <h2 style={{ fontFamily: 'Noto Serif, serif', fontSize: '3rem', color: '#fff', fontWeight: 300 }}>{heroTitle}</h2>
        </div>
        {/* Upload button centered */}
        <button onClick={() => fileRef.current?.click()}
          style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(210,176,111,0.9)', color: '#000', border: 'none', padding: '8px 18px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>upload</span>
          Thay Ảnh Nền
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>

      {/* Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '640px' }}>
        <PField label="Tiêu Đề Lớn">
          <PInput value={heroTitle} onChange={v => { setHeroTitle(v); flash(); }} />
        </PField>
        <PField label="Phụ Đề">
          <PInput value={heroSubtitle} onChange={v => { setHeroSubtitle(v); flash(); }} />
        </PField>
      </div>
      {heroImage && (
        <button onClick={() => { setHeroImage(null); flash(); }}
          style={{ marginTop: '14px', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>
          Xóa Ảnh Nền (dùng mặc định)
        </button>
      )}

      <InfoBox>
        <b>Tip:</b> Ảnh nền tốt nhất nên có tỉ lệ 16:9, kích thước &ge; 1920×1080px, dung lượng &lt; 3MB.
      </InfoBox>
    </div>
  );
}

// ── Projects Panel ────────────────────────────────────────
function ProjectsPanel({ flash }: { flash: () => void }) {
  const { projects, addProject, updateProject, deleteProject } = useProjectData();
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [addingProject, setAddingProject] = useState(false);
  const [previewProject, setPreviewProject] = useState<ProjectData | null>(null);

  const handleSave = (p: ProjectData) => {
    if (projects.find(x => x.id === p.id)) updateProject(p);
    else addProject(p);
    flash();
  };
  const handleDelete = (p: ProjectData) => {
    if (!p.custom) { alert('Không thể xóa dự án mặc định. Chỉ có thể chỉnh sửa.'); return; }
    if (!confirm(`Xóa dự án "${p.title}"?`)) return;
    deleteProject(p.id); flash();
  };

  return (
    <div>
      <SectionTitle icon="apartment" title="Dự Án" desc="Quản lý toàn bộ dự án hiển thị trên website. Thêm ảnh gallery để khách hàng xem chi tiết như thaicong.com." />

      {/* Legend + Add button header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: '#888', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Manrope, sans-serif' }}>
            <span style={{ width: '8px', height: '8px', background: '#d2b06f', borderRadius: '50%', display: 'inline-block' }} /> Mặc định (chỉ sửa)
          </span>
          <span style={{ color: '#888', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Manrope, sans-serif' }}>
            <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} /> Admin tạo (sửa + xóa)
          </span>
        </div>
        <button onClick={() => setAddingProject(true)}
          style={{ background: '#d2b06f', color: '#000', border: 'none', padding: '10px 22px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add</span>
          Thêm Dự Án
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
        {projects.map(proj => (
          <div key={proj.id} style={{ background: '#161616', border: '1px solid #242424', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '160px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={proj.coverImage} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', background: proj.custom ? '#4ade80' : '#d2b06f', color: '#000', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '2px 8px', fontFamily: 'Manrope, sans-serif' }}>
                {proj.custom ? 'custom' : 'default'}
              </div>
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#d2b06f', fontSize: '0.58rem', letterSpacing: '0.12em', padding: '2px 8px', fontFamily: 'Manrope, sans-serif' }}>
                📷 {proj.galleryImages.length}
              </div>
            </div>
            <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{proj.title}</h3>
              <p style={{ color: '#d2b06f', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
                {proj.category} — {proj.location}
              </p>
              <p style={{ color: '#555', fontSize: '0.75rem', lineHeight: '1.5', fontFamily: 'Manrope, sans-serif', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {proj.desc || '(Chưa có mô tả)'}
              </p>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid #242424', display: 'flex', gap: '6px' }}>
              <button onClick={() => setPreviewProject(proj)}
                style={{ flex: 1, background: 'transparent', border: '1px solid #333', color: '#888', padding: '7px', fontFamily: 'Manrope, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
                👁 Xem
              </button>
              <button onClick={() => setEditingProject(proj)}
                style={{ flex: 1, background: '#d2b06f', border: 'none', color: '#000', padding: '7px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
                ✏ Sửa
              </button>
              {proj.custom && (
                <button onClick={() => handleDelete(proj)}
                  style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '7px 10px', cursor: 'pointer', fontSize: '0.75rem' }}>
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {addingProject && <ProjectModal onSave={handleSave} onClose={() => setAddingProject(false)} />}
      {editingProject && <ProjectModal initial={editingProject} onSave={handleSave} onClose={() => setEditingProject(null)} />}
      {previewProject && <ProjectPreviewModal project={previewProject} onClose={() => setPreviewProject(null)} />}
    </div>
  );
}

// ── Project Preview Modal ─────────────────────────────────
function ProjectPreviewModal({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 600, overflowY: 'auto' }}
      onClick={onClose}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p style={{ color: '#d2b06f', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', margin: '0 0 4px' }}>{project.category} — {project.location}</p>
            <h2 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontSize: '1.7rem', fontWeight: 300, margin: 0 }}>{project.title}</h2>
          </div>
          <button onClick={onClose}
            style={{ background: 'none', border: '1px solid #444', color: '#888', padding: '7px 14px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>close</span> Đóng
          </button>
        </div>
        <img src={project.coverImage} alt={project.title} style={{ width: '100%', display: 'block', objectFit: 'cover', marginBottom: '20px' }} />
        {project.desc && <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif', lineHeight: '1.8', fontSize: '0.95rem', marginBottom: '28px' }}>{project.desc}</p>}
        {project.galleryImages.length > 0 ? (
          <>
            <p style={{ color: '#d2b06f', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', marginBottom: '12px' }}>Gallery ({project.galleryImages.length} ảnh)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {project.galleryImages.map((src, idx) => (
                <img key={idx} src={src} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ background: '#1a1a1a', border: '1px dashed #333', padding: '32px', textAlign: 'center', color: '#444', fontSize: '0.78rem', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Chưa có ảnh gallery. Nhấn "Sửa" để thêm ảnh.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Simple placeholder panels ─────────────────────────────
function ServicesPanel() {
  return (
    <div>
      <SectionTitle icon="design_services" title="Dịch Vụ" desc="Nội dung trang Dịch Vụ. Tính năng chỉnh sửa sẽ được cập nhật trong phiên bản tiếp theo." />
      <InfoBox>Trang Dịch Vụ hiển thị các gói dịch vụ Kiến Trúc và Nội Thất của VIETDESIGN. Liên hệ nhóm phát triển để thêm tính năng chỉnh sửa cho trang này.</InfoBox>
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
        {['Kiến Trúc Cao Cấp', 'Nội Thất Sang Trọng', 'Tư Vấn Thiết Kế', 'Giám Sát Thi Công'].map(s => (
          <div key={s} style={{ background: '#161616', border: '1px solid #242424', padding: '20px', borderLeft: '3px solid #d2b06f' }}>
            <p style={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 600, margin: '0 0 4px', fontSize: '0.9rem' }}>{s}</p>
            <p style={{ color: '#555', fontSize: '0.78rem', fontFamily: 'Manrope, sans-serif', margin: 0 }}>Đang hiển thị</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div>
      <SectionTitle icon="info" title="Về Chúng Tôi" desc="Thông tin giới thiệu công ty VIETDESIGN." />
      <InfoBox>Trang Về Chúng Tôi hiển thị lịch sử hình thành, sứ mệnh, và đội ngũ của VIETDESIGN. Liên hệ nhóm phát triển để chỉnh sửa nội dung trang này.</InfoBox>
    </div>
  );
}

function JournalPanel() {
  return (
    <div>
      <SectionTitle icon="article" title="Tạp Chí" desc="Bài viết, tin tức và kiến thức nội thất." />
      <InfoBox>Trang Tạp Chí sẽ hỗ trợ thêm bài viết trong phiên bản tiếp theo.</InfoBox>
    </div>
  );
}

function ContactPanel() {
  return (
    <div>
      <SectionTitle icon="contact_phone" title="Liên Hệ" desc="Thông tin liên hệ và form tư vấn." />
      <InfoBox>Trang Liên Hệ hiển thị thông tin văn phòng và form đặt lịch tư vấn. Liên hệ nhóm phát triển để cập nhật địa chỉ hoặc số điện thoại.</InfoBox>
      <div style={{ marginTop: '20px', maxWidth: '480px' }}>
        {[
          { icon: 'phone', label: 'Hotline', value: '+84 989 942 555 / +84 908 666 622' },
          { icon: 'mail', label: 'Email', value: 'cskh.vietdesign@gmail.com' },
          { icon: 'location_on', label: 'Địa Chỉ', value: 'C37 Bắc Hà Tower, Tố Hữu, Hà Đông, Hà Nội' },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #1e1e1e' }}>
            <span className="material-symbols-outlined" style={{ color: '#d2b06f', fontSize: '20px', flexShrink: 0, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>{icon}</span>
            <div>
              <p style={{ color: '#888', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', margin: '0 0 3px' }}>{label}</p>
              <p style={{ color: '#ddd', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', margin: 0 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared small components ───────────────────────────────
function SectionTitle({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #1e1e1e' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span className="material-symbols-outlined" style={{ color: '#d2b06f', fontSize: '24px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>{icon}</span>
        <h2 style={{ fontFamily: 'Noto Serif, serif', color: '#d2b06f', fontSize: '1.5rem', margin: 0 }}>{title}</h2>
      </div>
      <p style={{ color: '#666', fontFamily: 'Manrope, sans-serif', fontSize: '0.82rem', margin: 0, maxWidth: '640px', lineHeight: '1.6' }}>{desc}</p>
    </div>
  );
}

function PField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>{label}</label>
      {children}
    </div>
  );
}
function PInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)}
      style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '4px 0 8px', outline: 'none', fontFamily: 'Noto Serif, serif', fontSize: '1.05rem', width: '100%', boxSizing: 'border-box' }} />
  );
}
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#161616', border: '1px solid #d2b06f33', borderLeft: '3px solid #d2b06f', padding: '14px 18px', marginTop: '20px', maxWidth: '680px' }}>
      <p style={{ color: '#aaa', fontFamily: 'Manrope, sans-serif', fontSize: '0.82rem', lineHeight: '1.7', margin: 0 }}>{children}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN DASHBOARD – uses website nav layout
// ═══════════════════════════════════════════════════════════
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activePage, setActivePage] = useState<AdminPage>('home');
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  // Indicator dot (illuminated active nav item)
  const navItemStyle = (key: AdminPage): React.CSSProperties => ({
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Manrope, sans-serif',
    fontSize: '0.88rem',
    letterSpacing: '0.04em',
    color: activePage === key ? '#d2b06f' : '#d0c5b5',
    padding: '4px 0',
    transition: 'color 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Manrope, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* ══ Header (giống website) ══ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#131313',
        borderBottom: '2px solid #d2b06f',
        padding: '0 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        height: '72px',
      }}>
        {/* Left: menu icon + logo + admin badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span className="material-symbols-outlined" style={{ color: '#d2b06f', fontSize: '24px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>menu</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="VIETDESIGN" style={{ height: '40px', width: 'auto', objectFit: 'contain', borderRadius: '50%' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <span style={{ fontFamily: 'Noto Serif, serif', fontSize: '1.15rem', color: '#d2b06f', letterSpacing: '0.2em', fontWeight: 300 }}>VIETDESIGN</span>
          </div>
          <span style={{ background: '#d2b06f', color: '#000', padding: '3px 10px', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', marginLeft: '4px' }}>
            ADMIN
          </span>
        </div>

        {/* Center: nav giống website */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {NAV_ITEMS.map(({ key, label }) => (
            <button key={key} onClick={() => setActivePage(key)} style={navItemStyle(key)}>
              {label}
              {/* Active indicator – glowing gold dot below item */}
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: activePage === key ? '#d2b06f' : 'transparent',
                boxShadow: activePage === key ? '0 0 6px 2px rgba(210,176,111,0.7)' : 'none',
                transition: 'all 0.3s',
                display: 'block',
              }} />
            </button>
          ))}
        </nav>

        {/* Right: saved flash + view site + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {saved && (
            <span style={{ color: '#4ade80', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>check_circle</span> Đã lưu
            </span>
          )}
          {/* VN|EN style (static, cosmetic) */}
          <span style={{ fontFamily: 'Noto Serif, serif', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            <span style={{ color: '#fff' }}>VN</span>
            <span style={{ color: '#d2b06f44', margin: '0 3px' }}>|</span>
            <span style={{ color: '#d2b06f55' }}>EN</span>
          </span>
          <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Xem Trang Web</a>
          <button onClick={onLogout}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>logout</span>
            Đăng Xuất
          </button>
        </div>
      </header>

      {/* ══ Page content ══ */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '36px 40px' }}>
        {activePage === 'home' && <HomePanel flash={flash} />}
        {activePage === 'services' && <ServicesPanel />}
        {activePage === 'projects' && <ProjectsPanel flash={flash} />}
        {activePage === 'about' && <AboutPanel />}
        {activePage === 'journal' && <JournalPanel />}
        {activePage === 'contact' && <ContactPanel />}
      </main>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(
    () => sessionStorage.getItem('vd_admin_auth') === '1'
  );
  const handleLogin = () => { sessionStorage.setItem('vd_admin_auth', '1'); setLoggedIn(true); };
  const handleLogout = () => { sessionStorage.removeItem('vd_admin_auth'); setLoggedIn(false); };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
