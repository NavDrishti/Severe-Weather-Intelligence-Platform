import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_STORMS } from '../data/mockData';
import { ArrowLeft, Navigation, Building2 } from 'lucide-react';

export const StormDetailPage: React.FC = () => {
  const { stormId } = useParams<{ stormId: string }>();
  const navigate = useNavigate();

  const storm = MOCK_STORMS.find(s => s.id.toLowerCase() === (stormId || '').toLowerCase()) || MOCK_STORMS[0];

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back button & Title */}
      <div>
        <button
          onClick={() => navigate('/storms')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: 'var(--font-sm)',
            color: 'var(--brand-teal)',
            fontWeight: 600,
            marginBottom: '8px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Active Storms Registry</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--font-base)', color: 'var(--brand-teal)' }}>
                {storm.id}
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-xs)',
                  fontWeight: 700,
                  background: storm.severity === 'Very High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: storm.severity === 'Very High' ? '#EF4444' : '#F59E0B'
                }}
              >
                {storm.severity} Risk
              </span>
            </div>
            <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, marginTop: '4px' }}>{storm.name}</h1>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Operational Region: {storm.region} • Nearest Met District: {storm.nearest_district}
            </p>
          </div>

          <Link
            to="/dashboard"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--brand-blue)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-base)',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Locate in GIS Dashboard
          </Link>
        </div>
      </div>

      {/* Primary Meteorological Parameters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          background: 'var(--bg-surface)',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Peak Reflectivity (dBZ)
          </span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#EF4444', marginTop: '4px' }}>
            {storm.max_reflectivity_dbz} dBZ
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Severe convective core</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Propagation Vector
          </span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--brand-teal)', marginTop: '4px' }}>
            {storm.movement}
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Speed: {storm.speed_kmph} km/h ({storm.direction_deg}°)</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Echo Tops & VIL
          </span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#60A5FA', marginTop: '4px' }}>
            {storm.echo_top_km} km
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>VIL: {storm.vil_kg_m2} kg/m²</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Estimated Arrival
          </span>
          <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {storm.eta}
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Window: {storm.eta_window}</span>
        </div>
      </div>

      {/* Trajectory Corridor & Intercept Predictions */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={18} color="var(--brand-teal)" />
          <span>Extrapolated Storm Track & Corridors (TITAN Tracking)</span>
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-sm)', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '8px' }}>Valid Time (IST)</th>
              <th style={{ padding: '8px' }}>Label / Step</th>
              <th style={{ padding: '8px' }}>Predicted Centroid (Lat, Lon)</th>
              <th style={{ padding: '8px' }}>Corridor Width</th>
              <th style={{ padding: '8px' }}>Tracking Status</th>
            </tr>
          </thead>
          <tbody>
            {storm.track.map((pt, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px', fontFamily: 'monospace', fontWeight: 600 }}>{pt.time} IST</td>
                <td style={{ padding: '8px', fontWeight: 700, color: pt.status === 'observed' ? '#EF4444' : 'var(--brand-teal)' }}>
                  {pt.label}
                </td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{pt.lat.toFixed(2)}° N, {pt.lon.toFixed(2)}° E</td>
                <td style={{ padding: '8px' }}>{i === 0 ? 'Exact Cell Boundary' : `± ${4 + i * 1.5} km Envelope`}</td>
                <td style={{ padding: '8px' }}>
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: pt.status === 'observed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(45, 212, 191, 0.15)',
                      color: pt.status === 'observed' ? '#EF4444' : 'var(--brand-teal)',
                      fontSize: 'var(--font-xs)',
                      fontWeight: 600
                    }}
                  >
                    {pt.status === 'observed' ? 'Observed Radar Echo' : 'Nowcast Extrapolation'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Affected Critical Infrastructure */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={18} color="#60A5FA" />
          <span>Vulnerable Infrastructure & Asset Exposure</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {storm.affected_assets.map((asset, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ fontSize: 'var(--font-base)' }}>{asset.name}</strong>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Category: {asset.type}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 'var(--font-base)', fontWeight: 800, color: '#EF4444' }}>
                  ETA {asset.eta_min}m
                </span>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Precautionary lead time</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
