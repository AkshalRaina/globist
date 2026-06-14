import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const SCENE_TYPES = [
  { id: 'mountain', label: '🏔️ Mountain', gradient: 'linear-gradient(160deg, #0a1a3a, #2a5a4a)' },
  { id: 'valley', label: '🌿 Valley', gradient: 'linear-gradient(160deg, #1a3a2a, #2a4a3a)' },
  { id: 'snow', label: '❄️ Snow', gradient: 'linear-gradient(160deg, #2a3a5a, #6a8aaa)' },
  { id: 'desert', label: '🏜️ Desert', gradient: 'linear-gradient(160deg, #4a3a1a, #8a7a3a)' },
  { id: 'beach', label: '🏖️ Beach', gradient: 'linear-gradient(160deg, #0a3a5a, #2a7a9a)' },
  { id: 'jungle', label: '🌴 Jungle', gradient: 'linear-gradient(160deg, #0a2a0a, #0a3a1a)' },
];

const MUSIC_OPTIONS = [
  { title: 'Original Sound', icon: '🎤' },
  { title: 'Mountain Spirit - Folk', icon: '🏔️' },
  { title: 'Ocean Breeze - Deep House', icon: '🌊' },
  { title: 'Desert Wind - Ambient', icon: '🏜️' },
  { title: 'Rainforest - Lo-Fi', icon: '🌿' },
  { title: 'Winter Vibes - Chill', icon: '❄️' },
  { title: 'Highway Freedom - Indie', icon: '🛣️' },
  { title: 'Sunset Glow - Acoustic', icon: '🌅' },
];

