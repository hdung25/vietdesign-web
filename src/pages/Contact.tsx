import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useLang } from '../contexts/LanguageContext';

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export default function Contact() {
  const { t } = useLang();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    service: 'architecture',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = t('contact.err.name');
    if (!formData.phone.trim() || !/^[\d\s+\-().]{7,}$/.test(formData.phone.trim()))
      errs.phone = t('contact.err.phone');
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errs.email = t('contact.err.email');
    return errs;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
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
          <div className="w-full md:w-1/3">
            <p className="text-[#d2b06f] font-medium tracking-[0.4em] uppercase text-2xl md:text-3xl mb-4">
              {t('contact.label')}
            </p>
            <h1 className="font-headline text-7xl md:text-8xl lg:text-9xl text-white tracking-tight mb-12">
              {t('contact.title')}
            </h1>
            <div className="space-y-10">
              <div>
                <h3 className="text-[#d2b06f] font-headline text-2xl md:text-3xl mb-4">{t('contact.office.title')}</h3>
                <div className="w-full mb-4 mt-2">
                  <iframe
                    title="VIETDESIGN Office"
                    src="https://maps.google.com/maps?q=20.9718,105.7838&z=16&output=embed"
                    width="100%"
                    height="280"
                    style={{ 
                      border: '1px solid #d2b06f', 
                      borderRadius: '4px',
                      filter: 'grayscale(20%) contrast(1.1)'
                    }}
                    allowFullScreen
                    loading="lazy"
                  />
                  
                  <a
                    href="https://maps.google.com/?q=C37+Bac+Ha+Tower,+To+Huu,+Ha+Dong,+Hanoi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-2 text-[#d2b06f] hover:text-white transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined"
                      style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                      open_in_new
                    </span>
                    Mở trong Google Maps
                  </a>
                </div>
                <div className="w-full mb-6">
                  <iframe
                    title="VIETDESIGN Location"
                    src="https://maps.google.com/maps?q=C37+Bac+Ha+Tower,+To+Huu,+Ha+Dong,+Hanoi,+Vietnam&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="300"
                    style={{ border: '1px solid #d2b06f', borderRadius: '4px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  
                  <a
                    href="https://maps.google.com/?q=C37+Bac+Ha+Tower,+To+Huu,+Ha+Dong,+Hanoi,+Vietnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-3 text-[#d2b06f] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-base"
                      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
                      location_on
                    </span>
                    C37 Bắc Hà Tower, Tố Hữu, Hà Đông, Hà Nội, Việt Nam
                  </a>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <a href="tel:+84989942555"
                    className="flex items-center gap-3 text-on-surface-variant hover:text-[#d2b06f] transition-colors">
                    <span className="material-symbols-outlined text-[#d2b06f]"
                      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
                      call
                    </span>
                    +84 989 942 555
                  </a>
                  <a href="tel:+84908666622"
                    className="flex items-center gap-3 text-on-surface-variant hover:text-[#d2b06f] transition-colors">
                    <span className="material-symbols-outlined text-[#d2b06f]"
                      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
                      call
                    </span>
                    +84 908 666 622
                  </a>
                  <a href="mailto:cskh.vietdesign@gmail.com"
                    className="flex items-center gap-3 text-on-surface-variant hover:text-[#d2b06f] transition-colors">
                    <span className="material-symbols-outlined text-[#d2b06f]"
                      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
                      mail
                    </span>
                    cskh.vietdesign@gmail.com
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-[#d2b06f] font-headline text-2xl md:text-3xl mb-4">{t('contact.info.title')}</h3>
                <div className="flex flex-col gap-2 text-xl leading-relaxed">
                  <a href="tel:+84989942555" className="text-on-surface-variant font-light hover:text-[#d2b06f] transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">call</span>
                    +84 989 942 555
                  </a>
                  <a href="tel:+84908666622" className="text-on-surface-variant font-light hover:text-[#d2b06f] transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">call</span>
                    +84 908 666 622
                  </a>
                  <a href="mailto:cskh.vietdesign@gmail.com" className="text-on-surface-variant font-light hover:text-[#d2b06f] transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">mail</span>
                    cskh.vietdesign@gmail.com
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-[#d2b06f] font-headline text-2xl md:text-3xl mb-4">{t('contact.hours.title')}</h3>
                <p className="text-on-surface-variant font-light text-xl leading-relaxed">
                  {t('contact.hours.weekday')}<br />
                  {t('contact.hours.weekend')}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full md:w-2/3 bg-[#0a0a0a] p-10 md:p-16">
            <h2 className="font-headline text-5xl md:text-6xl text-[#d2b06f] mb-8">{t('contact.form.title')}</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                <span
                  className="material-symbols-outlined text-primary text-6xl"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 40" }}
                >
                  check_circle
                </span>
                <p className="font-headline text-2xl text-white">{t('contact.form.success')}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[#d2b06f] font-label tracking-widest uppercase text-base border-b border-[#d2b06f]/30 pb-1 hover:border-[#d2b06f] transition-all"
                >
                  {t('contact.form.submit')}
                </button>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-on-surface-variant text-base tracking-widest uppercase">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`bg-transparent border-b pb-2 text-white focus:outline-none transition-colors text-xl ${
                        errors.name ? 'border-red-500/70' : 'border-outline-variant/50 focus:border-[#d2b06f]'
                      }`}
                    />
                    {errors.name && (
                      <span className="text-red-400/80 text-[0.7rem] tracking-wide">{errors.name}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-on-surface-variant text-base tracking-widest uppercase">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+84 989 942 555"
                      className={`bg-transparent border-b pb-2 text-white focus:outline-none transition-colors text-xl ${
                        errors.phone ? 'border-red-500/70' : 'border-outline-variant/50 focus:border-[#d2b06f]'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-red-400/80 text-[0.7rem] tracking-wide">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-on-surface-variant text-base tracking-widest uppercase">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="cskh.vietdesign@gmail.com"
                    className={`bg-transparent border-b pb-2 text-white focus:outline-none transition-colors text-xl ${
                      errors.email ? 'border-red-500/70' : 'border-outline-variant/50 focus:border-[#d2b06f]'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-red-400/80 text-[0.7rem] tracking-wide">{errors.email}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-on-surface-variant text-base tracking-widest uppercase">
                    {t('contact.form.service')}
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="bg-transparent border-b border-outline-variant/50 pb-2 text-white focus:outline-none focus:border-[#d2b06f] transition-colors appearance-none rounded-none cursor-pointer text-xl"
                  >
                    <option value="architecture" className="bg-[#1f1f1f] text-white">{t('contact.svc.arch')}</option>
                    <option value="interior" className="bg-[#1f1f1f] text-white">{t('contact.svc.interior')}</option>
                    <option value="construction" className="bg-[#1f1f1f] text-white">{t('contact.svc.construction')}</option>
                    <option value="other" className="bg-[#1f1f1f] text-white">{t('contact.svc.other')}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-on-surface-variant text-base tracking-widest uppercase">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-transparent border-b border-outline-variant/50 pb-2 text-white focus:outline-none focus:border-[#d2b06f] transition-colors resize-none text-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="gold-glow bg-[#d2b06f] text-black px-12 py-4 font-label font-bold tracking-widest uppercase text-base w-full md:w-auto mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 hover:brightness-110 transition-all"
                >
                  {submitting && (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {t('contact.form.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}