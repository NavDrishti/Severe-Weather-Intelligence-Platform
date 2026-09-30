import React, { useState } from 'react';
import { Server, Sliders, CheckCircle, Languages, Sparkles, Send } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import { translateDynamicText } from '../services/translationService';

export const AdminPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [dataMode, setDataMode] = useState<'demo' | 'replay' | 'live'>('demo');
  const [cloudburstThreshold, setCloudburstThreshold] = useState(100);
  const [lightningJumpThreshold, setLightningJumpThreshold] = useState(35);
  const [hailReflectivityThreshold, setHailReflectivityThreshold] = useState(50);
  const [downburstShearThreshold, setDownburstShearThreshold] = useState(25);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Gemini & Translation API configuration state
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('navdrishti_gemini_api_key') || '';
  });
  const [testText, setTestText] = useState('Severe thunderstorm and flash flood warning for Pune metropolitan area.');
  const [testResult, setTestResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTestTranslation = async () => {
    if (!testText.trim()) return;
    setIsTranslating(true);
    setTestResult('');
    try {
      const translated = await translateDynamicText(testText, language === 'hi' ? 'en' : 'hi', language);
      setTestResult(translated);
    } catch {
      setTestResult('Translation failed. Check network or API configuration.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiApiKey) {
      localStorage.setItem('navdrishti_gemini_api_key', geminiApiKey.trim());
    } else {
      localStorage.removeItem('navdrishti_gemini_api_key');
    }
    setSaveStatus('System configuration updated successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Administrative Control & System Configuration</h1>
        <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)' }}>
          Configure ingestion modes, hazard detection thresholds, AI translation providers, and sensor parameters
        </p>
      </div>

      {saveStatus && (
        <div style={{ background: 'var(--status-green-bg)', color: 'var(--status-green)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          <span>{saveStatus}</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Bilingual Language & Open-Source / Gemini AI Translation */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Languages size={18} color="var(--brand-teal)" />
            <span>Bilingual Language & AI Translation Engine (English & Hindi)</span>
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Switch active language across the platform or configure Google Gemini and free Open-Source (MyMemory) translation APIs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Active Language Toggle */}
            <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Active Platform Language</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: language === 'en' ? '2px solid var(--brand-teal)' : '1px solid var(--border-color)',
                    background: language === 'en' ? 'var(--brand-teal)' : 'var(--bg-surface)',
                    color: language === 'en' ? '#FFFFFF' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: 'var(--font-sm)',
                    cursor: 'pointer'
                  }}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: language === 'hi' ? '2px solid var(--brand-teal)' : '1px solid var(--border-color)',
                    background: language === 'hi' ? 'var(--brand-teal)' : 'var(--bg-surface)',
                    color: language === 'hi' ? '#FFFFFF' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: 'var(--font-sm)',
                    cursor: 'pointer'
                  }}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                Zero-latency instant rendering powered by built-in meteorological dictionary.
              </span>
            </div>

            {/* Optional Gemini API Key */}
            <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: 'var(--font-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="#60A5FA" />
                <span>Google Gemini API Key (Optional)</span>
              </label>
              <input
                type="password"
                placeholder="AIzaSy... (leave blank to use Free Open-Source API)"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-xs)',
                  fontFamily: 'monospace'
                }}
              />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                Active Fallback: <strong>Free Open-Source MyMemory REST API</strong>
              </span>
            </div>
          </div>

          {/* Live Translation Test Bench */}
          <div style={{ marginTop: '16px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Live AI Translation Test Bench
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter text to translate..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-sm)'
                }}
              />
              <button
                type="button"
                onClick={handleTestTranslation}
                disabled={isTranslating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--brand-blue)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 'var(--font-sm)',
                  cursor: 'pointer'
                }}
              >
                <Send size={14} className={isTranslating ? 'animate-spin' : ''} />
                <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
              </button>
            </div>
            {testResult && (
              <div style={{ marginTop: '10px', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', fontSize: 'var(--font-sm)' }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'block' }}>Result:</span>
                <strong>{testResult}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Operational Data Mode Selection */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="var(--brand-teal)" />
            <span>Operational Data Pipeline Mode</span>
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Toggle between deterministic SIH hackathon evaluation mode, benchmark replay, and live official feeds.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              {
                id: 'demo',
                title: 'Demo Mode (Recommended)',
                desc: 'Deterministic seeded dataset. Perfect for presentations, screenshots, and evaluation without network dependencies.'
              },
              {
                id: 'replay',
                title: 'Replay Mode',
                desc: 'Simulates historical extreme convective events (Pune squall, Amarnath cloudburst) with step-by-step telemetry.'
              },
              {
                id: 'live',
                title: 'Live Connector Mode',
                desc: 'Polls external IMD/MOSDAC APIs. Displays degraded alerts clearly if API credentials are not provided.'
              }
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setDataMode(m.id as any)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: dataMode === m.id ? '2px solid var(--brand-teal)' : '1px solid var(--border-color)',
                  background: dataMode === m.id ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 'var(--font-base)' }}>{m.title}</strong>
                  {dataMode === m.id && <CheckCircle size={14} color="var(--brand-teal)" />}
                </div>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Threshold Sliders */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--brand-blue)" />
            <span>Meteorological Detection Thresholds</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '14px' }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: '6px' }}>
                <span>Cloudburst Instantaneous Rain Rate</span>
                <strong>{cloudburstThreshold} mm/hr</strong>
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={cloudburstThreshold}
                onChange={(e) => setCloudburstThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-teal)' }}
              />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Official WMO/IMD standard: 100 mm/hr</span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: '6px' }}>
                <span>Lightning Jump Surge Trigger</span>
                <strong>{lightningJumpThreshold} strikes/15m</strong>
              </label>
              <input
                type="range"
                min="15"
                max="80"
                value={lightningJumpThreshold}
                onChange={(e) => setLightningJumpThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#EF4444' }}
              />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Indicates rapid updraft convective surge</span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: '6px' }}>
                <span>Hail Reflectivity Aloft Threshold</span>
                <strong>{hailReflectivityThreshold} dBZ</strong>
              </label>
              <input
                type="range"
                min="40"
                max="65"
                value={hailReflectivityThreshold}
                onChange={(e) => setHailReflectivityThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B' }}
              />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Measured above freezing (0°C) level</span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: '6px' }}>
                <span>Downburst Radial Shear Velocity</span>
                <strong>{downburstShearThreshold} m/s</strong>
              </label>
              <input
                type="range"
                min="15"
                max="45"
                value={downburstShearThreshold}
                onChange={(e) => setDownburstShearThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Divergence across Doppler velocity dipoles</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--brand-teal)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 'var(--font-base)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            Apply Configuration Updates
          </button>
        </div>
      </form>
    </div>
  );
};
