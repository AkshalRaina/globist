import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="screen active" style={{ background: 'transparent' }}>

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
        <div className="anim-pop" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div
              className="anim-float"
              style={{
                width: 56,
                height: 56,
                background: 'var(--yellow)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(245,166,35,0.4)'
              }}
            >
              <img src="https://media.giphy.com/media/l41JOUJ1M0Y7uXuvK/giphy.gif" alt="globe" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-0.04em' }}>Globist</div>
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
