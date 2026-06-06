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
          background: 'linear-gradient(160deg, #0a1a0a 0%, #1a3a1a 40%, #0a2a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '32px 28px',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 60% 30%, rgba(245,166,35,.15) 0%, transparent 60%)',
          }}
        />

        {/* Mountain shapes */}
        <div
          style={{
            position: 'absolute',
            bottom: '35%',
            left: 0,
            right: 0,
            height: 200,
            zIndex: 0,
            background: 'linear-gradient(180deg, transparent, #1a3a1a 80%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              borderLeft: '90px solid transparent',
              borderRight: '90px solid transparent',
              borderBottom: '140px solid #2a5a2a',
              bottom: 0,
              left: 30,
            }}
          />
          <div
            style={{
              position: 'absolute',
              borderLeft: '120px solid transparent',
              borderRight: '120px solid transparent',
              borderBottom: '180px solid #1a4a1a',
              bottom: 0,
              left: 100,
            }}
          />
        </div>

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
