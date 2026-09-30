import React, { useState } from 'react';
import { HOURLY_TIMELINE, SEARCHABLE_LOCATIONS } from '../data/mockData';
import { Download, Info } from 'lucide-react';

export const ForecastPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Pune');
  const [activeTab, setActiveTab] = useState<'probability' | 'rain_rate' | 'lightning'>('probability');

  const locData = SEARCHABLE_LOCATIONS.find(l => l.name === selectedLocation) || SEARCHABLE_LOCATIONS[0];

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Horizon,Time_IST,Lightning_Prob,Hail_Prob,Cloudburst_Prob,Downburst_Prob,Rain_Rate_mm_hr,Regime\n' +
      HOURLY_TIMELINE.map(s => `${s.horizon},${s.time},${s.lightning_prob}%,${s.hail_prob}%,${s.cloudburst_prob}%,${s.downburst_prob}%,${s.rain_rate},${s.mode}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NavDrishti_Forecast_${selectedLocation}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Detailed Forecast Explorer</h1>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            High-resolution 0–6 hr probability profiles, rainfall accumulation, and multi-source evidence
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-sm)',
              fontWeight: 600
            }}
          >
            {SEARCHABLE_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name}, {loc.state}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-base)',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          >
            <Download size={14} />
            <span>Export Forecast (CSV)</span>
          </button>
        </div>
      </div>

      {/* Model Run Telemetry Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          background: 'var(--bg-surface)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          fontSize: 'var(--font-xs)'
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Run Identifier</span>
          <strong style={{ fontFamily: 'monospace' }}>RUN-20250520-173000</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Model Version</span>
          <strong>NavDrishti-Fusion-v1.4 (Hybrid Ensemble)</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Target Coordinates</span>
          <strong style={{ fontFamily: 'monospace' }}>{locData.lat}° N, {locData.lon}° E</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Data Completeness</span>
          <strong style={{ color: 'var(--status-green)' }}>94.2% (Pass)</strong>
        </div>
      </div>

      {/* Forecast Chart Panel */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Chart Header & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'probability', label: 'Hazard Probability (%)' },
              { id: 'rain_rate', label: 'Rainfall Intensity (mm/hr)' },
              { id: 'lightning', label: 'Lightning Strike Density' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  backgroundColor: activeTab === tab.id ? 'var(--brand-teal)' : 'var(--bg-subtle)',
                  color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} />
            <span>Shaded bands indicate 90% probabilistic confidence intervals</span>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div style={{ position: 'relative', width: '100%', height: '280px' }}>
          <svg viewBox="0 0 800 240" style={{ width: '100%', height: '100%' }}>
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = 200 - (val * 1.6);
              return (
                <g key={val}>
                  <line x1="40" y1={y} x2="780" y2={y} stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="3 3" />
                  <text x="32" y={y + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end" fontFamily="monospace">
                    {val}{activeTab === 'probability' ? '%' : (activeTab === 'rain_rate' ? 'mm' : '/km²')}
                  </text>
                </g>
              );
            })}

            {/* Confidence Uncertainty Envelope (Widens with time) */}
            <path
              d="M 50,70 Q 150,50 300,90 T 550,150 T 750,185 L 750,210 T 550,180 T 300,120 T 50,90 Z"
              fill="rgba(45, 212, 191, 0.12)"
            />

            {/* Lightning Probability Curve */}
            <path
              d="M 50,64 Q 120,56 200,72 T 320,105 T 450,140 T 600,170 T 750,187"
              fill="none"
              stroke="#F87171"
              strokeWidth="2.5"
            />

            {/* Hail Probability Curve */}
            <path
              d="M 50,136 Q 120,128 200,144 T 320,165 T 450,184 T 600,195 T 750,200"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* Cloudburst Probability Curve */}
            <path
              d="M 50,152 Q 120,144 200,136 T 320,155 T 450,180 T 600,195 T 750,200"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.2"
            />

            {/* Downburst Potential Curve */}
            <path
              d="M 50,160 Q 120,152 200,144 T 320,168 T 450,180 T 600,192 T 750,195"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.8"
            />

            {/* Step markers along x-axis */}
            {HOURLY_TIMELINE.map((step, idx) => {
              const x = 50 + (idx * (700 / (HOURLY_TIMELINE.length - 1)));
              return (
                <g key={step.horizon}>
                  <line x1={x} y1="200" x2={x} y2="206" stroke="var(--text-muted)" strokeWidth="1" />
                  <text x={x} y="222" fill="var(--text-secondary)" fontSize="9" textAnchor="middle" fontWeight="500">
                    {step.horizon}
                  </text>
                  <text x={x} y="235" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    {step.time}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: 'var(--font-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '3px', background: '#F87171', display: 'inline-block' }}></span>
            <span>Lightning Risk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '3px', background: '#FBBF24', display: 'inline-block' }}></span>
            <span>Hail Potential</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '3px', background: '#38BDF8', display: 'inline-block' }}></span>
            <span>Cloudburst Probability</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '3px', background: '#34D399', display: 'inline-block' }}></span>
            <span>Downburst / Wind</span>
          </div>
        </div>
      </div>

      {/* Hourly Tabular Breakdown */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '12px' }}>
          Hourly Nowcast Step-by-Step Matrix
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-sm)', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '8px' }}>Horizon</th>
              <th style={{ padding: '8px' }}>Valid Time (IST)</th>
              <th style={{ padding: '8px' }}>Lightning</th>
              <th style={{ padding: '8px' }}>Hail</th>
              <th style={{ padding: '8px' }}>Cloudburst</th>
              <th style={{ padding: '8px' }}>Downburst</th>
              <th style={{ padding: '8px' }}>Rain Rate</th>
              <th style={{ padding: '8px' }}>Model Regime</th>
            </tr>
          </thead>
          <tbody>
            {HOURLY_TIMELINE.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px', fontWeight: 700 }}>{row.horizon}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{row.time} IST</td>
                <td style={{ padding: '8px', color: '#F87171', fontWeight: 600 }}>{row.lightning_prob}%</td>
                <td style={{ padding: '8px', color: '#FBBF24' }}>{row.hail_prob}%</td>
                <td style={{ padding: '8px', color: '#38BDF8' }}>{row.cloudburst_prob}%</td>
                <td style={{ padding: '8px', color: '#34D399' }}>{row.downburst_prob}%</td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{row.rain_rate} mm/h</td>
                <td style={{ padding: '8px' }}>
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: row.mode === 'Observation-dominant' ? 'rgba(45,212,191,0.15)' : (row.mode === 'Multi-source Fusion' ? 'rgba(96,165,250,0.15)' : 'rgba(251,191,36,0.15)'),
                      color: row.mode === 'Observation-dominant' ? 'var(--brand-teal)' : (row.mode === 'Multi-source Fusion' ? '#60A5FA' : '#FBBF24'),
                      fontSize: 'var(--font-xs)',
                      fontWeight: 600
                    }}
                  >
                    {row.mode}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
