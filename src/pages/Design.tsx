import { useState, useRef, useEffect, useCallback } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useAdminMode } from '../contexts/AdminModeContext';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { uploadImageIfBase64 } from '../contexts/ProjectDataContext';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

const DEFAULT_IMAGES = ['/banve1.jpg', '/banve2.jpg', '/banve3.jpg', '/download.jpg'];

/* ── Lightbox Component ── */
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(210,176,111,0.15)',
          border: '1px solid #d2b06f60',
          color: '#d2b06f',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: 10000,
        }}
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Counter */}
      <div
        style={{
          position: 'absolute',
          top: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#d2b06f80',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
        }}
      >
        {index + 1} / {images.length}
      </div>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(210,176,111,0.15)',
            border: '1px solid #d2b06f40',
            color: '#d2b06f',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      )}

      {/* Image */}
      <div
        style={{ maxWidth: '92vw', maxHeight: '88vh', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`Bản vẽ ${index + 1}`}
          style={{
            maxWidth: '92vw',
            maxHeight: '88vh',
            objectFit: 'contain',
            display: 'block',
            boxShadow: '0 0 80px rgba(0,0,0,0.8)',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80&fit=crop';
          }}
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(210,176,111,0.15)',
            border: '1px solid #d2b06f40',
            color: '#d2b06f',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      )}
    </div>
  );
}

