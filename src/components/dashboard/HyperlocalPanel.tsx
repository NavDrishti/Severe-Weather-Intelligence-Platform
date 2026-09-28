import React, { useState } from 'react';
import { LocationCoordinates } from '../../types/weather';
import { HOURLY_TIMELINE } from '../../data/mockData';
import { MapPin, Zap, CloudHail, CloudRain, Wind, Clock, ArrowUpRight, Maximize2, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HyperlocalPanelProps {
  location: LocationCoordinates;
  onOpenLocationSearch?: () => void;
  selectedHorizonIndex?: number;
}

export const HyperlocalPanel: React.FC<HyperlocalPanelProps> = ({
  location,
  onOpenLocationSearch,
  selectedHorizonIndex = 0
}) => {
  const [expandedPreview, setExpandedPreview] = useState<'radar' | 'lightning' | null>(null);

  // Dynamic values adjusted for the selected timeline horizon
  const currentHorizon = HOURLY_TIMELINE[selectedHorizonIndex] || HOURLY_TIMELINE[0];

  const probabilities = {
    lightning: currentHorizon.lightning_prob,
    hail: currentHorizon.hail_prob,
    cloudburst: currentHorizon.cloudburst_prob,
    downburst: currentHorizon.downburst_prob
  };

  return (
    <div className="hyperlocal-panel-card" role="region" aria-label="Hyperlocal Intelligence">
      {/* Location Header */}
      <div className="location-header-box">
        <div className="location-title-group">
          <h2>
            <MapPin size={18} color="var(--brand-teal)" />
            <span>{location.name}, {location.state}</span>
          </h2>
          <div className="location-coords">
            {location.lat.toFixed(2)}° N • {location.lon.toFixed(2)}° E • {location.elevation_m || 560}m ASL
          </div>
        </div>
        <button
          onClick={onOpenLocationSearch}
          style={{
            padding: '6px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)'
          }}
          title="Search other Indian city or district"
        >
          <Search size={15} />
        </button>
      </div>

      {/* Hazard Probability */}
      <div className="hazard-prob-section">
        <div className="section-caption">Hazard Probability ({currentHorizon.horizon})</div>

        {/* Lightning */}
        <div className="hazard-prob-row">
          <div className="hazard-prob-label">
            <Zap size={14} color="#F87171" />
            <span>Lightning</span>
          </div>
          <div className="hazard-prob-bar-container">
            <div
              className="hazard-prob-bar-fill"
              style={{ width: `${probabilities.lightning}%`, backgroundColor: '#087F8C' }}
            />
          </div>
          <div className="hazard-prob-val">{probabilities.lightning}%</div>
        </div>

        {/* Hail */}
        <div className="hazard-prob-row">
          <div className="hazard-prob-label">
            <CloudHail size={14} color="#FBBF24" />
            <span>Hail</span>
          </div>
          <div className="hazard-prob-bar-container">
            <div
              className="hazard-prob-bar-fill"
              style={{ width: `${probabilities.hail}%`, backgroundColor: '#087F8C' }}
            />
          </div>
          <div className="hazard-prob-val">{probabilities.hail}%</div>
        </div>

        {/* Cloudburst */}
        <div className="hazard-prob-row">
          <div className="hazard-prob-label">
            <CloudRain size={14} color="#38BDF8" />
            <span>Cloudburst</span>
          </div>
          <div className="hazard-prob-bar-container">
            <div
              className="hazard-prob-bar-fill"
              style={{ width: `${probabilities.cloudburst}%`, backgroundColor: '#087F8C' }}
            />
          </div>
          <div className="hazard-prob-val">{probabilities.cloudburst}%</div>
        </div>

        {/* Downburst */}
        <div className="hazard-prob-row">
          <div className="hazard-prob-label">
            <Wind size={14} color="#34D399" />
            <span>Downburst</span>
          </div>
          <div className="hazard-prob-bar-container">
            <div
              className="hazard-prob-bar-fill"
              style={{ width: `${probabilities.downburst}%`, backgroundColor: '#087F8C' }}
            />
          </div>
          <div className="hazard-prob-val">{probabilities.downburst}%</div>
        </div>
      </div>

      {/* Forecast Confidence */}
      <div className="confidence-box">
        <div className="confidence-header">
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Forecast Confidence</span>
          <span style={{ fontWeight: 700, color: 'var(--brand-teal)' }}>75% • Medium</span>
        </div>
        <div className="confidence-meter">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`confidence-dot ${i < 9 ? 'filled' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Storm Arrival Window */}
      <div className="arrival-window-box">
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
          Storm Arrival Window
        </div>
        <div className="time-window">
          <Clock size={15} color="var(--brand-teal)" />
          <span>17:30 – 18:30 IST</span>
        </div>
        <div className="relative-text">
          ≈ 15 min – 1h 45 min from now (ETA based on cell track)
        </div>
      </div>

      {/* Data Freshness */}
      <div className="freshness-row">
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Data Freshness: </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Just now</span>
        </div>
        <Link
          to="/data-health"
          className="freshness-badge"
          style={{ textDecoration: 'none' }}
          title="Inspect data pipeline & radar latency"
        >
          <span>↑ Live feed</span>
        </Link>
      </div>

      {/* Evidence Signals (3) */}
      <div className="evidence-section">
        <div className="section-caption">Evidence Signals (3)</div>
        <div className="evidence-item">
          <Zap size={14} className="evidence-icon" />
          <div>
            <strong>Radar reflectivity increasing:</strong> Convective core intensified +4 dBZ over Lonavala axis.
          </div>
        </div>
        <div className="evidence-item">
          <Zap size={14} className="evidence-icon" />
          <div>
            <strong>Lightning activity increasing:</strong> Flash count spiked to 85 strikes within 25 km radius.
          </div>
        </div>
        <div className="evidence-item">
          <Zap size={14} className="evidence-icon" />
          <div>
            <strong>Storm approaching from the northwest:</strong> Vector 65° at 38 km/h on direct intercept course.
          </div>
        </div>
      </div>

      {/* Mini-maps at bottom of Right Panel */}
      <div className="mini-maps-grid">
        {/* Radar Reflectivity Thumbnail */}
        <div
          className="mini-map-card"
          onClick={() => setExpandedPreview('radar')}
          title="Click to expand Radar Reflectivity"
        >
          <svg className="mini-map-canvas" viewBox="0 0 120 75" preserveAspectRatio="none">
            <rect width="120" height="75" fill="#0F172A" />
            {/* Contours */}
            <circle cx="60" cy="38" r="30" fill="none" stroke="#1E293B" strokeWidth="0.8" />
            <path d="M 20,55 Q 50,20 85,25 T 110,15" fill="none" stroke="#22C55E" strokeWidth="6" opacity="0.6" />
            <path d="M 35,48 Q 60,25 80,30" fill="none" stroke="#EAB308" strokeWidth="5" opacity="0.8" />
            <path d="M 45,42 Q 62,28 72,32" fill="none" stroke="#EF4444" strokeWidth="3" opacity="0.9" />
          </svg>
          <div className="mini-map-caption">
            <span>Radar Reflectivity</span>
          </div>
        </div>

        {/* Lightning Density Thumbnail */}
        <div
          className="mini-map-card"
          onClick={() => setExpandedPreview('lightning')}
          title="Click to expand Lightning Density"
        >
          <svg className="mini-map-canvas" viewBox="0 0 120 75" preserveAspectRatio="none">
            <rect width="120" height="75" fill="#0F172A" />
            {/* Point cluster */}
            <circle cx="50" cy="35" r="1.5" fill="#F87171" />
            <circle cx="55" cy="32" r="2" fill="#F87171" />
            <circle cx="52" cy="40" r="1.8" fill="#F87171" />
            <circle cx="68" cy="25" r="2.2" fill="#F87171" />
            <circle cx="72" cy="22" r="1.5" fill="#F87171" />
            <circle cx="45" cy="44" r="1.2" fill="#F87171" />
            <circle cx="60" cy="38" r="18" fill="rgba(239, 68, 68, 0.15)" />
          </svg>
          <div className="mini-map-caption">
            <span>Lightning Density</span>
          </div>
        </div>
      </div>

      {/* Expand Preview Modal */}
      {expandedPreview && (
        <div className="modal-overlay" onClick={() => setExpandedPreview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {expandedPreview === 'radar' ? 'Doppler Weather Radar (DWR) Reflectivity' : 'Lightning Density Heatmap'}
              </h3>
              <button onClick={() => setExpandedPreview(null)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ background: '#0B1220', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center' }}>
              <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto' }}>
                <rect width="400" height="240" fill="#0B1220" />
                <circle cx="200" cy="120" r="90" fill="none" stroke="#1E293B" strokeWidth="1" />
                <circle cx="200" cy="120" r="60" fill="none" stroke="#1E293B" strokeWidth="1" />
                <circle cx="200" cy="120" r="30" fill="none" stroke="#1E293B" strokeWidth="1" />
                {expandedPreview === 'radar' ? (
                  <>
                    <path d="M 80,180 Q 180,70 300,90 T 380,50" fill="none" stroke="#22C55E" strokeWidth="24" opacity="0.6" strokeLinecap="round" />
                    <path d="M 120,155 Q 200,85 280,105" fill="none" stroke="#EAB308" strokeWidth="18" opacity="0.8" strokeLinecap="round" />
                    <path d="M 160,135 Q 210,95 250,110" fill="none" stroke="#EF4444" strokeWidth="12" opacity="0.9" strokeLinecap="round" />
                    <path d="M 180,125 Q 215,100 235,108" fill="none" stroke="#A855F7" strokeWidth="6" opacity="1" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx="200" cy="110" r="55" fill="rgba(239, 68, 68, 0.25)" />
                    <circle cx="205" cy="105" r="30" fill="rgba(239, 68, 68, 0.45)" />
                    <circle cx="202" cy="108" r="14" fill="rgba(239, 68, 68, 0.75)" />
                    {[...Array(30)].map((_, i) => (
                      <circle
                        key={i}
                        cx={170 + (i * 2.5) % 65}
                        cy={80 + (i * 3.8) % 55}
                        r={2}
                        fill="#F87171"
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Source: IMD Doppler Weather Radar Network & LIDEN Ground Sensors. Regridded to common 2.5 km operational domain.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