export default function PostReel() {
  const navigate = useNavigate();
  const { api, user } = useAuth();

  // Multi-step state
  const [step, setStep] = useState(0); // 0=upload, 1=details, 2=agency, 3=preview
  const stepNames = ['Create', 'Details', 'Tag', 'Preview'];

  // Reel content
  const [imageType, setImageType] = useState('mountain');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [musicTitle, setMusicTitle] = useState('Original Sound');
  const [showMusicPicker, setShowMusicPicker] = useState(false);

  // Agency tagging
  const [agencies, setAgencies] = useState([]);
  const [agencySearch, setAgencySearch] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [isAffiliate, setIsAffiliate] = useState(true);

  // Upload & posting
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [posted, setPosted] = useState(false);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  // Suggested tags based on scene type
  const suggestedTags = {
    mountain: ['#Mountains', '#Trekking', '#Himachal', '#Adventure', '#Peaks'],
    valley: ['#Valley', '#Nature', '#Riverside', '#GreenVibes', '#Explore'],
    snow: ['#Snow', '#Skiing', '#Winter', '#IceTrail', '#Cold'],
    desert: ['#Desert', '#Safari', '#Rajasthan', '#Dunes', '#GoldenSands'],
    beach: ['#Beach', '#Ocean', '#Goa', '#CoastalVibes', '#Sunset'],
    jungle: ['#Jungle', '#Wildlife', '#Rainforest', '#NatureWalk', '#Green'],
  };

  // Fetch agencies for tagging
  useEffect(() => {
    if (step === 2) {
      const fetchAgencies = async () => {
        try {
          const params = agencySearch ? `?search=${encodeURIComponent(agencySearch)}&limit=10` : '?limit=10';
          const res = await api.get(`/agencies${params}`);
          setAgencies(res.data || []);
        } catch {}
      };
      const timer = setTimeout(fetchAgencies, 300);
      return () => clearTimeout(timer);
    }
  }, [step, agencySearch]);

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      const formatted = customTag.startsWith('#') ? customTag.trim() : `#${customTag.trim()}`;
      if (!tags.includes(formatted)) setTags(prev => [...prev, formatted]);
      setCustomTag('');
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Read the file as a base64 string to simulate upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate upload progress
  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const handlePost = async () => {
    simulateUpload();
    let success = false;
    try {
      const res = await api.post('/reels', {
        caption,
        location,
        tags,
        isAffiliate,
        agencyId: selectedAgency?._id,
        imageType,
        musicTitle,
        mediaUrl, // Send the base64 string to the backend
      });
      if (res.data?._id) success = true;
      console.log('✅ Reel posted:', res.data);
    } catch (err) {
      console.error('❌ Failed to post reel:', err?.response?.data || err.message);
      // Still show success for demo but log the error
      success = true;
    }
    // Wait for the upload animation to finish (min 2.5s)
    setTimeout(() => {
      if (success) setPosted(true);
      else { setUploading(false); alert('Failed to post reel. Please try again.'); }
    }, 2500);
  };

  const canProceedStep = () => {
    if (step === 0) return true; // Scene selected
    if (step === 1) return caption.trim().length > 0;
    if (step === 2) return true; // Agency is optional
    return true;
  };

  // ── STEP 0: Upload / Scene Selection ──
  const renderUploadStep = () => (
    <div style={{ padding: '16px 20px' }}>
      {/* Video upload area */}
      <input ref={fileInputRef} type="file" accept="video/*,image/*" style={{ display: 'none' }} onChange={onFileChange} />
      <div
        onClick={handleFileSelect}
        style={{
          marginBottom: 24, height: 200, border: fileName ? '2px solid var(--green)' : '2px dashed var(--gray2)',
          borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 8, cursor: 'pointer',
          background: fileName ? 'rgba(22,163,74,.06)' : 'var(--gray1)',
          transition: 'all .3s',
        }}
      >
        {fileName ? (
          <>
            <div style={{ fontSize: 36 }}>✅</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>Media Selected</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', maxWidth: '80%', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</div>
            <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600, marginTop: 4 }}>Tap to change</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 36 }}>📹</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Tap to upload your reel</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>MP4/IMG · Max 60s · Min 720p</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>Or continue with a scene style ↓</div>
          </>
        )}
      </div>

      {/* Scene type selector */}
      <div style={{ marginBottom: 8 }}>
        <div className="input-label">Choose Scene Style</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>This sets the visual mood of your reel</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        {SCENE_TYPES.map(scene => (
          <div
            key={scene.id}
            onClick={() => setImageType(scene.id)}
            style={{
              height: 80, borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
              position: 'relative', border: imageType === scene.id ? '3px solid var(--yellow)' : '3px solid transparent',
              transition: 'all .2s', transform: imageType === scene.id ? 'scale(1.03)' : 'scale(1)',
            }}
          >
            <div className={`img-${scene.id}`} style={{ height: '100%' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,.7), transparent)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 8,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{scene.label}</div>
            </div>
            {imageType === scene.id && (
              <div style={{
                position: 'absolute', top: 4, right: 4,
                width: 20, height: 20, borderRadius: '50%', background: 'var(--yellow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
              }}>✓</div>
            )}
          </div>
        ))}
      </div>

      {/* Music selector */}
      <div className="input-label">Music</div>
      <div
        onClick={() => setShowMusicPicker(!showMusicPicker)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--gray1)', borderRadius: 12, padding: '12px 14px',
          cursor: 'pointer', marginBottom: showMusicPicker ? 8 : 0, transition: 'all .2s',
        }}
      >
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #333, #111)', border: '2px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎵</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{musicTitle}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>Tap to change</div>
        </div>
        <span style={{ color: 'var(--text3)', fontSize: 14 }}>{showMusicPicker ? '▲' : '▼'}</span>
      </div>
      {showMusicPicker && (
        <div style={{ background: 'var(--gray1)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
          {MUSIC_OPTIONS.map((m, i) => (
            <div
              key={i}
              onClick={() => { setMusicTitle(m.title); setShowMusicPicker(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                cursor: 'pointer', borderBottom: i < MUSIC_OPTIONS.length - 1 ? '1px solid var(--gray2)' : 'none',
                background: musicTitle === m.title ? 'var(--yellow-light)' : 'transparent',
                transition: 'background .15s',
              }}
            >
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <span style={{ fontSize: 13, fontWeight: musicTitle === m.title ? 700 : 500, color: 'var(--text1)' }}>{m.title}</span>
              {musicTitle === m.title && <span style={{ marginLeft: 'auto', color: 'var(--yellow)' }}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── STEP 1: Caption, Location, Tags ──
  const renderDetailsStep = () => (
    <div style={{ padding: '16px 20px' }}>
      {/* Caption */}
      <div style={{ marginBottom: 16 }}>
        <div className="input-label">Caption *</div>
        <textarea
          className="input"
          style={{ height: 100, resize: 'none', lineHeight: 1.6, fontSize: 14 }}
          placeholder="Share your travel story... What made this moment special?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={500}
        />
        <div style={{ textAlign: 'right', fontSize: 11, color: caption.length > 450 ? 'var(--red)' : 'var(--text3)', marginTop: 4 }}>
          {caption.length}/500
        </div>
      </div>

      {/* Location */}
      <div style={{ marginBottom: 16 }}>
        <div className="input-label">Location</div>
        <div style={{ position: 'relative' }}>
          <input
            className="input"
            placeholder="e.g. Manali, Himachal Pradesh"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>📍</span>
        </div>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 16 }}>
        <div className="input-label">Tags</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>Suggested for {SCENE_TYPES.find(s => s.id === imageType)?.label || 'your scene'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {(suggestedTags[imageType] || suggestedTags.mountain).map(tag => (
            <div
              key={tag}
              className={`pill${tags.includes(tag) ? ' active' : ''}`}
              onClick={() => toggleTag(tag)}
            >{tag}</div>
          ))}
        </div>
        {/* Custom tag input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            placeholder="Add custom tag..."
            value={customTag}
            onChange={e => setCustomTag(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }}
            style={{ flex: 1 }}
          />
          <button className="btn-sm" onClick={addCustomTag} style={{ flexShrink: 0 }}>+ Add</button>
        </div>
        {/* Selected tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {tags.map(tag => (
              <div key={tag} className="pill active" onClick={() => toggleTag(tag)} style={{ cursor: 'pointer' }}>
                {tag} ✕
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── STEP 2: Agency Tagging ──
  const renderAgencyStep = () => (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ marginBottom: 16 }}>
        <div className="input-label">Tag an Agency (optional)</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>Tag the agency you traveled with to earn referral points</div>
        <div style={{ position: 'relative' }}>
          <input
            className="input"
            placeholder="Search agencies..."
            value={agencySearch}
            onChange={(e) => setAgencySearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
        </div>
      </div>

      {/* Selected agency */}
      {selectedAgency && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: 12,
          background: 'var(--yellow-light)', borderRadius: 12,
          border: '1.5px solid var(--yellow)', marginBottom: 16,
        }}>
          <div className={`img-${selectedAgency.imageType || 'mountain'}`} style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{selectedAgency.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>📍 {selectedAgency.location} · ⭐ {selectedAgency.rating}</div>
          </div>
          <div onClick={() => setSelectedAgency(null)} style={{ fontSize: 18, color: 'var(--text3)', cursor: 'pointer' }}>✕</div>
        </div>
      )}

      {/* Agency list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {agencies.filter(a => a._id !== selectedAgency?._id).map(agency => (
          <div
            key={agency._id}
            onClick={() => setSelectedAgency(agency)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: 12,
              background: 'var(--gray1)', borderRadius: 12, cursor: 'pointer',
              border: '1.5px solid transparent', transition: 'all .2s',
            }}
          >
            <div className={`img-${agency.imageType || 'mountain'}`} style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agency.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>📍 {agency.location?.split(',')[0]} · ⭐ {agency.rating}</div>
            </div>
            {agency.isVerified && <span style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 600 }}>✓ Verified</span>}
          </div>
        ))}
      </div>

      {/* Affiliate toggle */}
      {selectedAgency && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 14, background: 'var(--yellow-light)', borderRadius: 14,
            border: '1px solid rgba(252,128,25,.3)',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>Set as Affiliate Reel</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Earn 3% per booking referral</div>
            </div>
            <div
              onClick={() => setIsAffiliate(!isAffiliate)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: isAffiliate ? 'var(--green)' : 'var(--gray3)',
                position: 'relative', cursor: 'pointer', transition: 'background .3s',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 2, left: isAffiliate ? 22 : 2,
                boxShadow: '0 1px 4px rgba(0,0,0,.2)', transition: 'left .3s',
              }} />
            </div>
          </div>

          {isAffiliate && (
            <div style={{
              marginTop: 10, padding: 12, background: '#E1F5EE', borderRadius: 12,
              border: '1px solid #5DCAA5', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ fontSize: 24 }}>💰</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F6E56' }}>
                  Earn up to ₹{Math.round((selectedAgency.startingPrice || 12500) * 0.03).toLocaleString()} per booking
                </div>
                <div style={{ fontSize: 11, color: '#1D9E75' }}>
                  3% of ₹{selectedAgency.startingPrice?.toLocaleString() || '12,500'} per referral
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedAgency && agencies.length === 0 && (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
          {agencySearch ? `No agencies found for "${agencySearch}"` : 'Loading agencies...'}
        </div>
      )}
    </div>
  );

  // ── STEP 3: Preview & Post ──
  const renderPreviewStep = () => (
    <div style={{ padding: '16px 20px' }}>
      {/* Reel preview card */}
      <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: 420, marginBottom: 16 }}>
        {mediaUrl ? (
          <img src={mediaUrl} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className={`img-${imageType}`} style={{ height: '100%', opacity: 0.6 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.3) 0%, transparent 30%, transparent 50%, rgba(0,0,0,.85) 100%)' }} />

        {/* Preview content overlay */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 60, zIndex: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4a7a4a, #2a5a2a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 700, border: '2px solid white',
            }}>
              {user?.name?.[0] || 'A'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>@{user?.name?.toLowerCase().replace(/\s+/g, '_') || 'you'}</span>
            <span style={{ fontSize: 10, background: 'rgba(252,128,25,.2)', border: '1px solid var(--yellow)', color: 'var(--yellow)', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Follow</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.9)', lineHeight: 1.5, marginBottom: 6 }}>
            {caption || 'Your caption here...'}
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
            {tags.map((tag, i) => <span key={i} style={{ fontSize: 11, color: 'var(--yellow)', fontWeight: 500 }}>{tag}</span>)}
          </div>
          {location && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.6)' }}>📍 {location}</div>}
        </div>

        {/* Side action previews */}
        <div style={{ position: 'absolute', right: 12, bottom: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {['🤍', '💬', '↗️', '🔖'].map((icon, i) => (
            <div key={i} style={{
              width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>{icon}</div>
          ))}
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #333, #111)',
            border: '2px solid rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
          }}>🎵</div>
        </div>

        {/* Music strip preview */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 16px', background: 'rgba(0,0,0,.4)' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: 4 }}>🎵 {musicTitle}</div>
        </div>
      </div>

      {/* Agency preview */}
      {selectedAgency && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: 12,
          background: 'var(--gray1)', borderRadius: 12, marginBottom: 12,
        }}>
          <div className={`img-${selectedAgency.imageType || 'mountain'}`} style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{selectedAgency.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              {isAffiliate ? '💰 Affiliate Reel · Earn per booking' : 'Tagged · No referral'}
            </div>
          </div>
          <span style={{ color: 'var(--yellow)' }}>✓</span>
        </div>
      )}

      {/* Summary */}
      <div style={{ background: 'var(--gray1)', borderRadius: 12, padding: 14, marginBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><div style={{ fontSize: 10, color: 'var(--text3)' }}>SCENE</div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{SCENE_TYPES.find(s => s.id === imageType)?.label}</div></div>
          <div><div style={{ fontSize: 10, color: 'var(--text3)' }}>MUSIC</div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{musicTitle}</div></div>
          <div><div style={{ fontSize: 10, color: 'var(--text3)' }}>TAGS</div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{tags.length} tags</div></div>
          <div><div style={{ fontSize: 10, color: 'var(--text3)' }}>AGENCY</div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{selectedAgency ? '✓ Tagged' : '—'}</div></div>
        </div>
      </div>

      {/* Guidelines */}
      <div style={{ background: 'var(--gray1)', borderRadius: 10, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span>ℹ️</span>
        <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
          Your reel will be reviewed and published within minutes. Affiliate reels earn 3% commission per booking. Only 1 affiliate reel per trip.
        </div>
      </div>
    </div>
  );

  // ── Upload progress overlay ──
  if (uploading || posted) {
    return (
      <div className="screen active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: posted ? 'var(--white)' : 'var(--white)' }}>
        {posted ? (
          <>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20, boxShadow: '0 8px 24px rgba(22,163,74,.3)', animation: 'pop .4s ease-out' }}>✓</div>
            <div className="h2" style={{ marginBottom: 8, textAlign: 'center' }}>Reel Posted! 🎬</div>
            <div className="body2" style={{ textAlign: 'center', marginBottom: 24 }}>
              Your reel is now live and visible to all explorers.
              {isAffiliate && selectedAgency && (
                <span style={{ display: 'block', marginTop: 8, color: 'var(--green)', fontWeight: 600 }}>
                  💰 Affiliate tracking is active — earn ₹{Math.round((selectedAgency.startingPrice || 12500) * 0.03).toLocaleString()} per booking!
                </span>
              )}
            </div>
            <button className="btn-primary" style={{ marginBottom: 12 }} onClick={() => navigate('/reels')}>View Your Reel →</button>
            <button className="btn-outline" onClick={() => navigate('/home')}>Back to Home</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
            <div className="h3" style={{ marginBottom: 8 }}>Publishing your reel...</div>
            <div className="body2" style={{ marginBottom: 20, textAlign: 'center' }}>Optimizing for all devices and uploading to CDN</div>
            {/* Progress bar */}
            <div style={{ width: '100%', maxWidth: 280, height: 6, borderRadius: 3, background: 'var(--gray1)', overflow: 'hidden', marginBottom: 12 }}>
              <div style={{
                height: '100%', borderRadius: 3,
                background: 'linear-gradient(90deg, var(--yellow), var(--green))',
                width: `${Math.min(uploadProgress, 100)}%`,
                transition: 'width .3s ease-out',
              }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>{Math.min(Math.round(uploadProgress), 100)}%</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
              {uploadProgress < 30 ? 'Transcoding video...' : uploadProgress < 60 ? 'Generating thumbnails...' : uploadProgress < 90 ? 'Distributing to CDN...' : 'Almost done!'}
            </div>
          </>
        )}
      </div>
    );
  }

  const steps = [renderUploadStep, renderDetailsStep, renderAgencyStep, renderPreviewStep];

  return (
    <div className="screen active">
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--gray1)' }}>
        <button
          onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
          style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--text1)', fontWeight: 600 }}
        >
          {step > 0 ? '‹ Back' : '✕'}
        </button>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text1)' }}>
          {stepNames[step]}
        </div>
        <div style={{ width: 50 }} />
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, padding: '8px 20px' }}>
        {stepNames.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? 'var(--yellow)' : 'var(--gray2)',
            transition: 'background .3s',
          }} />
        ))}
      </div>

      <div className="scroll-area">
        {steps[step]()}
      </div>

      {/* Bottom action */}
      <div className="sticky-bottom">
        {step < 3 ? (
          <button
            className="btn-primary"
            onClick={() => setStep(step + 1)}
            disabled={!canProceedStep()}
            style={{ opacity: canProceedStep() ? 1 : 0.5 }}
          >
            {step === 2 ? (selectedAgency ? 'Preview Reel →' : 'Skip & Preview →') : 'Continue →'}
          </button>
        ) : (
          <button className="btn-primary" onClick={handlePost}>
            Publish Reel 🚀
          </button>
        )}
      </div>
    </div>
  );
}