export default function Design() {
  const { lang } = useLang();
  const { isAdmin } = useAdminMode();
  const VN = lang === 'VN';

  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [saving, setSaving] = useState(false);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Admin edit header
  const [editingHeader, setEditingHeader] = useState(false);
  const [title, setTitle] = useState('BẢN VẼ THIẾT KẾ');
  const [desc, setDesc] = useState(
    VN
      ? 'Bộ sưu tập các bản thiết kế kiến trúc và nội thất, thể hiện sự tinh chỉnh trong từng đường nét vẽ và tư duy tổ chức không gian.'
      : 'A collection of architectural and interior design drawings, reflecting refinement in every drawn line and spatial thinking.'
  );
  const [localTitle, setLocalTitle] = useState('');
  const [localDesc, setLocalDesc] = useState('');

  // Admin image upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Load from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'design'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.images) setImages(d.images);
        if (d.title) setTitle(d.title);
        if (d.desc) setDesc(d.desc);
      }
    });
    return () => unsub();
  }, []);

  // Save to Firestore
  const saveToFirestore = async (data: { images?: string[]; title?: string; desc?: string }) => {
    await setDoc(doc(db, 'settings', 'design'), data, { merge: true });
  };

  // Lightbox handlers
  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length]
  );
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length]
  );

  // Admin header
  const openHeaderEdit = () => {
    setLocalTitle(title);
    setLocalDesc(desc);
    setEditingHeader(true);
  };
  const saveHeader = async () => {
    setSaving(true);
    setTitle(localTitle);
    setDesc(localDesc);
    await saveToFirestore({ title: localTitle, desc: localDesc });
    setSaving(false);
    setEditingHeader(false);
  };

  // Admin image upload
  const triggerUpload = (idx: number) => {
    setActiveIdx(idx);
    fileRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeIdx === null) return;
    setUploading(true);
    const b64 = await toBase64(file);
    const compressed = await uploadImageIfBase64(b64, `design/image_${activeIdx}_${Date.now()}`);
    const newImages = [...images];
    newImages[activeIdx] = compressed;
    setImages(newImages);
    await saveToFirestore({ images: newImages });
    setUploading(false);
    setActiveIdx(null);
    e.target.value = '';
  };

  return (
    <>
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <section
        className="bg-[#0a0a0a] min-h-screen"
        style={{ paddingTop: isAdmin ? '120px' : '100px', paddingBottom: '80px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

          {/* Header */}
          <div className="text-center mb-10 md:mb-16">
            <div className="text-[#d2b06f] text-xs tracking-[0.3em] uppercase mb-4 font-semibold">
              VIETDESIGN
            </div>
            <h1
              className="font-headline text-4xl sm:text-5xl md:text-7xl text-[#d2b06f] mb-6 uppercase tracking-widest"
              style={{ lineHeight: 1.1 }}
            >
              {title}
            </h1>
            <div className="h-0.5 bg-[#d2b06f] w-16 mx-auto mb-6" />
            <p className="text-white/60 max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-light">
              {desc}
            </p>

            {/* Admin edit header */}
            {isAdmin && !editingHeader && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={openHeaderEdit}
                  style={{
                    background: 'transparent',
                    color: '#d2b06f',
                    border: '1px solid #d2b06f50',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.62rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '2px',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                  Sửa Nội Dung
                </button>
              </div>
            )}

            {isAdmin && editingHeader && (
              <div className="mt-8 mx-auto max-w-2xl bg-[#131313] border border-[#d2b06f]/30 p-6 text-left">
                <div className="mb-4">
                  <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Tiêu đề</label>
                  <input
                    value={localTitle}
                    onChange={e => setLocalTitle(e.target.value)}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '6px 0', outline: 'none', fontFamily: 'Noto Serif, serif', fontSize: '1.2rem', width: '100%' }}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Mô tả</label>
                  <textarea
                    value={localDesc}
                    onChange={e => setLocalDesc(e.target.value)}
                    rows={3}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '6px 0', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', width: '100%', resize: 'none' }}
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={saveHeader}
                    disabled={saving}
                    style={{ background: '#d2b06f', color: '#000', border: 'none', padding: '10px 24px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: saving ? 0.7 : 1 }}
                  >
                    {saving ? 'Đang lưu...' : 'Xác Nhận Lưu'}
                  </button>
                  <button
                    onClick={() => setEditingHeader(false)}
                    style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '10px 24px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Image Grid */}
          {uploading && (
            <div className="text-center mb-6">
              <span style={{ color: '#d2b06f', fontFamily: 'Manrope, sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                ⏳ Đang tải ảnh lên...
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group overflow-hidden bg-[#111] border border-white/5"
                style={{ aspectRatio: '4/3', cursor: 'pointer' }}
              >
                {/* Image - clickable for lightbox */}
                <img
                  src={img}
                  alt={`Bản vẽ thiết kế ${idx + 1}`}
                  onClick={() => openLightbox(idx)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s ease',
                  }}
                  className="group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&fit=crop';
                  }}
                />

                {/* Hover overlay – phóng to */}
                <div
                  onClick={() => openLightbox(idx)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                  className="group-hover:opacity-100"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: '#d2b06f', fontSize: '32px' }}
                  >
                    zoom_in
                  </span>
                  <span
                    style={{
                      color: '#d2b06f',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '0.65rem',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      border: '1px solid #d2b06f50',
                      padding: '6px 16px',
                    }}
                  >
                    Phóng To
                  </span>
                </div>

                {/* Mobile tap hint */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.65)',
                    color: '#d2b06f',
                    padding: '4px 10px',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '2px',
                    pointerEvents: 'none',
                  }}
                  className="sm:hidden"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>zoom_in</span>
                  Xem
                </div>

                {/* Admin: replace image button */}
                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); triggerUpload(idx); }}
                    disabled={uploading}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(210,176,111,0.92)',
                      color: '#000',
                      border: 'none',
                      padding: '6px 12px',
                      cursor: uploading ? 'wait' : 'pointer',
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.6rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 30,
                      borderRadius: '2px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      opacity: uploading && activeIdx === idx ? 0.6 : 1,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
                      {uploading && activeIdx === idx ? 'hourglass_empty' : 'image'}
                    </span>
                    {uploading && activeIdx === idx ? 'Đang tải...' : 'Thay Ảnh'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Bottom label */}
          <div className="text-center mt-12">
            <p className="text-white/30 text-xs tracking-[0.25em] uppercase font-light">
              {VN ? 'Nhấn vào ảnh để phóng to' : 'Click image to zoom in'}
            </p>
          </div>

        </div>
      </section>

      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
    </>
  );
}
