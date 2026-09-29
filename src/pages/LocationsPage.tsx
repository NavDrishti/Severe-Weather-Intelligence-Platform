import React, { useState, useEffect } from 'react';
import { SEARCHABLE_LOCATIONS, HOURLY_TIMELINE } from '../data/mockData';
import { fetchLiveConvectiveForecast, searchLocationsLive, LiveForecastResult } from '../services/weatherService';
import { LocationCoordinates } from '../types/weather';
import { Search, MapPin, Zap, CloudHail, CloudRain, Wind, ShieldCheck, Share2, Bookmark, Thermometer, Droplets, Gauge, Loader2 } from 'lucide-react';

export const LocationsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedLoc, setSelectedLoc] = useState<LocationCoordinates>({
    name: SEARCHABLE_LOCATIONS[0].name,
    state: SEARCHABLE_LOCATIONS[0].state,
    district: SEARCHABLE_LOCATIONS[0].district,
    lat: SEARCHABLE_LOCATIONS[0].lat,
    lon: SEARCHABLE_LOCATIONS[0].lon
  });
  const [isCopied, setIsCopied] = useState(false);
  const [liveForecast, setLiveForecast] = useState<LiveForecastResult | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationCoordinates[]>(
    SEARCHABLE_LOCATIONS.map(l => ({ name: l.name, state: l.state, district: l.district, lat: l.lat, lon: l.lon }))
  );
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  // Live Geocoding Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSearchingOnline(true);
      try {
        const results = await searchLocationsLive(query);
        setSearchResults(results);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Live Convective Forecast
  useEffect(() => {
    let cancelled = false;
    setIsLoadingLive(true);
    fetchLiveConvectiveForecast(selectedLoc.lat, selectedLoc.lon)
      .then((data) => {
        if (!cancelled) {
          setLiveForecast(data);
          setIsLoadingLive(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching live location nowcast:', err);
        if (!cancelled) setIsLoadingLive(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLoc.lat, selectedLoc.lon]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };


  return (
    <div style={{ padding: '24px 20px', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Hyperlocal Location Forecast</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Search any Indian city, district headquarters, or coordinates to view calibrated convective nowcasts
        </p>

        <div style={{ position: 'relative', marginTop: '14px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            type="text"
            placeholder="Type city, district, or state name (e.g. Pune, Cherrapunji, New Delhi, Bengaluru)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
        </div>

        {/* Quick select pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          {searchResults.slice(0, 8).map((loc, idx) => (
            <button
              key={`${loc.name}-${idx}`}
              onClick={() => setSelectedLoc(loc)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: selectedLoc.name === loc.name ? 700 : 500,
                background: selectedLoc.name === loc.name ? 'var(--brand-teal)' : 'var(--bg-subtle)',
                color: selectedLoc.name === loc.name ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              {loc.name} {loc.state ? `(${loc.state})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Location Profile Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="var(--brand-teal)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedLoc.name}, {selectedLoc.state}</h2>
              {isLoadingLive && <Loader2 size={16} className="spin" color="var(--brand-teal)" />}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              District: {selectedLoc.district || selectedLoc.name} • Coordinates: {selectedLoc.lat.toFixed(2)}° N, {selectedLoc.lon.toFixed(2)}° E
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
            >
              <Share2 size={13} />
              <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
            >
              <Bookmark size={13} />
              <span>Save Location</span>
            </button>
          </div>
        </div>

        {/* Live Atmospheric Conditions */}
        {liveForecast?.current && (
          <div
            style={{
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              border: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Thermometer size={16} color="#F87171" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Temperature</div>
                <strong style={{ color: 'var(--text-primary)' }}>{liveForecast.current.temperature}°C</strong>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={16} color="#38BDF8" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Humidity</div>
                <strong style={{ color: 'var(--text-primary)' }}>{liveForecast.current.humidity}%</strong>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={16} color="#34D399" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Wind Gusts</div>
                <strong style={{ color: 'var(--text-primary)' }}>{liveForecast.current.windGusts} km/h</strong>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gauge size={16} color="#FBBF24" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CAPE Convective Energy</div>
                <strong style={{ color: 'var(--text-primary)' }}>{liveForecast.current.cape} J/kg</strong>
              </div>
            </div>
          </div>
        )}

        {/* Hazard Summary Card */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
              Current Convective Status
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {liveForecast?.current?.weatherDesc || 'Observing Convective Atmosphere'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Data Ingestion: <strong>{liveForecast?.isLive ? 'Open-Meteo High-Resolution Live Stream' : 'Calibrated Seed Model'}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Storm ETA Window</span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-teal)' }}>
              17:30 – 18:30 IST
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>≈ 15m to 1h 45m</div>
          </div>
        </div>

        {/* Hourly 0-6h Matrix */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
            0–6 Hour Probabilistic Horizon Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
            {(liveForecast?.timeline || HOURLY_TIMELINE).slice(0, 6).map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>{step.horizon}</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{step.time}</span>
                </div>
                <div style={{ color: '#F87171' }}>⚡ Lightning: <strong>{step.lightning_prob}%</strong></div>
                <div style={{ color: '#38BDF8' }}>🌧 Rain: <strong>{step.rain_rate} mm/h</strong></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{step.mode}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Actions */}
        <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-teal)', marginBottom: '8px' }}>
            <ShieldCheck size={16} />
            <span>Recommended Public Safety Measures</span>
          </h4>
          <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>Seek immediate enclosed shelter if thunder roars. Avoid standing under isolated trees or metal towers.</li>
            <li>Unplug sensitive electronic appliances and do not use landline phones during active electrical discharge.</li>
            <li>Drivers should slow down, maintain safe distance, and avoid flooded underpasses and low-lying nullahs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
