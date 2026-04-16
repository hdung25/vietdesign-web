import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useProjectData, type ContactInfo } from '../contexts/ProjectDataContext';
import { useAdminMode } from '../contexts/AdminModeContext';

interface FormData { name: string; phone: string; email: string; service: string; message: string; }
interface FormErrors { name?: string; phone?: string; email?: string; }

/* ── Contact Info Edit Panel ── */
function ContactEditPanel({ info, onSave, onClose }: {
  info: ContactInfo;
  onSave: (c: ContactInfo) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState({ ...info });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    onSave(local);
    setSaving(false);
    onClose();
  };

  const inp = { background: 'transparent', border: 'none', borderBottom: '1px solid #4d4639', color: '#fff', padding: '6px 0 8px', outline: 'none', fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' as const };
  const lbl = { color: '#888', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase' as const, fontFamily: 'Manrope, sans-serif', marginBottom: '4px', display: 'block' as const };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={onClose}>
      <div style={{ background: '#131313', width: '100%', maxWidth: '560px', padding: '40px', borderTop: '2px solid #d2b06f' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'Noto Serif, serif', color: '#d2b06f', fontSize: '1.3rem', marginBottom: '28px' }}>✏ Chỉnh Sửa Thông Tin Liên Hệ</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {([
            { key: 'phone1', label: 'Hotline 1' },
            { key: 'phone2', label: 'Hotline 2' },
            { key: 'email', label: 'Email' },
            { key: 'address', label: 'Địa Chỉ (VN)' },
            { key: 'addressEN', label: 'Địa Chỉ (EN)' },
          ] as const).map(({ key, label }) => (
            <div key={key}>
              <label style={lbl}>{label}</label>
              <input style={inp} value={local[key]} onChange={e => setLocal(l => ({ ...l, [key]: e.target.value }))} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
            <button type="submit" disabled={saving} style={{ flex: 1, background: '#d2b06f', color: '#000', padding: '13px', fontFamily: 'Manrope, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.72rem', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #333', color: '#888', padding: '13px', fontFamily: 'Manrope, sans-serif', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Contact() {
  const { t } = useLang();
  const { contactInfo, setContactInfo } = useProjectData();
  const { isAdmin } = useAdminMode();
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', email: '', service: 'architecture', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [saved, setSaved] = useState(false);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleSaveContact = async (c: typeof contactInfo) => {
    await setContactInfo(c);
    flash();
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = t('contact.err.name');
    if (!formData.phone.trim() || !/^[\d\s+\-().]{7,}$/.test(formData.phone.trim())) errs.phone = t('contact.err.phone');
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = t('contact.err.email');
    return errs;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', service: 'architecture', message: '' });
  };

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex flex-col md:flex-row gap-20">

          {/* Thông tin liên hệ */}
          <div className="w-full md:w-1/3" style={{ position: 'relative' }}>
            <p className="text-[#d2b06f] font-medium tracking-[0.4em] uppercase text-2xl md:text-3xl mb-4">{t('contact.label')}</p>
            <h1 className="font-headline text-7xl md:text-8xl lg:text-9xl text-white tracking-tight mb-12">{t('contact.title')}</h1>

            {/* Admin edit button */}
            {isAdmin && (
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setEditingContact(true)} style={{ background: 'rgba(210,176,111,0.12)', border: '1px solid #d2b06f40', color: '#d2b06f', padding: '8px 18px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '2px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                  Sửa Thông Tin
                </button>
                {saved && <span style={{ color: '#4ade80', fontSize: '0.68rem', letterSpacing: '0.15em', fontFamily: 'Manrope, sans-serif' }}>✓ Đã lưu</span>}
              </div>
            )}

            <div className="space-y-10">
              <div>
                <h3 className="text-[#d2b06f] font-headline text-2xl md:text-3xl mb-4">{t('contact.office.title')}</h3>
                <div className="w-full mb-4 mt-2">
                  <iframe title="VIETDESIGN Office" src="https://maps.google.com/maps?q=20.9718,105.7838&z=16&output=embed" width="100%" height="280" style={{ border: '1px solid #d2b06f', borderRadius: '4px', filter: 'grayscale(20%) contrast(1.1)' }} allowFullScreen loading="lazy" />
                  <a href="https://maps.google.com/?q=C37+Bac+Ha+Tower,+To+Huu,+Ha+Dong,+Hanoi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 text-[#d2b06f] hover:text-white transition-colors text-sm">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>open_in_new</span>
                    Mở trong Google Maps
                  </a>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <a href={`tel:${contactInfo.phone1}`} className="flex items-center gap-3 text-on-surface-variant hover:text-[#d2b06f] transition-colors">
                    <span className="material-symbols-outlined text-[#d2b06f]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>call</span>
                    {contactInfo.phone1}
                  </a>
                  <a href={`tel:${contactInfo.phone2}`} className="flex items-center gap-3 text-on-surface-variant hover:text-[#d2b06f] transition-colors">
                    <span className="material-symbols-outlined text-[#d2b06f]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>call</span>
                    {contactInfo.phone2}
                  </a>
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-on-surface-variant hover:text-[#d2b06f] transition-colors">
                    <span className="material-symbols-outlined text-[#d2b06f]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>mail</span>
                    {contactInfo.email}
                  </a>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[#d2b06f]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>location_on</span>
                    {contactInfo.address}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[#d2b06f] font-headline text-2xl md:text-3xl mb-4">{t('contact.hours.title')}</h3>
                <p className="text-on-surface-variant font-light text-xl leading-relaxed">
                  {t('contact.hours.weekday')}<br />{t('contact.hours.weekend')}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full md:w-2/3 bg-[#0a0a0a] p-10 md:p-16">
            <h2 className="font-headline text-5xl md:text-6xl text-[#d2b06f] mb-8">{t('contact.form.title')}</h2>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 40" }}>check_circle</span>
                <p className="font-headline text-2xl text-white">{t('contact.form.success')}</p>
                <button onClick={() => setSubmitted(false)} className="text-[#d2b06f] font-label tracking-widest uppercase text-base border-b border-[#d2b06f]/30 pb-1 hover:border-[#d2b06f] transition-all">{t('contact.form.submit')}</button>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-on-surface-variant text-base tracking-widest uppercase">{t('contact.form.name')}</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} className={`bg-transparent border-b pb-2 text-white focus:outline-none transition-colors text-xl ${errors.name ? 'border-red-500/70' : 'border-outline-variant/50 focus:border-[#d2b06f]'}`} />
                    {errors.name && <span className="text-red-400/80 text-[0.7rem] tracking-wide">{errors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-on-surface-variant text-base tracking-widest uppercase">{t('contact.form.phone')}</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleChange} placeholder={contactInfo.phone1} className={`bg-transparent border-b pb-2 text-white focus:outline-none transition-colors text-xl ${errors.phone ? 'border-red-500/70' : 'border-outline-variant/50 focus:border-[#d2b06f]'}`} />
                    {errors.phone && <span className="text-red-400/80 text-[0.7rem] tracking-wide">{errors.phone}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-on-surface-variant text-base tracking-widest uppercase">{t('contact.form.email')}</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder={contactInfo.email} className={`bg-transparent border-b pb-2 text-white focus:outline-none transition-colors text-xl ${errors.email ? 'border-red-500/70' : 'border-outline-variant/50 focus:border-[#d2b06f]'}`} />
                  {errors.email && <span className="text-red-400/80 text-[0.7rem] tracking-wide">{errors.email}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-on-surface-variant text-base tracking-widest uppercase">{t('contact.form.service')}</label>
                  <select id="service" value={formData.service} onChange={handleChange} className="bg-transparent border-b border-outline-variant/50 pb-2 text-white focus:outline-none focus:border-[#d2b06f] transition-colors appearance-none rounded-none cursor-pointer text-xl">
                    <option value="architecture" className="bg-[#1f1f1f] text-white">{t('contact.svc.arch')}</option>
                    <option value="interior" className="bg-[#1f1f1f] text-white">{t('contact.svc.interior')}</option>
                    <option value="construction" className="bg-[#1f1f1f] text-white">{t('contact.svc.construction')}</option>
                    <option value="other" className="bg-[#1f1f1f] text-white">{t('contact.svc.other')}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-on-surface-variant text-base tracking-widest uppercase">{t('contact.form.message')}</label>
                  <textarea id="message" rows={4} value={formData.message} onChange={handleChange} className="bg-transparent border-b border-outline-variant/50 pb-2 text-white focus:outline-none focus:border-[#d2b06f] transition-colors resize-none text-xl" />
                </div>
                <button type="submit" disabled={submitting} className="gold-glow bg-[#d2b06f] text-black px-12 py-4 font-label font-bold tracking-widest uppercase text-base w-full md:w-auto mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 hover:brightness-110 transition-all">
                  {submitting && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                  {t('contact.form.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      {editingContact && <ContactEditPanel info={contactInfo} onSave={handleSaveContact} onClose={() => setEditingContact(false)} />}
    </div>
  );
}