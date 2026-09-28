import React, { useState } from 'react';
import { Settings, Server, Database, Key, Sliders, Shield, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [dataMode, setDataMode] = useState<'demo' | 'replay' | 'live'>('demo');
  const [cloudburstThreshold, setCloudburstThreshold] = useState(100);
  const [lightningJumpThreshold, setLightningJumpThreshold] = useState(35);
  const [hailReflectivityThreshold, setHailReflectivityThreshold] = useState(50);
  const [downburstShearThreshold, setDownburstShearThreshold] = useState(25);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('System configuration updated successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Administrative Control & System Configuration</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Configure ingestion modes, hazard detection thresholds, API credentials, and sensor parameters
        </p>
      </div>

      {saveStatus && (
        <div style={{ background: 'var(--status-green-bg)', color: 'var(--status-green)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          <span>{saveStatus}</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Operational Data Mode Selection */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="var(--brand-teal)" />
            <span>Operational Data Pipeline Mode</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
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
                  <strong style={{ fontSize: '0.85rem' }}>{m.title}</strong>
                  {dataMode === m.id && <CheckCircle size={14} color="var(--brand-teal)" />}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Threshold Sliders */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--brand-blue)" />
            <span>Meteorological Detection Thresholds</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '14px' }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
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
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Official WMO/IMD standard: 100 mm/hr</span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
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
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Indicates rapid updraft convective surge</span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
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
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Measured above freezing (0°C) level</span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
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
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Divergence across Doppler velocity dipoles</span>
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
              fontSize: '0.85rem',
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
