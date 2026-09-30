import React from 'react';
import { StormCell } from '../../types/weather';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StormDetailDrawerProps {
  storm: StormCell | null;
  onClose: () => void;
}

export const StormDetailDrawer: React.FC<StormDetailDrawerProps> = ({ storm, onClose }) => {
  const navigate = useNavigate();

  if (!storm) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        width: '380px',
        maxHeight: 'calc(100vh - 100px)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1500,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: 'slide-in 0.2s ease-out'
      }}
      role="dialog"
      aria-label="Storm Details"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: 'var(--brand-teal)',
              background: 'var(--bg-subtle)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}
          >
            {storm.id}
          </span>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginTop: '4px' }}>{storm.name}</h3>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{storm.region}</div>
        </div>
        <button onClick={onClose} style={{ padding: '4px', color: 'var(--text-muted)' }} aria-label="Close drawer">
          <X size={18} />
        </button>
      </div>

      {/* Primary Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: 'var(--bg-subtle)',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-sm)'
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Severity</span>
          <strong style={{ color: storm.severity === 'Very High' ? '#EF4444' : '#F59E0B' }}>
            {storm.severity}
          </strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Intensity</span>
          <strong>{storm.max_reflectivity_dbz} dBZ</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Motion Vector</span>
          <strong>{storm.movement} • {storm.speed_kmph} km/h</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Growth Status</span>
          <strong style={{ textTransform: 'capitalize' }}>{storm.growth_status}</strong>
        </div>
      </div>

      {/* Arrival & Target Window */}
      <div
        style={{
          borderLeft: '3px solid var(--brand-teal)',
          background: 'var(--bg-subtle)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
          ESTIMATED TIME OF ARRIVAL (ETA)
        </div>
        <div style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--brand-teal)', marginTop: '2px' }}>
          {storm.eta}
        </div>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
          Target Window: {storm.eta_window} (Nearest: {storm.nearest_city})
        </div>
      </div>

      {/* Evidence Signals */}
      <div>
        <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
          Evidence Signals ({storm.evidence.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {storm.evidence.map((ev, i) => (
            <div
              key={i}
              style={{
                fontSize: 'var(--font-xs)',
                background: 'var(--bg-subtle)',
                padding: '6px 8px',
                borderRadius: '4px',
                lineHeight: 1.3
              }}
            >
              • {ev}
            </div>
          ))}
        </div>
      </div>

      {/* Affected Critical Assets */}
      {storm.affected_assets && storm.affected_assets.length > 0 && (
        <div>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Affected Critical Infrastructure
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {storm.affected_assets.map((asset, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--font-xs)',
                  background: 'var(--bg-subtle)',
                  padding: '6px 8px',
                  borderRadius: '4px'
                }}
              >
                <span>{asset.name} ({asset.type})</span>
                <strong style={{ color: '#EF4444' }}>ETA {asset.eta_min}m</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Telemetry */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
        <span>Confidence: <strong>{(storm.confidence * 100).toFixed(0)}%</strong></span>
        <span>Data Completeness: <strong>{(storm.data_completeness * 100).toFixed(0)}%</strong></span>
        <span>Updated: {storm.last_updated}</span>
      </div>

      {/* Full Details Action Button */}
      <button
        onClick={() => {
          onClose();
          navigate(`/storms/${storm.id}`);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          backgroundColor: 'var(--brand-blue)',
          color: '#FFFFFF',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: 'var(--font-base)',
          marginTop: '6px'
        }}
      >
        <span>View Full Storm Trajectory</span>
        <ExternalLink size={14} />
      </button>
    </div>
  );
};
