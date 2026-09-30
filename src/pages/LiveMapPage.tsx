import React, { useState } from 'react';
import { InteractiveGisMap } from '../components/map/InteractiveGisMap';
import { StormDetailDrawer } from '../components/storms/StormDetailDrawer';
import { MOCK_STORMS, INITIAL_LOCATION } from '../data/mockData';
import { StormCell } from '../types/weather';

interface LiveMapPageProps {
  theme: 'light' | 'dark';
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({ theme }) => {
  const [selectedStorm, setSelectedStorm] = useState<StormCell | null>(null);
  const [radarOpacity, setRadarOpacity] = useState<number>(85);
  const [lightningDensityOpacity, setLightningDensityOpacity] = useState<number>(75);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 110px)', padding: '12px' }}>
      {/* Top Map Control Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-surface)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '8px',
          fontSize: 'var(--font-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <strong style={{ fontSize: 'var(--font-base)', color: 'var(--text-primary)' }}>Full-Screen GIS Explorer</strong>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span>Active Convective Cells: <strong>{MOCK_STORMS.length}</strong></span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span>Projection: <strong>EPSG:4326 (WGS 84)</strong></span>
        </div>

        {/* Opacity Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Radar dBZ Opacity:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={radarOpacity}
              onChange={(e) => setRadarOpacity(Number(e.target.value))}
              style={{ width: '80px', accentColor: 'var(--brand-teal)' }}
            />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{radarOpacity}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Lightning Opacity:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={lightningDensityOpacity}
              onChange={(e) => setLightningDensityOpacity(Number(e.target.value))}
              style={{ width: '80px', accentColor: '#EF4444' }}
            />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{lightningDensityOpacity}%</span>
          </div>
        </div>
      </div>

      {/* Main Full GIS Map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
        <InteractiveGisMap
          storms={MOCK_STORMS}
          selectedStormId={selectedStorm?.id}
          onSelectStorm={(s) => setSelectedStorm(s)}
          userLocation={INITIAL_LOCATION}
          theme={theme}
        />

        {/* Storm Details Drawer if clicked */}
        <StormDetailDrawer
          storm={selectedStorm}
          onClose={() => setSelectedStorm(null)}
        />
      </div>
    </div>
  );
};
