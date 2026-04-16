import { useState, useRef, type ChangeEvent } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useAdminMode } from '../contexts/AdminModeContext';

const GOLD = '#d2b06f';
const DARK = '#0a0a0a';
const CREAM = '#eed9ab';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

export default function About() {
  const { lang } = useLang();
  const { isAdmin } = useAdminMode();
  const VN = lang === 'VN';

  // Editable state
  const [heroImg, setHeroImg] = useState('/anh2.png');
  const [splitImg, setSplitImg] = useState('/anh1.png');
  const [quoteVN, setQuoteVN] = useState('"Chúng tôi không chỉ thiết kế không gian – chúng tôi kiến tạo những trải nghiệm sống đáng nhớ cho mỗi gia đình."');
  const [quoteEN, setQuoteEN] = useState('\u201cWe don\u2019t just design spaces \u2013 we create memorable living experiences for every family.\u201d');
  const [editingQuote, setEditingQuote] = useState(false);
  const [localQuoteVN, setLocalQuoteVN] = useState('');
  const [localQuoteEN, setLocalQuoteEN] = useState('');
  const [saved, setSaved] = useState(false);

  const heroFileRef = useRef<HTMLInputElement>(null);
  const splitFileRef = useRef<HTMLInputElement>(null);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleHeroImg = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setHeroImg(await toBase64(file)); flash(); e.target.value = '';
  };
  const handleSplitImg = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setSplitImg(await toBase64(file)); flash(); e.target.value = '';
  };
  const openQuoteEdit = () => { setLocalQuoteVN(quoteVN); setLocalQuoteEN(quoteEN); setEditingQuote(true); };
  const saveQuote = () => { setQuoteVN(localQuoteVN); setQuoteEN(localQuoteEN); flash(); setEditingQuote(false); };

  return (
    <div style={{ background: DARK, minHeight: '100vh' }}>

      {/* ── HERO BANNER ── */}
      <div style={{ position: 'relative', height: '92vh', minHeight: '600px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={heroImg} alt="VIETDESIGN" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', zIndex: 2 }}>
          <p style={{ color: GOLD, letterSpacing: '0.4em', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Manrope, sans-serif' }}>
            {VN ? 'KIẾN TRÚC & NỘI THẤT' : 'ARCHITECTURE & INTERIORS'}
          </p>
          <h1 style={{ fontFamily: 'Noto Serif, serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#fff', fontWeight: 300, letterSpacing: '0.05em', lineHeight: 1.15, marginBottom: '20px', textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
            {VN ? 'TẦM NHÌN – SỨ MỆNH' : 'VISION & MISSION'}
          </h1>
          <div style={{ width: '60px', height: '2px', background: GOLD, margin: '0 auto 24px' }} />
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', letterSpacing: '0.05em', maxWidth: '600px', margin: '0 auto', fontFamily: 'Manrope, sans-serif' }}>
            {VN ? 'VIETDESIGN tự hào là đơn vị hàng đầu trong lĩnh vực thiết kế và thi công kiến trúc, nội thất cao cấp tại Việt Nam' : 'VIETDESIGN is proud to be a leading firm in premium architecture and interior design in Vietnam'}
          </p>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
          <div style={{ width: '1px', height: '48px', background: GOLD }} />
          <span style={{ color: GOLD, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>SCROLL</span>
        </div>

        {/* Admin: change hero image */}
        {isAdmin && (
          <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {saved && <span style={{ color: '#4ade80', fontSize: '0.68rem', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em' }}>✓ Đã lưu</span>}
            <button onClick={() => heroFileRef.current?.click()} style={{ background: 'rgba(210,176,111,0.9)', color: '#000', border: 'none', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '2px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>image</span>
              Đổi Ảnh Nền
            </button>
            <input ref={heroFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleHeroImg} />
          </div>
        )}
      </div>

      {/* ── INTRO TEXT ── */}
      <div style={{ background: DARK, padding: '80px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: GOLD, letterSpacing: '0.35em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '24px', fontFamily: 'Manrope, sans-serif' }}>{VN ? 'VỀ CHÚNG TÔI' : 'ABOUT US'}</p>
          <h2 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, lineHeight: 1.4, marginBottom: '32px' }}>
            {VN ? 'VIETDESIGN – Nâng tầm giá trị cuộc sống' : 'VIETDESIGN – Elevating the Value of Living'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.9, fontFamily: 'Manrope, sans-serif', marginBottom: '20px' }}>
            {VN ? 'VIETDESIGN tự hào là đơn vị hàng đầu trong lĩnh vực thiết kế và thi công kiến trúc, nội thất cao cấp tại Việt Nam, được hàng ngàn khách hàng tin tưởng từ khắp mọi miền đất nước.' : 'VIETDESIGN is a premier firm in luxury architecture and interior design in Vietnam, trusted by thousands of clients nationwide.'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.9, fontFamily: 'Manrope, sans-serif' }}>
            {VN ? 'Chúng tôi cung cấp trọn gói các dịch vụ từ thiết kế, thi công xây dựng mới, cải tạo, nội thất, đến hoàn thiện và trang trí không gian sống.' : 'We offer comprehensive services from design, new construction, renovation, interior finishing and decoration.'}
          </p>
        </div>
      </div>

      {/* ── 3 CARDS ── */}
      <div style={{ background: CREAM, padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { icon: 'visibility', titleVN: 'TẦM NHÌN', titleEN: 'VISION', descVN: 'Không chỉ chiếm lĩnh thị trường trong nước, VIETDESIGN không ngừng đổi mới, sáng tạo để kiến tạo các sản phẩm và dịch vụ thiết kế, thi công đẳng cấp, mục tiêu trở thành doanh nghiệp dẫn đầu thị trường khu vực và quốc tế.', descEN: 'Aiming beyond domestic leadership, VIETDESIGN constantly innovates to build world-class design and construction services, targeting regional and international market leadership.' },
              { icon: 'history_edu', titleVN: 'LỊCH SỬ', titleEN: 'HISTORY', descVN: 'Với nhiều năm thành lập và phát triển, VIETDESIGN đã mở rộng quy mô với các chi nhánh tại Hà Nội và TP. Hồ Chí Minh, phục vụ hàng ngàn dự án trên toàn quốc.', descEN: 'Through years of growth and expansion, VIETDESIGN has scaled with offices in Hanoi and Ho Chi Minh City, delivering thousands of projects nationwide.' },
              { icon: 'my_location', titleVN: 'SỨ MỆNH', titleEN: 'MISSION', descVN: 'VIETDESIGN mong muốn cung cấp những giải pháp thiết kế và thi công trọn gói cao cấp, đáp ứng nhu cầu và mong muốn của khách hàng với sự tận tâm và chuyên nghiệp.', descEN: 'VIETDESIGN strives to deliver premium end-to-end design and construction solutions, meeting every client needs with dedication and professionalism.' },
            ].map(({ icon, titleVN, titleEN, descVN, descEN }) => (
              <div key={icon} style={{ background: '#fff', padding: '48px 36px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '52px', color: DARK, fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48", display: 'block', marginBottom: '24px' }}>{icon}</span>
                <h3 style={{ fontFamily: 'Noto Serif, serif', fontSize: '1.4rem', fontWeight: 700, color: DARK, marginBottom: '16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{VN ? titleVN : titleEN}</h3>
                <div style={{ width: '40px', height: '2px', background: GOLD, margin: '0 auto 20px' }} />
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.8, fontFamily: 'Manrope, sans-serif' }}>{VN ? descVN : descEN}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED IMAGE SPLIT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '600px', position: 'relative' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={splitImg} alt="VIETDESIGN Interior" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)' }} />
          {isAdmin && (
            <button onClick={() => splitFileRef.current?.click()} style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(210,176,111,0.9)', color: '#000', border: 'none', padding: '7px 14px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '2px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>image</span> Đổi Ảnh
            </button>
          )}
          <input ref={splitFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSplitImg} />
        </div>
        <div style={{ background: '#111', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 60px' }}>
          <p style={{ color: GOLD, letterSpacing: '0.35em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'Manrope, sans-serif' }}>{VN ? 'PHONG CÁCH THIẾT KẾ' : 'DESIGN PHILOSOPHY'}</p>
          <h2 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 400, lineHeight: 1.4, marginBottom: '28px' }}>
            {VN ? 'Không gian sống\nđẳng cấp quốc tế' : 'International-class\nLiving Spaces'}
          </h2>
          <div style={{ width: '50px', height: '2px', background: GOLD, marginBottom: '28px' }} />
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.9, fontFamily: 'Manrope, sans-serif', marginBottom: '40px' }}>
            {VN ? 'Mỗi công trình do VIETDESIGN thực hiện là một tác phẩm nghệ thuật đỉnh cao – nơi kiến trúc hiện đại gặp gỡ giá trị truyền thống, tạo nên những không gian sống tinh tế, sang trọng và đậm bản sắc.' : 'Every project VIETDESIGN creates is a masterpiece — where modern architecture meets traditional values, crafting refined, luxurious spaces with distinctive character.'}
          </p>
          <div style={{ display: 'flex', gap: '40px' }}>
            {[{ num: '500+', label: VN ? 'Dự án' : 'Projects' }, { num: '15+', label: VN ? 'Năm kinh nghiệm' : 'Years exp.' }, { num: '1000+', label: VN ? 'Khách hàng' : 'Clients' }].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'Noto Serif, serif', fontSize: '2rem', color: GOLD, fontWeight: 700, lineHeight: 1 }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '6px', fontFamily: 'Manrope, sans-serif' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GOLD QUOTE BAND ── */}
      <div style={{ background: GOLD, padding: '64px 40px', textAlign: 'center', position: 'relative' }}>
        {!editingQuote ? (
          <>
            <p style={{ fontFamily: 'Noto Serif, serif', color: DARK, fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.7, maxWidth: '800px', margin: '0 auto' }}>
              {VN ? quoteVN : quoteEN}
            </p>
            <p style={{ marginTop: '24px', color: DARK, fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', fontWeight: 600 }}>VIETDESIGN</p>
            {isAdmin && (
              <button onClick={openQuoteEdit} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.2)', color: DARK, border: 'none', padding: '7px 14px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '2px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>edit</span> Sửa Quote
              </button>
            )}
          </>
        ) : (
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ color: '#5a3e00', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>Quote (VN)</label>
              <textarea rows={3} value={localQuoteVN} onChange={e => setLocalQuoteVN(e.target.value)} style={{ background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.2)', color: DARK, padding: '10px', fontFamily: 'Noto Serif, serif', fontSize: '1rem', resize: 'vertical', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ color: '#5a3e00', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>Quote (EN)</label>
              <textarea rows={3} value={localQuoteEN} onChange={e => setLocalQuoteEN(e.target.value)} style={{ background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.2)', color: DARK, padding: '10px', fontFamily: 'Noto Serif, serif', fontSize: '1rem', resize: 'vertical', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saveQuote} style={{ flex: 1, background: DARK, color: GOLD, border: 'none', padding: '12px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Lưu</button>
              <button onClick={() => setEditingQuote(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.15)', border: 'none', color: DARK, padding: '12px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Hủy</button>
            </div>
          </div>
        )}
      </div>

      {/* ── CORE VALUES ── */}
      <div style={{ background: '#0f0f0f', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: GOLD, letterSpacing: '0.35em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Manrope, sans-serif' }}>{VN ? 'GIÁ TRỊ CỐT LÕI' : 'CORE VALUES'}</p>
            <h2 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 400 }}>
              {VN ? 'Những điều chúng tôi tin tưởng' : 'What We Believe In'}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2px', background: '#d2b06f22' }}>
            {[
              { icon: 'diamond', titleVN: 'Chất Lượng', titleEN: 'Quality', descVN: 'Cam kết chất lượng vượt trội trong từng chi tiết', descEN: 'Committed to superior quality in every detail' },
              { icon: 'handshake', titleVN: 'Tận Tâm', titleEN: 'Dedication', descVN: 'Lắng nghe và đáp ứng mọi nhu cầu của khách hàng', descEN: 'Listening and meeting every client need' },
              { icon: 'lightbulb', titleVN: 'Sáng Tạo', titleEN: 'Innovation', descVN: 'Liên tục đổi mới và cập nhật xu hướng thiết kế thế giới', descEN: 'Continuously innovating with global design trends' },
              { icon: 'verified', titleVN: 'Chuyên Nghiệp', titleEN: 'Professionalism', descVN: 'Đội ngũ kiến trúc sư và kỹ sư giàu kinh nghiệm', descEN: 'Experienced team of architects and engineers' },
            ].map(({ icon, titleVN, titleEN, descVN, descEN }) => (
              <div key={icon} style={{ background: '#111', padding: '48px 32px', textAlign: 'center', transition: 'background 0.3s' }} onMouseEnter={e => (e.currentTarget.style.background = '#1a1510')} onMouseLeave={e => (e.currentTarget.style.background = '#111')}>
                <span className="material-symbols-outlined" style={{ fontSize: '36px', color: GOLD, display: 'block', marginBottom: '20px', fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}>{icon}</span>
                <h3 style={{ fontFamily: 'Noto Serif, serif', color: '#fff', fontSize: '1.1rem', marginBottom: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{VN ? titleVN : titleEN}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: 'Manrope, sans-serif' }}>{VN ? descVN : descEN}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}