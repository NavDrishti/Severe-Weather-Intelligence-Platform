import React from 'react';
import { HourlyForecastStep } from '../../types/weather';
import { HOURLY_TIMELINE } from '../../data/mockData';
import { CloudRain, CloudLightning, Sun, Cloud, ChevronDown } from 'lucide-react';

interface ForecastTimelineProps {
  selectedHorizonIndex: number;
  onSelectHorizon: (index: number) => void;
  timeline?: HourlyForecastStep[];
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  selectedHorizonIndex,
  onSelectHorizon,
  timeline = HOURLY_TIMELINE
}) => {
  const currentStep = timeline[selectedHorizonIndex] || timeline[0] || HOURLY_TIMELINE[0];



  const getWeatherIcon = (weatherType: string) => {
    switch (weatherType) {
      case 'thunderstorm':
      case 'heavy_rain_lightning':
      case 'cloudburst_watch':
      case 'rain_thunder':
        return <CloudLightning className="step-icon" size={16} color="#38BDF8" />;
      case 'moderate_rain':
      case 'light_rain':
      case 'passing_showers':
        return <CloudRain className="step-icon" size={16} color="#60A5FA" />;
      case 'cloudy':
      case 'partly_cloudy':
        return <Cloud className="step-icon" size={16} color="#94A3B8" />;
      case 'clear':
      default:
        return <Sun className="step-icon" size={16} color="#FBBF24" />;
    }
  };

  return (
    <div className="bottom-timeline-strip" role="region" aria-label="Forecast Timeline">
      {/* Metric on left */}
      <div className="timeline-horizon-metric">
        <span className="val">{currentStep.horizon_pct}%</span>
        <span className="sub">Forecast Horizon 6h 0m</span>
      </div>

      {/* Horizontal Steps */}
      <div className="timeline-steps-track">
        {timeline.map((step, idx) => (
          <button
            key={`${step.horizon}-${idx}`}
            className={`timeline-step-btn ${selectedHorizonIndex === idx ? 'active' : ''}`}
            onClick={() => onSelectHorizon(idx)}
            title={`Horizon: ${step.horizon} (${step.time}) - ${step.mode}`}
          >
            {getWeatherIcon(step.weather)}
            <span className="step-label">{step.horizon}</span>
            <span className="step-regime">
              {idx <= 3 ? 'Obs' : idx <= 6 ? 'Fusion' : 'NWP'}
            </span>
          </button>
        ))}
      </div>

      {/* Regional Setup Selector */}
      <div style={{ position: 'relative' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}
        >
          <span>Regional Setup</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
};
