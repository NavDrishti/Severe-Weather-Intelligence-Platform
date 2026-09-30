import React, { useState, useEffect } from 'react';
import { MOCK_REPLAY_CASES } from '../data/mockData';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, AlertTriangle } from 'lucide-react';

export const ReplayPage: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState(MOCK_REPLAY_CASES[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const activeCase = MOCK_REPLAY_CASES.find(c => c.id === selectedCaseId) || MOCK_REPLAY_CASES[0];
  const totalFrames = activeCase.frames_count;

  // Frame player simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return totalFrames - 1;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalFrames]);

  const handleCaseChange = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Case Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Historical Event Replay & Benchmark Mode</h1>
          <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)' }}>
            Reproduce and verify past severe thunderstorm, cloudburst, and hail cases against ground truth observations
          </p>
        </div>

        {/* Case selector dropdown */}
        <select
          value={selectedCaseId}
          onChange={(e) => handleCaseChange(e.target.value)}
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
          {MOCK_REPLAY_CASES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.date_str})
            </option>
          ))}
        </select>
      </div>

      {/* Demonstration Banner */}
      <div
        style={{
          background: 'var(--status-amber-bg)',
          border: '1px solid var(--status-amber)',
          color: 'var(--status-amber)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <AlertTriangle size={16} />
        <span>
          <strong>Demonstration Dataset:</strong> Replay data is derived from post-event Doppler radar composites and INSAT-3DS historical runs for SIH PS 26084 verification.
        </span>
      </div>

      {/* Case Overview Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--brand-teal)', fontFamily: 'monospace', fontWeight: 700 }}>
              {activeCase.id}
            </span>
            <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>{activeCase.title}</h2>
          </div>
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--brand-sky)', color: 'var(--brand-blue)' }}>
            {activeCase.hazard_category}
          </span>
        </div>

        <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {activeCase.description}
        </p>

        {/* Verification Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-xs)' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Probability of Detection</span>
            <strong style={{ color: 'var(--status-green)', fontSize: 'var(--font-md)' }}>{(activeCase.metrics.pod * 100).toFixed(0)}%</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>False Alarm Ratio (FAR)</span>
            <strong style={{ color: '#F59E0B', fontSize: 'var(--font-md)' }}>{(activeCase.metrics.far * 100).toFixed(0)}%</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Critical Success Index</span>
            <strong style={{ fontSize: 'var(--font-md)' }}>{activeCase.metrics.csi}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Centroid Position Error</span>
            <strong style={{ fontSize: 'var(--font-md)' }}>{activeCase.metrics.position_error_km} km</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-xs)' }}>Lead Time Achieved</span>
            <strong style={{ color: 'var(--brand-teal)', fontSize: 'var(--font-md)' }}>{activeCase.lead_time_achieved}</strong>
          </div>
        </div>
      </div>

      {/* Visual Replay Player Area: Side by Side (Observed vs Model Nowcast) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Left: Observed Radar & Lightning Ground Truth */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 700 }}>
            <span>GROUND TRUTH: Observed Radar & Ground Strikes</span>
            <span style={{ color: 'var(--text-muted)' }}>Frame {currentFrame + 1} / {totalFrames}</span>
          </div>

          <div style={{ background: '#091322', borderRadius: 'var(--radius-md)', aspectRatio: '16/10', position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 400 250" style={{ width: '100%', height: '100%' }}>
              <rect width="400" height="250" fill="#091322" />
              <circle cx="200" cy="125" r="90" fill="none" stroke="#1E293B" strokeWidth="1" />
              <circle cx="200" cy="125" r="50" fill="none" stroke="#1E293B" strokeWidth="1" />
              {/* Dynamic convective cluster expanding over frames */}
              <circle
                cx={140 + currentFrame * 8}
                cy={150 - currentFrame * 4}
                r={24 + currentFrame * 1.8}
                fill="#22C55E"
                opacity="0.45"
              />
              <circle
                cx={140 + currentFrame * 8}
                cy={150 - currentFrame * 4}
                r={16 + currentFrame * 1.2}
                fill="#EAB308"
                opacity="0.7"
              />
              <circle
                cx={140 + currentFrame * 8}
                cy={150 - currentFrame * 4}
                r={8 + currentFrame * 0.8}
                fill="#EF4444"
                opacity="0.9"
              />
              {/* Ground lightning flashes */}
              {[...Array(6)].map((_, i) => (
                <text
                  key={i}
                  x={125 + currentFrame * 8 + (i * 9) % 30}
                  y={145 - currentFrame * 4 + (i * 7) % 25}
                  fill="#F87171"
                  fontSize="12"
                >
                  ⚡
                </text>
              ))}
            </svg>
            <div style={{ position: 'absolute', bottom: '8px', left: '10px', fontSize: 'var(--font-xs)', color: '#CBD5E1' }}>
              Observed Peak Core: {activeCase.peak_intensity}
            </div>
          </div>
        </div>

        {/* Right: NavDrishti AI AI Nowcast & Corridor */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 700 }}>
            <span>MODEL NOWCAST: Extrapolated Corridor & Probability</span>
            <span style={{ color: 'var(--brand-teal)' }}>Fused Extrapolation</span>
          </div>

          <div style={{ background: '#091322', borderRadius: 'var(--radius-md)', aspectRatio: '16/10', position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 400 250" style={{ width: '100%', height: '100%' }}>
              <rect width="400" height="250" fill="#091322" />
              <circle cx="200" cy="125" r="90" fill="none" stroke="#1E293B" strokeWidth="1" />
              <circle cx="200" cy="125" r="50" fill="none" stroke="#1E293B" strokeWidth="1" />
              {/* Forecast track corridor */}
              <line x1="140" y1="150" x2="280" y2="80" stroke="#2DD4BF" strokeWidth="2.5" strokeDasharray="6,4" />
              {/* Model predicted centroid */}
              <circle
                cx={138 + currentFrame * 8.2}
                cy={151 - currentFrame * 4.1}
                r={26 + currentFrame * 1.5}
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="2"
              />
              <circle
                cx={138 + currentFrame * 8.2}
                cy={151 - currentFrame * 4.1}
                r={4}
                fill="#2DD4BF"
              />
              <text
                x={145 + currentFrame * 8.2}
                y={150 - currentFrame * 4.1}
                fill="#2DD4BF"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                Pred: T+{(currentFrame * 10)}m
              </text>
            </svg>
            <div style={{ position: 'absolute', bottom: '8px', left: '10px', fontSize: 'var(--font-xs)', color: '#2DD4BF' }}>
              Centroid Error at this step: {(3.2 + (currentFrame * 0.15)).toFixed(1)} km
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Scrubber & Player Controls */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setCurrentFrame(0)}
            style={{ padding: '6px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}
            title="Reset to Start"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
            style={{ padding: '6px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}
            title="Step Back"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '8px 18px',
              backgroundColor: 'var(--brand-teal)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: 'var(--font-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause Replay' : 'Play Replay'}</span>
          </button>
          <button
            onClick={() => setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1))}
            style={{ padding: '6px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}
            title="Step Forward"
          >
            <SkipForward size={16} />
          </button>

          {/* Scrubber slider */}
          <input
            type="range"
            min="0"
            max={totalFrames - 1}
            value={currentFrame}
            onChange={(e) => setCurrentFrame(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--brand-teal)' }}
          />

          <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-base)', fontWeight: 700, minWidth: '85px', textAlign: 'right' }}>
            +{currentFrame * 10} min
          </span>
        </div>
      </div>
    </div>
  );
};
