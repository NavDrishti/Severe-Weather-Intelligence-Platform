import React, { useState } from 'react';
import { MOCK_DATA_HEALTH } from '../data/mockData';
import { DataSourceHealth } from '../types/weather';
import { fetchDataHealth } from '../api/client';
import { CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';

export const DataHealthPage: React.FC = () => {
  const [sources, setSources] = useState<DataSourceHealth[]>(MOCK_DATA_HEALTH);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshHealth = async () => {
    setIsRefreshing(true);
    const data = await fetchDataHealth();
    setSources(data);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Data Source Health & Pipeline Telemetry</h1>
          <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)' }}>
            Real-time ingestion latency, cadence tracking, quality flags, and degraded-mode fallback states
          </p>
        </div>

        <button
          onClick={refreshHealth}
          disabled={isRefreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Polling Sensors...' : 'Refresh Source Health'}</span>
        </button>
      </div>

      {/* Pipeline Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          background: 'var(--bg-surface)',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          fontSize: 'var(--font-xs)'
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Pipeline End-to-End Latency</span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--brand-teal)', marginTop: '2px' }}>
            38.5s
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Target &lt; 60s for nowcast cycle</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>AI Inference Serving Latency</span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#60A5FA', marginTop: '2px' }}>
            420 ms
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>ONNX / PyTorch accelerated</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Degraded Mode Status</span>
          <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
            AWS Fallback Active
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Radar & INSAT operational</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Sensor Network Coverage</span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--status-green)', marginTop: '2px' }}>
            96.8%
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Pan-India operational mesh</span>
        </div>
      </div>

      {/* Source Health Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        {sources.map((src) => (
          <div
            key={src.key}
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
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{src.name}</h3>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{src.type}</span>
              </div>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-xs)',
                  fontWeight: 700,
                  background: src.status === 'healthy' ? 'var(--status-green-bg)' : (src.status === 'delayed' ? 'var(--status-amber-bg)' : 'var(--status-red-bg)'),
                  color: src.status === 'healthy' ? 'var(--status-green)' : (src.status === 'delayed' ? 'var(--status-amber)' : 'var(--status-red)')
                }}
              >
                {src.status === 'healthy' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                <span>{src.status_label}</span>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-xs)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Last Feed Update:</span>
                <strong>{src.last_updated_minutes} min ago</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Expected Cadence:</span>
                <strong>Every {src.cadence_minutes} min</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Data Quality Score:</span>
                <strong>{(src.quality_score * 100).toFixed(0)}%</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Observations (1h):</span>
                <strong>{src.observations_count.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
              <div>Coverage Domain: <strong>{src.coverage}</strong></div>
              <div style={{ marginTop: '2px' }}>
                Degraded Fallback: <strong style={{ color: 'var(--brand-teal)' }}>{src.fallback}</strong>
              </div>
            </div>

            {/* Ingestion Ping History */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-xs)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Recent Cadence Pings:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {src.history.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: '18px',
                      height: '8px',
                      borderRadius: '2px',
                      background: h === 'OK' ? '#10B981' : '#F59E0B'
                    }}
                    title={h}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
