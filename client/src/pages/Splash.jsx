import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="screen active" style={{ background: 'transparent' }}>
      <div
        className="status-bar"
        style={{
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <span className="status-time" style={{ color: 'white' }}>9:41</span>
        <div className="status-icons" style={{ color: 'white' }}>📶 🔋</div>
      </div>
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80') center/cover",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '32px 28px',
        }}
      >
        {/* Dark overlay for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
            zIndex: 1
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: 'var(--yellow)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              ⚡
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: 'white' }}>Globist</div>
          </div>
          <div
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,.7)',
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            Discover. Travel. Share.
            <br />
            Earn rewards for every trip you inspire.
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
            <div
              style={{
                width: 20,
                height: 6,
                borderRadius: 3,
                background: 'var(--yellow)',
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.3)',
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.3)',
              }}
            />
          </div>

          <button className="btn-primary" style={{ marginBottom: 8 }} onClick={() => navigate('/signup')}>
            Get Started
          </button>
          <button
            className="btn-outline"
            style={{
              color: 'rgba(255,255,255,.8)',
              borderColor: 'rgba(255,255,255,.3)',
              background: 'rgba(255,255,255,.1)',
            }}
            onClick={() => navigate('/signup')}
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}
