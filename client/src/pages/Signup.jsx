import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const interests = [
  { emoji: '🏔️', name: 'Trekking' },
  { emoji: '🏕️', name: 'Camping' },
  { emoji: '🏖️', name: 'Beach' },
  { emoji: '🏛️', name: 'Culture' },
  { emoji: '🍽️', name: 'Food' },
  { emoji: '❄️', name: 'Snow' },
  { emoji: '🧘', name: 'Wellness' },
  { emoji: '🚵', name: 'Adventure' },
];

const roles = [
  { icon: '🧳', name: 'Traveler', desc: 'Discover & book trips', value: 'traveler' },
  { icon: '🎬', name: 'Creator', desc: 'Post reels & earn', value: 'creator' },
  { icon: '🏔️', name: 'Agency', desc: 'List my packages', value: 'agency' },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, verifyOtp, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('traveler');
  const [name, setName] = useState('Arjun Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [selectedInterests, setSelectedInterests] = useState(['Trekking', 'Camping', 'Snow']);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (name) => {
    setSelectedInterests((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await signup({ name, phone, role: selectedRole, interests: selectedInterests });
      setShowOtp(true);
    } catch (err) {
      // If user already exists, try login
      if (err.response?.status === 400 && err.response?.data?.message?.includes('exists')) {
        try {
          await login(phone, '123456');
          setShowOtp(true);
        } catch {
          setShowOtp(true); // Still show OTP for demo
        }
      } else {
        setShowOtp(true); // Show OTP screen anyway for demo
      }
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await verifyOtp({ phone, otp: otp || '123456' });
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  if (showOtp) {
    return (
      <div className="screen active" style={{ background: 'var(--white)' }}>
        <div
          style={{
            padding: '60px 28px 24px',
            background: 'linear-gradient(180deg, var(--black) 0%, var(--black) 60%, var(--white) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div
              style={{
                width: 36, height: 36, background: 'var(--yellow)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}
            >⚡</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>Globist</div>
          </div>
          <div className="h2" style={{ color: 'white', marginBottom: 4 }}>Verify OTP</div>
          <div className="body2" style={{ color: 'rgba(255,255,255,.6)' }}>
            Enter the 6-digit code sent to {phone}
          </div>
        </div>
        <div style={{ padding: 28, flex: 1 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="input-label">OTP Code</div>
            <input
              className="input"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', marginBottom: 20 }}>
            💡 For demo, any 6 digits work (or leave empty)
          </div>
          {error && (
            <div style={{ color: 'var(--red)', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
              {error}
            </div>
          )}
          <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Continue →'}
          </button>
          <div
            style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--yellow)', cursor: 'pointer' }}
            onClick={() => setShowOtp(false)}
          >
            ← Back to signup
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen active" style={{ background: 'var(--white)' }}>
      <div
        style={{
          padding: '60px 28px 24px',
          background: 'linear-gradient(180deg, var(--black) 0%, var(--black) 60%, var(--white) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div
            style={{
              width: 36, height: 36, background: 'var(--yellow)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}
          >⚡</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>Globist</div>
        </div>
        <div className="h2" style={{ color: 'white', marginBottom: 4 }}>Join Globist</div>
        <div className="body2" style={{ color: 'rgba(255,255,255,.6)' }}>
          Travel, share, and earn referral points
        </div>
      </div>
      <div className="scroll-area" style={{ padding: 28 }}>
        <div className="body1" style={{ fontWeight: 600, marginBottom: 12 }}>I want to...</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {roles.map((role) => (
            <div
              key={role.value}
              className={`role-card${selectedRole === role.value ? ' selected' : ''}`}
              onClick={() => setSelectedRole(role.value)}
              style={{
                flex: 1,
                border: `2px solid ${selectedRole === role.value ? 'var(--yellow)' : 'var(--gray2)'}`,
                borderRadius: 12,
                padding: '14px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                background: selectedRole === role.value ? 'var(--yellow-light)' : 'transparent',
                transition: 'all .2s',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 5 }}>{role.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{role.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{role.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div className="input-label">Full Name</div>
          <input className="input" placeholder="Arjun Sharma" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div className="input-label">Mobile Number</div>
          <input className="input" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div className="input-label">Interests</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {interests.map((i) => (
              <div
                key={i.name}
                className={`pill${selectedInterests.includes(i.name) ? ' active' : ''}`}
                onClick={() => toggleInterest(i.name)}
              >
                {i.emoji} {i.name}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--gray2)' }} />
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--gray2)' }} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ fontSize: 16 }}>G</span> Google
          </button>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ fontSize: 16 }}>f</span> Facebook
          </button>
        </div>

        {error && (
          <div style={{ color: 'var(--red)', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleSendOtp} disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP →'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text3)' }}>
          By continuing you agree to our Terms & Privacy Policy
        </div>
      </div>
    </div>
  );
}
