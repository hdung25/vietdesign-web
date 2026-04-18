import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminMode } from '../contexts/AdminModeContext';

const ADMIN_PASSWORD = 'vietdesign@';

export default function Admin() {
  const { isAdmin, login } = useAdminMode();
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  // Nếu đã đăng nhập, redirect về trang chủ
  if (isAdmin) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      login();
      navigate('/', { replace: true });
    } else {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
      setPw('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 40%, #1a1200 0%, #0a0a0a 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background texture lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: 'repeating-linear-gradient(90deg, #d2b06f 0px, #d2b06f 1px, transparent 1px, transparent 80px)',
      }} />

      <div style={{ width: '100%', maxWidth: '380px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <img
            src="/logo.png"
            alt="VIETDESIGN"
            style={{ height: '72px', margin: '0 auto 16px', display: 'block' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div style={{ fontFamily: 'Noto Serif, serif', fontSize: '22px', color: '#d2b06f', letterSpacing: '0.3em', fontWeight: 300 }}>
            VIETDESIGN
          </div>
          <div style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginTop: '6px', fontFamily: 'Manrope, sans-serif' }}>
            Quản Trị Viên
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#131313',
            border: '1px solid #242424',
            borderTop: '2px solid #d2b06f',
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#666', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif' }}>
              Mật Khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                autoFocus
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${error ? '#f87171' : '#3d3020'}`,
                  paddingBottom: '10px',
                  paddingRight: '28px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  fontFamily: 'Manrope, sans-serif',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: 0, bottom: '8px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 0 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                  {show ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {error && (
              <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '2px', fontFamily: 'Manrope, sans-serif' }}>
                {error}
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #c9a455, #d2b06f, #c9a455)',
              backgroundSize: '200% auto',
              color: '#000',
              padding: '15px',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-position 0.4s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundPosition = 'right center'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundPosition = 'left center'; }}
          >
            Đăng Nhập
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: '#333', fontSize: '0.65rem', letterSpacing: '0.15em', fontFamily: 'Manrope, sans-serif' }}>
          <a href="/" style={{ color: '#d2b06f55', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#d2b06f'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#d2b06f55'; }}>
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}