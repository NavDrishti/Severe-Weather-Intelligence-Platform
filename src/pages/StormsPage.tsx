import React, { useState } from 'react';
import { MOCK_STORMS } from '../data/mockData';
import { StormCell } from '../types/weather';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StormDetailDrawer } from '../components/storms/StormDetailDrawer';

export const StormsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStorm, setSelectedStorm] = useState<StormCell | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredStorms = MOCK_STORMS.filter((s) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q) && !s.region.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedSeverity !== 'all' && s.severity.toLowerCase() !== selectedSeverity.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Active Storm-Cell Registry</h1>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            Real-time tracked convective clusters identified by automated TITAN/SCIT cell tracking algorithms
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '4px 10px',
                borderRadius: '3px',
                fontSize: 'var(--font-xs)',
                fontWeight: 600,
                background: viewMode === 'table' ? 'var(--brand-teal)' : 'none',
                color: viewMode === 'table' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '4px 10px',
                borderRadius: '3px',
                fontSize: 'var(--font-xs)',
                fontWeight: 600,
                background: viewMode === 'cards' ? 'var(--brand-teal)' : 'none',
                color: viewMode === 'cards' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: 'var(--bg-surface)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search storm cell by ID, region, or city name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-base)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'Very High', 'High', 'Medium'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-xs)',
                fontWeight: selectedSeverity === sev ? 700 : 500,
                background: selectedSeverity === sev ? 'var(--brand-blue)' : 'var(--bg-subtle)',
                color: selectedSeverity === sev ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {sev === 'all' ? 'All Severities' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* View: Table Mode */}
      {viewMode === 'table' ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-sm)', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Storm Cell ID</th>
                <th style={{ padding: '12px' }}>Cluster Name</th>
                <th style={{ padding: '12px' }}>Region</th>
                <th style={{ padding: '12px' }}>Intensity</th>
                <th style={{ padding: '12px' }}>Motion Vector</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Target ETA</th>
                <th style={{ padding: '12px' }}>Confidence</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStorms.map((storm) => (
                <tr key={storm.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-teal)' }}>
                    {storm.id}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{storm.name}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{storm.region}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        background: storm.severity === 'Very High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: storm.severity === 'Very High' ? '#EF4444' : '#F59E0B',
                        fontWeight: 700
                      }}
                    >
                      {storm.max_reflectivity_dbz} dBZ
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                    {storm.movement} • {storm.speed_kmph} km/h
                  </td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>
                    {storm.growth_status}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--brand-teal)' }}>
                    {storm.eta}
                  </td>
                  <td style={{ padding: '12px' }}>{(storm.confidence * 100).toFixed(0)}%</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedStorm(storm)}
                        style={{
                          padding: '4px 8px',
                          background: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--font-xs)',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => navigate(`/storms/${storm.id}`)}
                        style={{
                          padding: '4px 8px',
                          background: 'var(--brand-blue)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--font-xs)',
                          fontWeight: 600,
                          color: '#FFFFFF'
                        }}
                      >
                        Deep View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* View: Cards Mode */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filteredStorms.map((storm) => (
            <div
              key={storm.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--brand-teal)', fontFamily: 'monospace', fontWeight: 700 }}>
                    {storm.id}
                  </span>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{storm.name}</h3>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{storm.region}</span>
                </div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: storm.severity === 'Very High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: storm.severity === 'Very High' ? '#EF4444' : '#F59E0B',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 700
                  }}
                >
                  {storm.severity}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-subtle)', padding: '8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-xs)' }}>
                <div>Reflectivity: <strong>{storm.max_reflectivity_dbz} dBZ</strong></div>
                <div>Motion: <strong>{storm.movement} ({storm.speed_kmph} km/h)</strong></div>
                <div>Status: <strong style={{ textTransform: 'capitalize' }}>{storm.growth_status}</strong></div>
                <div>Confidence: <strong>{(storm.confidence * 100).toFixed(0)}%</strong></div>
              </div>

              <div style={{ borderLeft: '3px solid var(--brand-teal)', paddingLeft: '8px', fontSize: 'var(--font-xs)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Target Corridor ETA:</span>
                <strong style={{ color: 'var(--brand-teal)' }}>{storm.eta}</strong> ({storm.eta_window})
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={() => setSelectedStorm(storm)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}
                >
                  Quick Inspect
                </button>
                <button
                  onClick={() => navigate(`/storms/${storm.id}`)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: 'var(--brand-blue)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 600
                  }}
                >
                  Full Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Storm Detail Drawer */}
      <StormDetailDrawer
        storm={selectedStorm}
        onClose={() => setSelectedStorm(null)}
      />
    </div>
  );
};
