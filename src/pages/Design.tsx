import { useState, useRef } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useAdminMode } from '../contexts/AdminModeContext';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function EditBtn({ onClick, label = 'Chỉnh Sửa', top = '12px', right = '12px' }: { onClick: () => void; label?: string; top?: string; right?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top,
        right,
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

export default function Design() {
  const { lang } = useLang();
  const { isAdmin } = useAdminMode();
  const VN = lang === 'VN';

  // State cục bộ cho thiết kế (trong mô hình thực tế sẽ lưu database)
  const [title, setTitle] = useState(VN ? 'Bản Vẽ Thiết Kế' : 'Design Drawings');
  const [desc, setDesc] = useState(VN ? 'Bộ sưu tập các bản thiết kế kiến trúc và nội thất, thể hiện sự tinh chỉnh trong từng đường nét vẽ và tư duy tổ chức không gian.' : 'A collection of architectural and interior design drawings, reflecting the refinement in every drawn line and spatial mindset.');
  
  const [images, setImages] = useState([
    '/banve1.jpg',
    '/banve2.jpg',
    '/banve3.jpg',
    '/download.jpg'
  ]);

  const [editingHeader, setEditingHeader] = useState(false);
  const [localTitle, setLocalTitle] = useState('');
  const [localDesc, setLocalDesc] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const openHeaderEdit = () => {
    setLocalTitle(title);
    setLocalDesc(desc);
    setEditingHeader(true);
  };

  const saveHeader = () => {
    setTitle(localTitle);
    setDesc(localDesc);
    setEditingHeader(false);
  };

  const triggerImageUpload = (index: number) => {
    setActiveImageIndex(index);
    fileRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeImageIndex === null) return;
    const b64 = await toBase64(file);
    setImages(prev => {
      const nw = [...prev];
      nw[activeImageIndex] = b64;
      return nw;
    });
    e.target.value = '';
    setActiveImageIndex(null);
  };

  return (
    <>
      <section className="pt-40 pb-20 px-6 md:px-10 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-7xl mx-auto relative">
          
          <div className="text-center mb-16 relative">
            <h2 className="font-headline text-5xl md:text-7xl text-[#d2b06f] mb-6 uppercase tracking-widest">{title}</h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-light">
              {desc}
            </p>

            {isAdmin && !editingHeader && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={openHeaderEdit}
                  style={{ background: 'transparent', color: '#d2b06f', border: '1px solid #d2b06f', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '2px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>edit</span>
                  Sửa Nội Dung
                </button>
              </div>
            )}

            {isAdmin && editingHeader && (
              <div className="mt-8 mx-auto max-w-2xl bg-[#131313] border border-[#d2b06f]/30 p-6 text-left">
                <div className="mb-4">
                  <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Tiêu đề</label>
                  <input value={localTitle} onChange={e => setLocalTitle(e.target.value)} className="w-full bg-transparent border-b border-[#333] text-white p-2 outline-none font-headline text-2xl" />
                </div>
                <div className="mb-6">
                  <label className="block text-[#d2b06f] text-xs uppercase tracking-widest mb-2">Mô tả</label>
                  <textarea value={localDesc} onChange={e => setLocalDesc(e.target.value)} rows={3} className="w-full bg-transparent border-b border-[#333] text-white p-2 outline-none font-body text-sm leading-relaxed" />
                </div>
                <div className="flex gap-4">
                  <button onClick={saveHeader} className="bg-[#d2b06f] text-black px-6 py-2 text-xs font-bold uppercase tracking-widest">Lưu</button>
                  <button onClick={() => setEditingHeader(false)} className="border border-[#444] text-white/50 px-6 py-2 text-xs font-bold uppercase tracking-widest">Hủy</button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {images.map((img, idx) => (
              <div key={idx} className="relative group overflow-hidden bg-[#111] aspect-[4/3] flex items-center justify-center border border-white/5">
                <img 
                  src={img} 
                  alt={`Bản vẽ ${idx + 1}`} 
                  className="w-full h-full object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-[#d2b06f] tracking-[0.3em] text-xs uppercase font-bold border border-[#d2b06f]/50 px-6 py-3">Phóng To</span>
                </div>
                {isAdmin && (
                  <div className="absolute top-4 right-4 pointer-events-auto">
                    <EditBtn label="Thay Ảnh" onClick={() => triggerImageUpload(idx)} />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
        <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleImageChange} />
      </section>
    </>
  );
}
