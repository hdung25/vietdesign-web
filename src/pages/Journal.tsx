import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useProjectData, type JournalArticle } from '../contexts/ProjectDataContext';
import { useAdminMode } from '../contexts/AdminModeContext';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

/* ── Article Edit Modal ── */
function ArticleModal({ initial, onSave, onClose }: {
  initial?: JournalArticle;
  onSave: (a: JournalArticle) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? '');
  const [titleEN, setTitleEN] = useState(initial?.titleEN ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [categoryEN, setCategoryEN] = useState(initial?.categoryEN ?? '');
  const [date, setDate] = useState(initial?.date ?? new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }));
  const [image, setImage] = useState(initial?.image ?? '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [excerptEN, setExcerptEN] = useState(initial?.excerptEN ?? '');
  const imgRef = useRef<HTMLInputElement>(null);

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setImage(await toBase64(file)); e.target.value = '';
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { alert('Vui lòng nhập tiêu đề.'); return; }
    if (!window.confirm('Xác nhận lưu lại các thay đổi của bài viết này?')) return;
    onSave({ id: initial?.id ?? Date.now(), title: title.trim(), titleEN: titleEN || title, category: category || 'Chung', categoryEN: categoryEN || category || 'General', date, image, excerpt: excerpt.trim(), excerptEN: excerptEN || excerpt, content: initial?.content ?? '', contentEN: initial?.contentEN ?? '' });
    onClose();
  };

  const inp = { background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '4px 0 8px', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' as const };
  const lbl = { color: '#888', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontFamily: 'Manrope, sans-serif' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }} onClick={onClose}>
      <div style={{ background: '#1a1a1a', width: '100%', maxWidth: '680px', padding: '36px', borderTop: '2px solid #d2b06f' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'Noto Serif, serif', color: '#d2b06f', fontSize: '1.3rem', marginBottom: '28px' }}>
          {isEdit ? `✏ Sửa: ${initial!.title}` : '＋ Thêm Bài Viết Mới'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Tiêu Đề (VN) *</label><input style={inp} value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Tiêu Đề (EN)</label><input style={inp} value={titleEN} onChange={e => setTitleEN(e.target.value)} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Danh Mục (VN)</label><input style={inp} value={category} onChange={e => setCategory(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Danh Mục (EN)</label><input style={inp} value={categoryEN} onChange={e => setCategoryEN(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Ngày Đăng</label><input style={inp} value={date} onChange={e => setDate(e.target.value)} /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={lbl}>Ảnh Bìa</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {image && <img src={image} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover', border: '1px solid #4d4639', flexShrink: 0 }} />}
              <button type="button" onClick={() => imgRef.current?.click()} style={{ background: '#222', border: '1px dashed #4d4639', color: '#d2b06f', padding: '8px 16px', cursor: 'pointer', ...lbl }}>
                {image ? 'Đổi Ảnh' : 'Chọn Ảnh'}
              </button>
              <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Tóm Tắt (VN)</label><textarea rows={3} value={excerpt} onChange={e => setExcerpt(e.target.value)} style={{ ...inp, resize: 'vertical', border: '1px solid #4d4639', padding: '8px' }} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={lbl}>Tóm Tắt (EN)</label><textarea rows={3} value={excerptEN} onChange={e => setExcerptEN(e.target.value)} style={{ ...inp, resize: 'vertical', border: '1px solid #4d4639', padding: '8px' }} /></div>
          <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
            <button type="submit" style={{ flex: 1, background: '#d2b06f', color: '#000', padding: '13px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.72rem', border: 'none', cursor: 'pointer' }}>{isEdit ? 'Lưu Thay Đổi' : 'Thêm Bài Viết'}</button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #4d4639', color: '#999', padding: '13px', fontFamily: 'Manrope, sans-serif', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Journal() {
  const { lang } = useLang();
  const { articles, addArticle, updateArticle, deleteArticle } = useProjectData();
  const { isAdmin } = useAdminMode();
  const [editingArticle, setEditingArticle] = useState<JournalArticle | null>(null);
  const [addingArticle, setAddingArticle] = useState(false);
  const [saved, setSaved] = useState(false);
  const VN = lang === 'VN';

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleSave = (a: JournalArticle) => {
    if (articles.find(x => x.id === a.id)) updateArticle(a);
    else addArticle(a);
    flash();
  };
  const handleDelete = (a: JournalArticle) => {
    if (!confirm(`Xóa bài viết "${a.title}"?`)) return;
    deleteArticle(a.id); flash();
  };

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-10">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px', flexWrap: 'wrap', gap: '16px' }}>
          <div className="text-center" style={{ flex: 1 }}>
            <p className="text-[#d2b06f] font-medium tracking-[0.4em] uppercase text-2xl md:text-3xl mb-4">
              {VN ? 'Góc Nhìn & Cảm Hứng' : 'Perspectives & Inspiration'}
            </p>
            <h1 className="font-headline text-7xl md:text-8xl lg:text-9xl text-white tracking-tight">
              {VN ? 'TẠP CHÍ' : 'JOURNAL'}
            </h1>
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              {saved && <span style={{ color: '#4ade80', fontSize: '0.7rem', letterSpacing: '0.2em', fontFamily: 'Manrope, sans-serif' }}>✓ Đã lưu</span>}
              <button onClick={() => setAddingArticle(true)} style={{ background: '#d2b06f', color: '#000', border: 'none', padding: '12px 24px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add</span>
                Thêm Bài Viết
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {articles.map((article) => {
            const title = VN ? article.title : (article.titleEN || article.title);
            const cat = VN ? article.category : (article.categoryEN || article.category);
            const excerpt = VN ? article.excerpt : (article.excerptEN || article.excerpt);
            return (
              <article key={article.id} className="group" style={{ position: 'relative' }}>
                <Link to={`/journal/${article.id}`} className="block overflow-hidden aspect-[4/3] mb-6">
                  <img
                    src={article.image}
                    alt={title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#d2b06f] text-base tracking-widest uppercase">{cat}</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span className="text-on-surface-variant text-base tracking-[0.1em] uppercase">{article.date}</span>
                </div>
                <Link to={`/journal/${article.id}`}>
                  <h2 className="font-headline text-2xl md:text-3xl text-white mb-4 group-hover:text-[#d2b06f] transition-colors leading-snug">{title}</h2>
                </Link>
                <p className="text-on-surface-variant font-light text-xl leading-relaxed mb-6">{excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link to={`/journal/${article.id}`} className="text-[#d2b06f] tracking-widest uppercase text-base font-bold border-b border-[#d2b06f]/30 pb-1 hover:border-[#d2b06f] transition-all">
                    {VN ? 'Đọc Tiếp' : 'Read More'}
                  </Link>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setEditingArticle(article)} style={{ background: 'rgba(210,176,111,0.15)', border: '1px solid #d2b06f40', color: '#d2b06f', padding: '5px 12px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>edit</span> Sửa
                      </button>
                      <button onClick={() => handleDelete(article)} style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem' }}>🗑</button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {addingArticle && <ArticleModal onSave={handleSave} onClose={() => setAddingArticle(false)} />}
      {editingArticle && <ArticleModal initial={editingArticle} onSave={handleSave} onClose={() => setEditingArticle(null)} />}
    </div>
  );
}