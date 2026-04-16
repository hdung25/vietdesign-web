import { useState, useRef, type ChangeEvent } from 'react';
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

/* ── Default service images (stored in component state) ── */
const DEFAULT_IMGS = [
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85&fit=crop',
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=85&fit=crop',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&q=85&fit=crop',
];

function ServiceItem({
  imgSrc,
  imgAlt,
  titleKey,
  descKey,
  items,
  reverse = false,
  onChangeImg,
  isAdmin,
}: {
  imgSrc: string;
  imgAlt: string;
  titleKey: string;
  descKey: string;
  items: string[];
  reverse?: boolean;
  onChangeImg?: () => void;
  isAdmin: boolean;
}) {
  const { t } = useLang();
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}>
      <div className="w-full md:w-1/2">
        <div className="aspect-square overflow-hidden" style={{ position: 'relative' }}>
          <img alt={imgAlt} className="w-full h-full object-cover" src={imgSrc} referrerPolicy="no-referrer" />
          {/* Admin change image button */}
          {isAdmin && onChangeImg && (
            <button
              onClick={onChangeImg}
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(210,176,111,0.92)',
                color: '#000',
                border: 'none',
                padding: '7px 14px',
                cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '2px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 0, 'wght' 400" }}>image</span>
              Đổi Ảnh
            </button>
          )}
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="font-headline text-5xl md:text-6xl text-[#d2b06f] mb-6">{t(titleKey)}</h2>
        <p className="text-on-surface-variant text-xl leading-relaxed mb-8">{t(descKey)}</p>
        <ul className="space-y-4 text-on-surface-variant font-light text-xl leading-relaxed">
          {items.map(key => (
            <li key={key} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#d2b06f] rounded-full flex-shrink-0"></span>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLang();
  const { isAdmin } = useAdminMode();

  const [imgs, setImgs] = useState(DEFAULT_IMGS);
  const [saved, setSaved] = useState(false);
  const fileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleImg = (idx: number) => async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const b64 = await toBase64(file);
    setImgs(prev => prev.map((v, i) => i === idx ? b64 : v));
    flash();
    e.target.value = '';
  };

  const SERVICES = [
    { titleKey: 'services.s1.title', descKey: 'services.s1.desc', imgAlt: 'Architectural Design', items: ['services.s1.li1', 'services.s1.li2', 'services.s1.li3', 'services.s1.li4'], reverse: false },
    { titleKey: 'services.s2.title', descKey: 'services.s2.desc', imgAlt: 'Interior Design', items: ['services.s2.li1', 'services.s2.li2', 'services.s2.li3', 'services.s2.li4'], reverse: true },
    { titleKey: 'services.s3.title', descKey: 'services.s3.desc', imgAlt: 'Construction', items: ['services.s3.li1', 'services.s3.li2', 'services.s3.li3', 'services.s3.li4'], reverse: false },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-10">

        {/* Header */}
        <div className="mb-20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p className="text-[#d2b06f] font-medium tracking-[0.4em] uppercase text-2xl md:text-3xl mb-4">{t('services.label')}</p>
            <h1 className="font-headline text-7xl md:text-8xl lg:text-9xl text-white tracking-tight">{t('services.title')}</h1>
          </div>
          {isAdmin && saved && (
            <span style={{ color: '#4ade80', fontSize: '0.7rem', letterSpacing: '0.2em', fontFamily: 'Manrope, sans-serif', marginBottom: '8px' }}>✓ Đã lưu ảnh</span>
          )}
        </div>

        {/* Services list */}
        <div className="space-y-32">
          {SERVICES.map((svc, idx) => (
            <div key={svc.titleKey}>
              <ServiceItem
                imgSrc={imgs[idx]}
                imgAlt={svc.imgAlt}
                titleKey={svc.titleKey}
                descKey={svc.descKey}
                items={svc.items}
                reverse={svc.reverse}
                isAdmin={isAdmin}
                onChangeImg={() => fileRefs[idx].current?.click()}
              />
              <input
                ref={fileRefs[idx]}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImg(idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}